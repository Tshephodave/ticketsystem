const jwt = require('jsonwebtoken');
const secret = 'order_web_2024';

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Access denied. No token provided.' });

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRole };
