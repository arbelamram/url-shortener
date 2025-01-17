const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');

const Url = require('../models/Url'); // Mongoose Schema

// @route     GET /api/urls
// @desc      Recieve all URLs
router.get('/', async (req, res) => {
  try {
    // Fetch all URLs from the database
    const urls = await Url.find();
    // Send the URLs as a JSON response
    return res.json({"urls": urls});
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route     POST /api/url
// @desc      Create short URL
router.post('/', async (req, res) => {
  const { longUrl } = req.body;
  const baseUrl = config.get('baseUrl');

  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json('Invalid base url');
  }

  const urlCode = shortid.generate();

  if (validUrl.isUri(longUrl)) {
    try {
      let existingUrl = await Url.findOne({ longUrl });
      const shortUrl = baseUrl + '/' + urlCode;

      const newUrl = new Url({
        longUrl,
        shortUrl,
        urlCode,
        date: new Date()
      });

      await newUrl.save();

      if (existingUrl) {
        return res.json({ message: 'Long URL already exists. Created a new short URL.', url: newUrl });
      }

      res.json({ message: 'New short URL created.', url: newUrl });

    } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  } else {
    res.status(401).json('Invalid long url');
  }
});


// @route     PUT /api/url/:id
// @desc      Update long URL by ID
router.put('/:id', async (req, res) => {
  const { longUrl } = req.body;

  if (!validUrl.isUri(longUrl)) {
    return res.status(401).json('Invalid long url');
  }

  try {
    const url = await Url.findById(req.params.id);
    if (!url) {
      return res.status(404).json('URL not found');
    }
    url.longUrl = longUrl;
    await url.save();
    res.json(url);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route     DELETE /api/url/:id
// @desc      Delete URL by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Url.findByIdAndDelete(id);
    res.json({ message: 'URL deleted successfully' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;