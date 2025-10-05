const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // ✅ used in controller
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(403).json({ error: "Invalid or expired token" });
  }
}

module.exports = verifyToken;
