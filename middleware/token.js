const jwt = require("jsonwebtoken");
const token = (req, res, next) => {
  const token = req.header("token");
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const secret = process.env.SECRET || 'Please Set The Secret'
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (err) {
    res.status(400).json({ error: "Token is expired/not valid" });
  }
};

module.exports = token;
