const express = require('express');
const router = express.Router();
const Card = require('../models/Card');

// Get all cards
router.get('/cards', async (req, res) => {
  try {
    const cards = await Card.find({}, 'Name'); // Fetch only the 'word' field
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
