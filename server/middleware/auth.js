function auth(req, res, next) {
  console.log("Authorization header:", req.headers.authorization);
  const authHeader = req.headers['authorization'] || req.header('Authorization');
  console.log("Auth header received:", authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
