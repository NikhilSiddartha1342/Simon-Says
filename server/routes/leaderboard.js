const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get top 10 users by highScore
router.get('/', async (req, res) => {
  try {
    const top = await User.find({})
      .sort({ highScore: -1 })
      .limit(10)
      .select('username highScore -_id');
    res.json({ leaderboard: top });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
