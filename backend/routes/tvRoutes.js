const express = require("express");
const router = express.Router();

const {
  createTV,
  getAllTVs,
  getTV,
  updateTV,
  deleteTV,
  addReview,
  updateStock
} = require("../controllers/tvController");

const {
  protect,
  adminOnly
} = require("../middleware/auth");

router.get("/", getAllTVs);
router.get("/:id", getTV);

router.post("/", protect, adminOnly, createTV);
router.put("/:id", protect, adminOnly, updateTV);
router.delete("/:id", protect, adminOnly, deleteTV);

router.post("/:id/review", protect, addReview);
router.patch("/:id/stock", protect, adminOnly, updateStock);

module.exports = router;