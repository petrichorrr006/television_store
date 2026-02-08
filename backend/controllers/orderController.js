const Order = require("../models/Order");
const TV = require("../models/TV");

exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    let total = 0;
    const orderItems = [];

    for (let item of items) {
      const tv = await TV.findById(item.tvId);
      
      if (!tv) {
        return res.status(404).json({ 
          message: `TV with id ${item.tvId} not found` 
        });
      }

      if (tv.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Not enough stock for ${tv.brand} ${tv.model}. Available: ${tv.stock}` 
        });
      }

      total += tv.price * item.quantity;

      await TV.findByIdAndUpdate(
        item.tvId, 
        { $inc: { stock: -item.quantity } }
      );

      orderItems.push({
        tvId: item.tvId,
        quantity: item.quantity,
        price: tv.price
      });
    }

    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      total
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('items.tvId', 'brand model')
      .populate('userId', 'name email');

    res.status(201).json(populatedOrder);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("items.tvId", "brand model price")
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) {
      filter.status = status;
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const orders = await Order.find(filter)
      .populate("userId", "name email")
      .populate("items.tvId", "brand model")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Order.countDocuments(filter);
    
    res.json({
      data: orders,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!["pending", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status. Must be: pending, completed, or cancelled" 
      });
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    ).populate("items.tvId", "brand model")
     .populate("userId", "name email");
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!order) {
      return res.status(404).json({ 
        message: "Order not found or you don't have permission" 
      });
    }
    
    if (order.status !== "pending") {
      return res.status(400).json({ 
        message: "Only pending orders can be cancelled" 
      });
    }
    
    for (let item of order.items) {
      await TV.findByIdAndUpdate(
        item.tvId,
        { $inc: { stock: item.quantity } }
      );
    }
    
    order.status = "cancelled";
    await order.save();
    
    res.json({ 
      message: "Order cancelled successfully",
      order 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.totalSalesPerTV = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $match: { status: "completed" } },
      
      { $unwind: "$items" },
      
      {
        $lookup: {
          from: "tvs",
          localField: "items.tvId",
          foreignField: "_id",
          as: "tvDetails"
        }
      },
      
      { $unwind: "$tvDetails" },
      
      {
        $group: {
          _id: "$items.tvId",
          brand: { $first: "$tvDetails.brand" },
          model: { $first: "$tvDetails.model" },
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { 
            $sum: { $multiply: ["$items.quantity", "$items.price"] } 
          },
          orderCount: { $sum: 1 }
        }
      },
      
      { $sort: { totalRevenue: -1 } },
      
      { $limit: 10 }
    ]);
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};