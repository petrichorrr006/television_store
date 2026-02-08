const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  tvId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TV",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [orderItemSchema],

  total: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending"
  }

}, {
  timestamps: true
});

orderSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model("Order", orderSchema);