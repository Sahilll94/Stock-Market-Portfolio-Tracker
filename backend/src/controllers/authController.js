import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { sendTokenResponse } from '../utils/auth.js';
import { verifyIdToken } from '../services/firebaseAdmin.js';
import { generateOTP, isOTPExpired, getOTPExpirationTime } from '../utils/otp.js';
import emailService from '../services/EmailService.js';

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

/**
 * Forgot Password - Send OTP to email
 * POST /api/auth/forgot-password
 */
export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // Validate input
  if (!email) {
    return next(new AppError('Please provide an email address', 400));
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if email exists or not (security best practice)
    return res.status(200).json({
      success: true,
      message: 'If an account exists with this email, an OTP has been sent'
    });
  }

  // Check if email service is configured
  if (!emailService.isConfigured()) {
    return next(new AppError('Email service is not configured. Please contact support.', 500));
  }

  try {
    // Generate OTP
    const otp = generateOTP(6);
    const expirationTime = getOTPExpirationTime();

    // Save OTP to user
    user.resetOTP = otp;
    user.resetOTPExpires = expirationTime;
    await user.save();

    // Send OTP email
    await emailService.sendOTPEmail(email, otp, process.env.APP_NAME || 'PortfolioTrack');

    res.status(200).json({
      success: true,
      message: 'OTP has been sent to your email address'
    });
  } catch (error) {
    console.error('Error in forgot password:', error);
    return next(new AppError('Failed to send OTP. Please try again later.', 500));
  }
});

/**
 * Verify OTP
 * POST /api/auth/verify-otp
 */
export const verifyOTP = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  // Validate input
  if (!email || !otp) {
    return next(new AppError('Please provide email and OTP', 400));
  }

  // Find user with OTP (need to select the hidden field)
  const user = await User.findOne({ email }).select('+resetOTP +resetOTPExpires');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check if OTP exists and is not expired
  if (!user.resetOTP) {
    return next(new AppError('No OTP request found. Please request a new OTP.', 400));
  }

  if (isOTPExpired(user.resetOTPExpires)) {
    user.resetOTP = null;
    user.resetOTPExpires = null;
    await user.save();
    return next(new AppError('OTP has expired. Please request a new OTP.', 400));
  }

  // Check if OTP matches
  if (user.resetOTP !== otp) {
    return next(new AppError('Invalid OTP', 400));
  }

  // OTP is valid, create a temporary token for password reset
  const resetToken = user._id.toString();

  res.status(200).json({
    success: true,
    message: 'OTP verified successfully',
    data: {
      resetToken, // This token is used for the next step
      email: user.email
    }
  });
});

/**
 * Reset Password
 * POST /api/auth/reset-password
 */
export const resetPassword = catchAsync(async (req, res, next) => {
  const { email, newPassword, confirmPassword } = req.body;

  // Validate input
  if (!email || !newPassword || !confirmPassword) {
    return next(new AppError('Please provide email, new password, and confirmation password', 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new AppError('Passwords do not match', 400));
  }

  if (newPassword.length < 6) {
    return next(new AppError('Password must be at least 6 characters', 400));
  }

  // Find user with OTP
  const user = await User.findOne({ email }).select('+resetOTP +resetOTPExpires');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check if OTP still exists (verify OTP was successful)
  if (!user.resetOTP) {
    return next(new AppError('Invalid password reset request. Please start over.', 400));
  }

  // Update password
  user.password = newPassword;
  user.resetOTP = null;
  user.resetOTPExpires = null;
  await user.save();

  try {
    // Send success email
    await emailService.sendPasswordResetSuccessEmail(email, process.env.APP_NAME || 'PortfolioTrack');
  } catch (error) {
    console.error('Failed to send success email:', error);
    // Don't fail the password reset if email fails
  }

  res.status(200).json({
    success: true,
    message: 'Password has been reset successfully. Please log in with your new password.'
  });
});
