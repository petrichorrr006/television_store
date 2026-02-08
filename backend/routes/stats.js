const router = require("express").Router();
const { getSalesStats } = require("../controllers/statsController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/sales", auth, admin, getSalesStats);

module.exports = router;