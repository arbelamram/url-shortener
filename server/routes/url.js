const express = require('express');
const router = express.Router();

const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');

const Url = require('../models/Url');
const asyncHandler = require('../middleware/asyncHandler');

// @route     GET /api/url
// @desc      Receive all URLs
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const urls = await Url.find();
    return res.json({ urls });
  })
);

// @route     POST /api/url
// @desc      Create short URL
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { longUrl } = req.body;

    if (!longUrl) {
      return res.status(400).json({ error: 'longUrl is required' });
    }

    const baseUrl = config.get('baseUrl');

    if (!validUrl.isUri(baseUrl)) {
      return res.status(500).json({ error: 'Invalid base url configuration' });
    }

    if (!validUrl.isUri(longUrl)) {
      return res.status(400).json({ error: 'Invalid long url' });
    }

    // If URL already exists, return it (typical expected behavior)
    const existingUrl = await Url.findOne({ longUrl });
    if (existingUrl) {
      return res.json({
        message: 'Long URL already exists.',
        url: existingUrl,
      });
    }

    const urlCode = shortid.generate();
    const shortUrl = `${baseUrl}/${urlCode}`;

    const newUrl = new Url({
      longUrl,
      shortUrl,
      urlCode,
      date: new Date(),
    });

    await newUrl.save();

    return res.json({
      message: 'New short URL created.',
      url: newUrl,
    });
  })
);

// @route     PUT /api/url/:id
// @desc      Update long URL by ID
router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const { longUrl } = req.body;

    if (!longUrl) {
      return res.status(400).json({ error: 'longUrl is required' });
    }

    if (!validUrl.isUri(longUrl)) {
      return res.status(400).json({ error: 'Invalid long url' });
    }

    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    url.longUrl = longUrl;
    await url.save();

    return res.json(url);
  })
);

// @route     DELETE /api/url/:id
// @desc      Delete URL by ID
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deleted = await Url.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'URL not found' });
    }

    return res.json({ message: 'URL deleted successfully' });
  })
);

module.exports = router;
