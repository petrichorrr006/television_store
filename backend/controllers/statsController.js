const Order = require("../models/Order");

exports.getSalesStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([

      { $unwind: "$items" },

      {
        $lookup: {
          from: "tvs",
          localField: "items.tvId",
          foreignField: "_id",
          as: "tv"
        }
      },

      { $unwind: "$tv" },

      {
        $group: {
          _id: "$tv.brand",
          totalSold: { $sum: "$items.quantity" },
          revenue: {
            $sum: {
              $multiply: ["$items.quantity", "$tv.price"]
            }
          }
        }
      },

      { $sort: { revenue: -1 } }
    ]);

    res.json(stats);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};