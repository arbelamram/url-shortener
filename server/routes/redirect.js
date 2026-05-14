// server/routes/index.js
// Redirect layer: resolves a short code (/:code) to its original long URL and issues an HTTP redirect.

const express = require('express');
const router = express.Router();

const Url = require('../models/Url');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * GET /:code
 * Looks up the short code in MongoDB and redirects to the stored long URL.
 * Uses 302 (not 301) so browsers don't cache redirects — if a URL is changed or deleted,
 * the next visit always hits the server for the current target.
 */
router.get(
  '/:code',
  asyncHandler(async (req, res) => {
    // Basic hygiene: ensure we have a non-empty code string
    const code = String(req.params.code || '').trim();
    if (!code) {
      return res.status(404).json({ error: 'No url found' });
    }

    // Use lean() since we only need plain data for redirect (no document methods)
    const url = await Url.findOne({ urlCode: code }).lean();

    if (!url) {
      // 404 is a client-visible error (not a server crash)
      return res.status(404).json({ error: 'No url found' });
    }

    // Explicit 302 (default behavior) to avoid ambiguity
    return res.redirect(302, url.longUrl);
  })
);

module.exports = router;
