import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { sendTokenResponse } from '../utils/auth.js';
import { verifyIdToken } from '../services/firebaseAdmin.js';

/**
 * Register user
 * POST /api/auth/register
 */
export const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return next(new AppError('Please provide name, email, and password', 400));
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError('Email already registered', 400));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  // Send token response
  sendTokenResponse(user, 201, res);
});

/**
 * Login user
 * POST /api/auth/login
 */
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Check for user (password field is hidden by default, so we need to explicitly select it)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('Invalid credentials', 401));
  }

  // Check if password matches
  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    return next(new AppError('Invalid credentials', 401));
  }

  // Send token response
  sendTokenResponse(user, 200, res);
});

/**
 * Get current user
 * GET /api/auth/me
 */
export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      user
    }
  });
});

/**
 * Logout user
 * GET /api/auth/logout
 */
export const logout = catchAsync(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * Update user profile
 * PUT /api/auth/update-profile
 */
export const updateProfile = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;

  // Check if email is already taken by another user
  if (email && email !== req.user.email) {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new AppError('Email already registered', 400));
    }
  }

  // Update user
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: name || req.user.name,
      email: email || req.user.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user
    }
  });
});

/**
 * Change password
 * PUT /api/auth/change-password
 */
export const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError('Please provide current and new password', 400));
  }

  // Get user with password field
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isPasswordMatch = await user.matchPassword(currentPassword);
  if (!isPasswordMatch) {
    return next(new AppError('Current password is incorrect', 401));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Send token response with new token
  sendTokenResponse(user, 200, res);
});

/**
 * Google OAuth Sign-In/Sign-Up
 * POST /api/auth/google-signin
 */
export const googleSignIn = catchAsync(async (req, res, next) => {
  const { idToken, displayName, email, photoURL } = req.body;

  // Validate required fields
  if (!idToken || !email) {
    return next(new AppError('Firebase ID token and email are required', 400));
  }

  try {
    // Verify Firebase ID token
    const decodedToken = await verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;

    // Check if user exists by email
    let user = await User.findOne({ email });

    if (user) {
      // User exists - update last login and firebase details if needed
      if (!user.firebaseUid) {
        user.firebaseUid = firebaseUid;
      }
      if (!user.photoURL && photoURL) {
        user.photoURL = photoURL;
      }
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
      }
      user.authProvider = 'google';
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user from Google data
      user = await User.create({
        name: displayName || email.split('@')[0],
        email,
        firebaseUid,
        photoURL: photoURL || null,
        authProvider: 'google',
        isEmailVerified: true, // Google users are pre-verified
        lastLogin: new Date()
      });
    }

    // Send token response
    sendTokenResponse(user, 201, res);

  } catch (error) {
    console.error('Google sign-in error:', error);

    if (error.message.includes('Firebase')) {
      return next(new AppError(error.message, 401));
    }

    if (error.code === 11000) {
      return next(new AppError('Email already registered', 400));
    }

    return next(new AppError('Authentication failed: ' + error.message, 500));
  }
});
