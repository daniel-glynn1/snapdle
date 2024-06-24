const mongoose = require('mongoose');

const dailyCardSchema = new mongoose.Schema({
  Name: String,
  Cost: Number,
  Power: Number,
  SeriesAdjusted: Number,
  AbilityType: String,
  ReleaseMonth: Number,
  ReleaseYear: Number,
  Series: String,
  AbilityText: String,
  Date: { type: Date, default: Date.now }
},
{collection: 'dailyCards'}
);

module.exports = mongoose.model('DailyCard', dailyCardSchema);
