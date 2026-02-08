const TV = require("../models/TV");

exports.createTV = async (req, res) => {
  try {
    const tv = await TV.create(req.body);
    res.status(201).json(tv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllTVs = async (req, res) => {
  try {
    const tvs = await TV.find();
    res.json(tvs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTV = async (req, res) => {
  try {
    const tv = await TV.findById(req.params.id);
    if (!tv) {
      return res.status(404).json({ message: "TV not found" });
    }
    res.json(tv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTV = async (req, res) => {
  try {
    const tv = await TV.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(tv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTV = async (req, res) => {
  try {
    await TV.findByIdAndDelete(req.params.id);
    res.json({ message: "TV deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = {
      userId: req.user.id,
      rating,
      comment
    };
    const tv = await TV.findByIdAndUpdate(
      req.params.id,
      { $push: { reviews: review } },
      { new: true }
    );
    res.json(tv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { value } = req.body;
    const tv = await TV.findByIdAndUpdate(
      req.params.id,
      { $inc: { stock: value } },
      { new: true }
    );
    res.json(tv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};