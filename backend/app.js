const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const tvRoutes = require("./routes/tvRoutes");
const orderRoutes = require("./routes/orderRoutes");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/tvs", tvRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stats", require("./routes/stats"));

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
    res.send("Welcome to the Television Store API");
});

module.exports = app;