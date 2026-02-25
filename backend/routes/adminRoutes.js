const express = require("express");
const protect = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  roleMiddleware(["admin"]),
  (req, res) => {
    res.json({ message: "Admin dashboard access granted" });
  }
);

module.exports = router;
