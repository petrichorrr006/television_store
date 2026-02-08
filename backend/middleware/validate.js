exports.validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ message: "Name must be at least 2 characters" });
  }
  
  if (!email || !email.match(/^\S+@\S+\.\S+$/)) {
    return res.status(400).json({ message: "Valid email is required" });
  }
  
  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }
  
  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  
  next();
};

exports.validateTV = (req, res, next) => {
  const { brand, model, price } = req.body;
  
  if (!brand || brand.trim().length < 2) {
    return res.status(400).json({ message: "Brand is required" });
  }
  
  if (!model || model.trim().length < 2) {
    return res.status(400).json({ message: "Model is required" });
  }
  
  if (!price || price < 0) {
    return res.status(400).json({ message: "Valid price is required" });
  }
  
  next();
};

exports.validateReview = (req, res, next) => {
  const { rating, comment } = req.body;
  
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }
  
  if (!comment || comment.trim().length < 5) {
    return res.status(400).json({ message: "Comment must be at least 5 characters" });
  }
  
  next();
};

exports.validateOrder = (req, res, next) => {
  const { items } = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order must contain at least one item" });
  }
  
  for (let item of items) {
    if (!item.tvId || !item.quantity || item.quantity < 1) {
      return res.status(400).json({ 
        message: "Each item must have valid tvId and quantity >= 1" 
      });
    }
  }
  
  next();
};