const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

// Signup
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  let errors = [];
  if (!username || !email || !password) errors.push('Fill in all fields!');
  if (password.length < 6) errors.push('Password must be 6+ chars.');
  if (errors.length > 0) return res.status(400).json({ errors });

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ errors: ['Email already registered'] });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashed });
  await newUser.save();
  res.status(201).json({ message: 'User registered' });
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err;
    if (!user) return res.status(400).json({ errors: [info.message] });
    req.logIn(user, (err) => {
      if (err) throw err;
      res.json({ message: 'Logged in', user: { username: user.username, email: user.email, highScore: user.highScore } });
    });
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out' });
  });
});

// Current user profile
router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ error: 'Not authenticated' });
  res.json({ user: req.user });
});

module.exports = router;
