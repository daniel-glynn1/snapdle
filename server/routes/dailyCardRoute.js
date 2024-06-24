const express = require('express');
const router = express.Router();
const DailyCard = require('../models/DailyCard');

router.get('/dailycard', async (req, res) => {
  console.log("received dailycard request");
  try {
    const dailyCard = await DailyCard.findOne().sort({ Date: -1 });
    res.json(dailyCard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
