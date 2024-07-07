const jwt = require('jsonwebtoken');
const { isBlacklisted } = require('../helpers/blacklist');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'No token provided',
      statusCode: 401,
    });
  }

  if (isBlacklisted(token)) {
    return res.status(401).json({
      status: 'error',
      message: 'Token is blacklisted',
      statusCode: 401,
    });
  }

  jwt.verify(token, 'secretKey', (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: 'error',
        message: 'Failed to authenticate token',
        statusCode: 401,
      });
    }

    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
