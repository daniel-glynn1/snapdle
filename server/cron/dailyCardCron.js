const mongoose = require('mongoose');
const cron = require('node-cron');
const Card = require('../models/Card');
const DailyCard = require('../models/DailyCard');

mongoose.connect(process.env.MONGODB_URI);

const selectDailyCard = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if there is already a daily card for today
    const existingDailyCard = await DailyCard.findOne({
      Date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (existingDailyCard) {
      console.log('Daily card already exists for today:', existingDailyCard);
      return;
    }

    // select random card
    const count = await Card.countDocuments();
    if (count === 0) {
      console.log('No cards found in the database.');
      return;
    }
    const random = Math.floor(Math.random() * count);
    const randomCard = await Card.findOne().skip(random);
    
    const dailyCard = new DailyCard({
      Name: randomCard.Name,
      Cost: randomCard.Cost,
      Power: randomCard.Power,
      SeriesAdjusted: randomCard.SeriesAdjusted,
      AbilityType: randomCard.AbilityType,
      ReleaseMonth: randomCard.ReleaseMonth,
      ReleaseYear: randomCard.ReleaseYear,
      Series: randomCard.Series,
      AbilityText: randomCard.AbilityText,
    });

    await dailyCard.save();
    console.log('New daily card selected:', dailyCard);
  } catch (error) {
    console.error('Error selecting daily card:', error);
  }
};

// Schedule the task to run at midnight every day
cron.schedule('0 0 * * *', () => {
  selectDailyCard();
});

// Run it once at startup
selectDailyCard();
