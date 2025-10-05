const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Authorization header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ error: "No Authorization header" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token found in Authorization header" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
