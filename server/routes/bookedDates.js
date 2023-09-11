
const express = require('express');
const router = express.Router();
const pool = require('../database/db.js');
const nodemailer = require('nodemailer');

// Book an appointment
router.post('/book-appointment', async (req, res) => {
  const { name, age, email, selectedDate, selectedTimeSlot } = req.body;

  const isSlotAvailable = await checkAvailability(selectedDate, selectedTimeSlot);

  if (isSlotAvailable) {
    const sql = 'INSERT INTO booked_dates (name, age, email, date, slot) VALUES (?, ?, ?, ?, ?)';
    const values = [name, age, email, selectedDate, selectedTimeSlot];
    
    try {
      await pool.query(sql, values);
      res.status(200).json({ message: 'Appointment booked successfully' });
    } catch (error) {
      console.error('Error booking appointment:', error);
      res.status(500).json({ error: 'Error booking appointment' });
    }

    try {
      await pool.query(sql, values);
      res.status(200).json({ message: 'Appointment booked successfully' });

      const transporter = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'your-email@gmail.com', // Your email address
          pass: 'your-email-password', // Your email password
        },
      });

      const mailOptions = {
        from: 'your-email@gmail.com', 
        to: email, 
        subject: 'Appointment Confirmation',
        text: `Hello ${name} Your appointment has been booked successfully on ${selectedDate} at ${selectedTimeSlot}. Thank you!`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          res.status(500).json({ error: 'Error sending email' });
        } else {
          console.log('Email sent:', info.response);
          res.status(200).json({ message: 'Appointment booked successfully and email sent' });
        }
      });
    }
     catch (error) {
      console.error('Error booking appointment:', error);
      res.status(500).json({ error: 'Error booking appointment' });
    }
  } else {
    res.status(400).json({ error: 'Selected slot is not available' });
  }
});

async function checkAvailability(selectedDate, selectedTimeSlot) {
  const sql = 'SELECT COUNT(*) AS count FROM booked_dates WHERE date = ? AND slot = ?';
  const values = [selectedDate, selectedTimeSlot];

  const [rows] = await pool.query(sql, values);
  const count = rows[0].count;
  return count === 0;
}

module.exports = router;
