const jwt = require('jsonwebtoken');
const config = require('../config/auth');

function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed: No token provided' });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Authentication failed: Invalid token' });
    }

    req.userId = decoded.id;
    next();
  });
}

module.exports = authMiddleware;
