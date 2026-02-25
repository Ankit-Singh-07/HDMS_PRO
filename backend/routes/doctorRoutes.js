const express = require("express");
const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  allowRoles("doctor"),
  (req, res) => {
    res.json({
      message: "Doctor Dashboard Access Granted ✅",
      user: req.user,
    });
  }
);

module.exports = router;
