const router = require("express").Router();

const {
  protect,
  adminOnly
} = require("../middleware/auth");

const {
  getSalesStats
} = require("../controllers/statsController");

router.get("/sales", protect, adminOnly, getSalesStats);

module.exports = router;
