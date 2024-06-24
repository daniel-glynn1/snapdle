const express = require('express');
const router = express.Router();
const Card = require('../models/Card');

// Route to get card by name
router.get('/card', async (req, res) => {
  const { name } = req.query;
  try {
    const card = await Card.findOne({ Name: new RegExp(`^${name}$`, 'i') });
    if (card) {
      res.json(card);
    } else {
      res.status(404).json({ message: 'Card not found' });
    }
  } catch (error) {
    console.error('Error fetching card:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
