// middleware/auth.js
const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/BlacklistedToken');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    const token = authHeader.split(' ')[1];

    // check token in blacklisted tokens
    const blacklisted = await BlacklistedToken.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ message: 'Token is invalidated' });
    }

    // token verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // save the decoded token to request object
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
