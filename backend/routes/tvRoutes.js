const express = require("express");
const router = express.Router();

const {
  createTV,
  getAllTVs,
  getTV,
  updateTV,
  deleteTV,
  addReview,
  deleteReview,
  updateReview,
  updateStock,
  removeFields,
  getTVsByBrand
} = require("../controllers/tvController");

const {
  protect,
  adminOnly
} = require("../middleware/auth");

const {
  validateTV,
  validateReview
} = require("../middleware/validate");

router.get("/", getAllTVs); 
router.get("/stats/brands", getTVsByBrand);
router.get("/:id", getTV);

router.post("/", protect, adminOnly, validateTV, createTV);
router.put("/:id", protect, adminOnly, updateTV);
router.delete("/:id", protect, adminOnly, deleteTV);
router.patch("/:id/stock", protect, adminOnly, updateStock);
router.patch("/:id/remove-fields", protect, adminOnly, removeFields); 

router.post("/:id/review", protect, validateReview, addReview);
router.delete("/:id/review/:reviewId", protect, deleteReview);        
router.put("/:id/review/:reviewId", protect, validateReview, updateReview);  

module.exports = router;