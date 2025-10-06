const jwt = require('jsonwebtoken')
module.exports = function auth(req, res, next) {
  
  const authHeader = req.headers['authorization'] || req.header('Authorization');
  
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
