const Order = require("../models/Order");
const TV = require("../models/TV");

exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    let total = 0;
    for (let item of items) {
      const tv = await TV.findById(item.tvId);
      if (!tv) return res.status(404).json({ message: "TV not found" });

      if (tv.stock < item.quantity)
        return res.status(400).json({ message: "Not enough stock" });

      total += tv.price * item.quantity;

      await TV.findByIdAndUpdate(item.tvId, { $inc: { stock: -item.quantity } });
      item.price = tv.price; 
    }

    const order = await Order.create({
      userId: req.user.id,
      items,
      total
    });

    res.status(201).json(order);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("items.tvId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId").populate("items.tvId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.totalSalesPerTV = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $unwind: "$items" },
      { $group: {
          _id: "$items.tvId",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
      }},
      { $sort: { totalRevenue: -1 } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};