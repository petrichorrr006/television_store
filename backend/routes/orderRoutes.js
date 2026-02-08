const express = require("express");
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateStatus,
  cancelOrder,
  totalSalesPerTV
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/auth");
const { validateOrder } = require("../middleware/validate");

router.post("/", protect, validateOrder, createOrder);
router.get("/my", protect, getUserOrders);
router.patch("/:id/cancel", protect, cancelOrder);

router.get("/", protect, adminOnly, getAllOrders);
router.patch("/:id/status", protect, adminOnly, updateStatus);
router.get("/stats/sales", protect, adminOnly, totalSalesPerTV);

module.exports = router;