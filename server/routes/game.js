const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Update score and high score
router.post('/score', async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ error: 'Not authenticated' });
  const { score } = req.body;
  if (typeof score !== 'number' || score < 0) return res.status(400).json({ error: 'Invalid score' });

  try {
    const user = await User.findById(req.user._id);
    user.gamesPlayed += 1;
    if (score > user.highScore) user.highScore = score;
    await user.save();
    res.json({ highScore: user.highScore });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
