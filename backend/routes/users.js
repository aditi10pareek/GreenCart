const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const OTP = require('../models/OTP');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "102839210-mock-client-id.apps.googleusercontent.com");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'dummy@gmail.com',
    pass: process.env.EMAIL_PASS || 'dummy-password'
  }
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1. Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const otp = generateOTP();
    await OTP.findOneAndUpdate({ email }, { email, otp, createdAt: Date.now() }, { upsert: true, new: true });

    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'noreply@greencart.com',
      to: email,
      subject: 'GreenCart - Verify your Email',
      text: `Your registration OTP is: ${otp}. It is valid for 10 minutes.`
    }).catch(e => console.error("Email send error:", e));

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Verify OTP only
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await OTP.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });

    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Final Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    
    // Double check OTP to ensure security
    const record = await OTP.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: 'Invalid or missing OTP verification' });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ 
      name, 
      email, 
      password: hashedPassword,
      isVerified: true
    });
    
    await user.save();
    
    // Clear OTP after successful registration
    await OTP.deleteOne({ email });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    console.log("LOGIN ATTEMPT RECEIVED:", req.body);
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      console.log("LOGIN FAILED: User not found for email:", email);
      return res.status(400).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("LOGIN FAILED: Password mismatch for email:", email);
      return res.status(400).json({ message: 'Invalid credentials. Incorrect password.' });
    }

    if (!isMatch) {
      console.log("LOGIN FAILED: Password mismatch for email:", email);
      return res.status(400).json({ message: 'Invalid credentials. Incorrect password.' });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    console.log("LOGIN SUCCESS for email:", email);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// Google Login user
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID || "102839210-mock-client-id.apps.googleusercontent.com"
    });
    
    const { name, email, sub } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      // Create user if they don't exist
      // Since they logged in with Google, we generate a random dummy password
      const hashedPassword = await bcrypt.hash(sub + email, 10);
      user = new User({ name, email, password: hashedPassword, isVerified: true });
      await user.save();
    }

    const payload = { user: { id: user.id } };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    console.log("GOOGLE LOGIN SUCCESS for email:", email);
    res.json({ token: jwtToken, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("GOOGLE LOGIN ERROR:", err);
    res.status(500).json({ message: 'Google Authentication failed' });
  }
});

// Get User Dashboard info
router.get('/dashboard', async (req, res) => {
  // requires auth middleware, simplified for now
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Token is not valid' });
  }
});

module.exports = router;
