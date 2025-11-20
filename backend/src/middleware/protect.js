import { verifyToken } from '../utils/auth.js';
import AppError from '../utils/AppError.js';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * Protect routes - verify JWT token
 */
const protect = catchAsync(async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Get token from cookie
  if (!token && req.cookies) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new AppError('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    // Add user to request
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new AppError('User not found', 404));
    }

    next();
  } catch (error) {
    return next(new AppError('Not authorized to access this route', 401));
  }
});

export default protect;
