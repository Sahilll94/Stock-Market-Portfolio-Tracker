/**
 * Generate a random OTP
 * @param {number} length - Length of OTP (default: 6)
 * @returns {string} Generated OTP
 */
export const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
};

/**
 * Check if OTP is expired
 * @param {Date} expirationTime - OTP expiration timestamp
 * @returns {boolean} True if expired, false otherwise
 */
export const isOTPExpired = (expirationTime) => {
  if (!expirationTime) return true;
  return new Date() > new Date(expirationTime);
};

/**
 * Get OTP expiration time (15 minutes from now)
 * @returns {Date} Expiration timestamp
 */
export const getOTPExpirationTime = () => {
  const now = new Date();
  return new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes
};
