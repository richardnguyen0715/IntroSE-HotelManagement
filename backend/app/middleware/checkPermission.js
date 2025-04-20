const User = require('../models/User');

/**
 * Middleware to check if user has permission to perform update or delete operations
 * @param {Array} allowedRoles - Array of roles that are allowed to perform the action
 * @returns {Function} - Express middleware function
 */
const checkPermission = (allowedRoles = ['admin']) => {
  return async (req, res, next) => {
    try {
      // Get user from request (assuming authentication middleware has set this)
      const userId = req.user && req.user.id;
      
      if (!userId) {
        const error = new Error('Not authorized, please login');
        error.statusCode = 401;
        return next(error);
      }

      // Find user by ID
      const user = await User.findById(userId);
      
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 401;
        return next(error);
      }

      // Check if user role is in allowed roles
      if (!allowedRoles.includes(user.role)) {
        const error = new Error('You do not have permission to perform this action');
        error.statusCode = 403;
        return next(error);
      }

      // User has permission, proceed to next middleware
      next();
    } catch (error) {
      error.statusCode = error.statusCode || 500;
      error.message = error.message || 'Server error while checking permissions';
      next(error);
    }
  };
};

module.exports = checkPermission;
