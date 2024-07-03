const express = require('express');
const router = express.Router();
const Url = require('../models/Url'); // Mongoose Schema

// Route to get all generated URLs
router.get('/', async (req, res) => {
  try {
    // Fetch all URLs from the database
    const urls = await Url.find();
    // Send the URLs as a JSON response
    return res.json(urls);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
