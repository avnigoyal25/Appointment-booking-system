const express = require('express');
const eventsRouter = require('./routes/events');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const bookedDatesRouter=require('./routes/bookedDates');

app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use('/api/events', eventsRouter);
app.use('/api/booked-dates', bookedDatesRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
