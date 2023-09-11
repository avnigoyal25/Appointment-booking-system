const express = require('express');
const router = express.Router();
const pool = require('../database/db.js');

// Get all events
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM available_dates');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
