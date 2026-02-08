const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  comment: String
}, {
  timestamps: true
});

const tvSchema = new mongoose.Schema({

  brand: {
    type: String,
    required: true,
    index: true
  },

  model: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  stock: {
    type: Number,
    default: 0
  },

  specs: {
    size: String,
    resolution: String,
    smartTV: Boolean,
    hdmiPorts: Number
  },

  reviews: [reviewSchema]

}, {
  timestamps: true
});

tvSchema.index({ brand: 1, price: -1 });

module.exports = mongoose.model("TV", tvSchema);