const jwt = require('jsonwebtoken');
const { AppError } = require('../infra/error');

function authRequired(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return next(new AppError(401, 'Not authenticated'));
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, username, role }
    next();
  } catch {
    next(new AppError(401, 'Invalid/expired token'));
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) return next(new AppError(403, 'Forbidden'));
    next();
  };
}

module.exports = { authRequired, requireRole };