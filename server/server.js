const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dailyCardRoute = require('./routes/dailyCardRoute');
const allCardsRoute = require('./routes/allCardsRoute');
const getCardRoute = require('./routes/getCardRoute');


require('dotenv').config();

const app = express();

app.use(cors());

const PORT = process.env.PORT || 5050;

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

app.use('/api', dailyCardRoute);
app.use('/api', allCardsRoute);
app.use('/api', getCardRoute);

// Import and start cron job
require('./cron/dailyCardCron');

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
