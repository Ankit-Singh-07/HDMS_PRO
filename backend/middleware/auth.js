const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "NO_TOKEN" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 FULL USER FETCH (IMPORTANT)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "USER_NOT_FOUND" });
    }

    req.user = user; // ✅ FULL USER OBJECT
    next();
  } catch (err) {
    return res.status(401).json({ message: "INVALID_TOKEN" });
  }
};

module.exports = auth;
