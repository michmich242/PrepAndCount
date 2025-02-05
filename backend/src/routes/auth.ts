import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { MongoError } from 'mongodb';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    console.log('Creating new user with email:', email);
    const user = new User({ email, password });
    
    // Validate the user before saving
    const validationError = user.validateSync();
    if (validationError) {
      console.error('Validation error:', validationError);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationError.errors 
      });
    }

    // Try to save the user
    try {
      await user.save();
      console.log('User created successfully:', email);
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error saving user:', error);
      if (error instanceof Error && (error as MongoError).code === 11000) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Registration error details:', error);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    res.status(500).json({ 
      message: 'Error creating user', 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.toString() : 'Unknown error'
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', {
      body: req.body,
      headers: req.headers
    });
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValidPassword = await user.comparePassword(password);
    console.log('Password validation result:', isValidPassword);

    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', email);
    res.json({ 
      token,
      user: {
        email: user.email,
        id: user._id
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    console.error('Full error details:', JSON.stringify(error, null, 2));
    res.status(500).json({ 
      message: 'Internal server error',
      details: error?.message || 'Unknown error'
    });
  }
});

// Request password reset
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, we still return success even if the email doesn't exist
      return res.json({ message: 'If an account exists with this email, you will receive password reset instructions.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Save reset token to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset for your PrepAndCount account.</p>
        <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'If an account exists with this email, you will receive password reset instructions.' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Error processing password reset request' });
  }
});

// Reset password with token
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password and clear reset token
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password successfully reset' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

// Test route to check users
router.get('/test', async (req, res) => {
  try {
    const users = await User.find({}, { email: 1, _id: 0 });
    console.log('All users:', users);
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Google Sign In
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    const { email, sub: googleId } = payload;

    // Find or create user
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user with Google credentials
      user = new User({
        email,
        googleId,
        password: crypto.randomBytes(32).toString('hex') // Random password for Google users
      });
      await user.save();
    } else if (!user.googleId) {
      // Link Google account to existing user
      user.googleId = googleId;
      await user.save();
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token: jwtToken });
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(500).json({ message: 'Error during Google authentication' });
  }
});

export default router;
