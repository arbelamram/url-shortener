// server/routes/url.js
// REST API routes for URL resources: list, create, update, and delete shortened URLs.

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');

const Url = require('../models/Url');
const asyncHandler = require('../middleware/asyncHandler');

const MAX_URL_LENGTH = 2048;

/**
 * Helper: remove trailing slashes to avoid "https://x.com//abc"
 */
function normalizeBaseUrl(value) {
  return String(value || '').replace(/\/+$/, '');
}

/**
 * Helper: safely resolve the base URL used to generate short URLs.
 * - Primary: config (config/default.json -> baseUrl)
 * - Fallback: process.env.BASE_URL (matches your README)
 */
function getBaseUrl() {
  const fromConfig = (() => {
    try {
      return config.get('baseUrl');
    } catch {
      return undefined;
    }
  })();

  return normalizeBaseUrl(fromConfig || process.env.BASE_URL);
}

/**
 * Helper: validate MongoDB ObjectId format to avoid CastError -> 500.
 */
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * Helper: validate a user-supplied long URL.
 * - Rejects malformed URIs
 * - Whitelists http/https only (prevents javascript:, data:, vbscript: redirects)
 * Returns an error string, or null if valid.
 */
function validateLongUrl(url) {
  if (url.length > MAX_URL_LENGTH) return `URL must be ${MAX_URL_LENGTH} characters or fewer`;
  if (!validUrl.isUri(url)) return 'Invalid long url';
  try {
    const { protocol } = new URL(url);
    if (protocol !== 'http:' && protocol !== 'https:') {
      return 'Only http and https URLs are allowed';
    }
  } catch {
    return 'Invalid long url';
  }
  return null;
}

// @route     GET /api/url
// @desc      Retrieve all URLs
router.get(
  '/',
  asyncHandler(async (req, res) => {
    // Use lean() since we only need plain JSON (faster, less memory)
    const urls = await Url.find().lean();
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

    const baseUrl = getBaseUrl();

    if (!validUrl.isUri(baseUrl)) {
      return res.status(500).json({ error: 'Invalid base url configuration' });
    }

    const postUrlError = validateLongUrl(longUrl);
    if (postUrlError) {
      return res.status(400).json({ error: postUrlError });
    }

    // If URL already exists:
    // - return it, but ensure its shortUrl matches current baseUrl (important for demos/screenshots)
    const existingUrl = await Url.findOne({ longUrl });
    if (existingUrl) {
      const expectedShortUrl = `${baseUrl}/${existingUrl.urlCode}`;
      if (existingUrl.shortUrl !== expectedShortUrl) {
        existingUrl.shortUrl = expectedShortUrl;
        await existingUrl.save();
      }

      return res.json({
        message: 'Long URL already exists.',
        url: existingUrl,
      });
    }

    // Collision-safe code generation:
    // - unlikely, but handled explicitly
    let urlCode;
    for (let tries = 0; tries < 5; tries += 1) {
      const candidate = shortid.generate();
      const exists = await Url.exists({ urlCode: candidate });
      if (!exists) {
        urlCode = candidate;
        break;
      }
    }

    if (!urlCode) {
      return res.status(500).json({ error: 'Failed to generate unique urlCode' });
    }

    const shortUrl = `${baseUrl}/${urlCode}`;

    const newUrl = new Url({
      longUrl,
      shortUrl,
      urlCode,
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
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    if (!longUrl) {
      return res.status(400).json({ error: 'longUrl is required' });
    }

    const putUrlError = validateLongUrl(longUrl);
    if (putUrlError) {
      return res.status(400).json({ error: putUrlError });
    }

    const url = await Url.findById(id);
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // If another record already uses this longUrl, block the update
    const conflict = await Url.findOne({ longUrl, _id: { $ne: url._id } });
    if (conflict) {
      return res
        .status(409)
        .json({ error: 'longUrl already exists for a different record' });
    }

    url.longUrl = longUrl;
    await url.save();

    return res.json({ url });
  })
);

// @route     DELETE /api/url/:id
// @desc      Delete URL by ID
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const deleted = await Url.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'URL not found' });
    }

    return res.json({ message: 'URL deleted successfully' });
  })
);

module.exports = router;
