const express = require('express');
const router = express.Router();

const Url = require('../models/Url');
const asyncHandler = require('../middleware/asyncHandler');

// @route     GET /:code
// @desc      Redirect to long/original URL
router.get(
  '/:code',
  asyncHandler(async (req, res) => {
    const url = await Url.findOne({ urlCode: req.params.code });

    if (!url) {
      // 404 is a client-visible error (not a server crash)
      return res.status(404).json({ error: 'No url found' });
    }

    return res.redirect(url.longUrl);
  })
);

module.exports = router;
