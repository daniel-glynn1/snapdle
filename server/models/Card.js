const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  Name: String,
  Cost: Number,
  Power: Number,
  SeriesAdjusted: Number,
  AbilityType: String,
  ReleaseMonth: Number,
  ReleaseYear: Number,
  Series: Number,
  AbilityText: String

}, {collection: 'cards'});

module.exports = mongoose.model('Card', cardSchema);
