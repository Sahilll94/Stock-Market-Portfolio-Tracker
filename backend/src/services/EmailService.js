import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      const emailUser = process.env.EMAIL_USER;
      const emailPassword = process.env.EMAIL_PASSWORD;

      if (!emailUser || !emailPassword) {
        console.warn('Email credentials not configured. Email service disabled.');
        return;
      }

      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPassword
        }
      });

      console.log('Email service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize email service:', error.message);
    }
  }

  /**
   * Send OTP to user email
   * @param {string} email - User email
   * @param {string} otp - One-time password
   * @param {string} appName - Application name
   * @returns {Promise}
   */
  async sendOTPEmail(email, otp, appName = 'PortfolioTrack') {
    try {
      if (!this.transporter) {
        throw new Error('Email service not configured');
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `${appName} - Password Reset OTP`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; background: #ffffff;">
            <!-- Logo Section -->
            <div style="text-align: center; padding: 30px 20px; border-bottom: 1px solid #f0f0f0;">
              <img src="https://storage.googleapis.com/kq-storage.kalvium.community/coa%2FportfolioTrack-logo.png" alt="${appName}" style="height: 40px; object-fit: contain;">
            </div>
            
            <!-- Content Section -->
            <div style="padding: 30px 20px;">
              <h2 style="color: #1a1a1a; font-size: 20px; margin: 0 0 15px 0; font-weight: 600;">Your Password Reset Code</h2>
              
              <p style="color: #666; font-size: 14px; line-height: 1.5; margin: 0 0 25px 0;">
                Enter this code to reset your password. Valid for 15 minutes.
              </p>
              
              <!-- OTP Box -->
              <div style="background: #f8f8f8; border: 1px solid #e0e0e0; border-radius: 6px; padding: 20px; text-align: center; margin: 25px 0;">
                <p style="color: #999; font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your Code</p>
                <p style="font-size: 36px; font-weight: 700; color: #2563eb; margin: 0; letter-spacing: 2px; font-family: 'Courier New', monospace;">${otp}</p>
              </div>
              
              <p style="color: #999; font-size: 12px; line-height: 1.5; margin: 20px 0 0 0;">
                • Never share this code with anyone<br/>
                • ${appName} staff will never ask for your code<br/>
                • If you didn't request this, ignore this email
              </p>
            </div>
            
            <!-- Footer Section -->
            <div style="border-top: 1px solid #f0f0f0; padding: 15px 20px; text-align: center;">
              <p style="color: #999; font-size: 11px; margin: 0;">
                This is an automated message. Please do not reply to this email.
              </p>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`OTP email sent to ${email}`);
      return result;
    } catch (error) {
      console.error('Failed to send OTP email:', error.message);
      throw error;
    }
  }

  /**
   * Send password reset success email
   * @param {string} email - User email
   * @param {string} appName - Application name
   * @returns {Promise}
   */
  async sendPasswordResetSuccessEmail(email, appName = 'PortfolioTrack') {
    try {
      if (!this.transporter) {
        throw new Error('Email service not configured');
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `${appName} - Password Reset Successful`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; background: #ffffff;">
            <!-- Logo Section -->
            <div style="text-align: center; padding: 30px 20px; border-bottom: 1px solid #f0f0f0;">
              <img src="https://storage.googleapis.com/kq-storage.kalvium.community/coa%2FportfolioTrack-logo.png" alt="${appName}" style="height: 40px; object-fit: contain;">
            </div>
            
            <!-- Content Section -->
            <div style="padding: 30px 20px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <div style="width: 48px; height: 48px; background: #10b981; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 24px; font-weight: bold;">✓</span>
                </div>
              </div>
              
              <h2 style="color: #1a1a1a; font-size: 20px; margin: 0 0 15px 0; text-align: center; font-weight: 600;">Password Reset Complete</h2>
              
              <p style="color: #666; font-size: 14px; line-height: 1.5; margin: 0 0 20px 0; text-align: center;">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
              
              <p style="color: #999; font-size: 12px; line-height: 1.5; margin: 20px 0 0 0;">
                • If you didn't make this change, contact support immediately<br/>
                • Your account is now secure with your new password<br/>
                • Keep your password safe and don't share it
              </p>
            </div>
            
            <!-- Footer Section -->
            <div style="border-top: 1px solid #f0f0f0; padding: 15px 20px; text-align: center;">
              <p style="color: #999; font-size: 11px; margin: 0;">
                This is an automated message. Please do not reply to this email.
              </p>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Password reset success email sent to ${email}`);
      return result;
    } catch (error) {
      console.error('Failed to send password reset success email:', error.message);
      throw error;
    }
  }

  /**
   * Check if email service is configured
   * @returns {boolean}
   */
  isConfigured() {
    return this.transporter !== null;
  }
}

export default new EmailService();
