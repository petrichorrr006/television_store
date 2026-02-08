const TV = require("../models/TV");

exports.getAllTVs = async (req, res) => {
  try {
    const { 
      brand, 
      minPrice, 
      maxPrice, 
      smartTV,
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const filter = {};
    
    if (brand) {
      filter.brand = new RegExp(brand, 'i');
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (smartTV !== undefined) {
      filter['specs.smartTV'] = smartTV === 'true';
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    const tvs = await TV.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(Number(limit));

    const total = await TV.countDocuments(filter);

    res.json({
      data: tvs,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTV = async (req, res) => {
  try {
    const tv = await TV.create(req.body);
    res.status(201).json(tv);
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
      { new: true, runValidators: true }
    );
    
    if (!tv) {
      return res.status(404).json({ message: "TV not found" });
    }
    
    res.json(tv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTV = async (req, res) => {
  try {
    const tv = await TV.findByIdAndDelete(req.params.id);
    
    if (!tv) {
      return res.status(404).json({ message: "TV not found" });
    }
    
    res.json({ message: "TV deleted successfully" });
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
    ).populate('reviews.userId', 'name email');
    
    if (!tv) {
      return res.status(404).json({ message: "TV not found" });
    }
    
    res.json(tv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const tv = await TV.findByIdAndUpdate(
      req.params.id,
      { 
        $pull: { 
          reviews: { _id: reviewId } 
        } 
      },
      { new: true }
    );
    
    if (!tv) {
      return res.status(404).json({ message: "TV not found" });
    }
    
    res.json({ 
      message: "Review deleted successfully",
      tv 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    
    const tv = await TV.findOneAndUpdate(
      { 
        _id: req.params.id,
        'reviews._id': reviewId 
      },
      { 
        $set: {
          'reviews.$.rating': rating,
          'reviews.$.comment': comment
        }
      },
      { new: true }
    ).populate('reviews.userId', 'name email');
    
    if (!tv) {
      return res.status(404).json({ 
        message: "TV or review not found" 
      });
    }
    
    res.json(tv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { value } = req.body;
    
    if (!value || typeof value !== 'number') {
      return res.status(400).json({ 
        message: "Value must be a number" 
      });
    }
    
    const tv = await TV.findByIdAndUpdate(
      req.params.id,
      { $inc: { stock: value } },
      { new: true }
    );
    
    if (!tv) {
      return res.status(404).json({ message: "TV not found" });
    }
    
    if (tv.stock < 0) {
      tv.stock = 0;
      await tv.save();
    }
    
    res.json(tv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFields = async (req, res) => {
  try {
    const { fields } = req.body;
    
    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ 
        message: "Fields array is required" 
      });
    }
    
    const unsetObj = {};
    fields.forEach(field => {
      unsetObj[field] = "";
    });
    
    const tv = await TV.findByIdAndUpdate(
      req.params.id,
      { $unset: unsetObj },
      { new: true }
    );
    
    if (!tv) {
      return res.status(404).json({ message: "TV not found" });
    }
    
    res.json({ 
      message: "Fields removed successfully",
      tv 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTVsByBrand = async (req, res) => {
  try {
    const stats = await TV.aggregate([
      {
        $group: {
          _id: "$brand",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          totalStock: { $sum: "$stock" }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};