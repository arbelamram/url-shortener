const express = require("express");
const router = express.Router();

const validUrl = require("valid-url");
const shortid = require("shortid");
const config = require("config");

const Url = require("../models/Url");
const asyncHandler = require("../middleware/asyncHandler");

// Helper: remove trailing slashes to avoid "https://x.com//abc"
function normalizeBaseUrl(value) {
  return String(value || "").replace(/\/+$/, "");
}

// @route     GET /api/url
// @desc      Receive all URLs
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const urls = await Url.find();
    return res.json({ urls });
  })
);

// @route     POST /api/url
// @desc      Create short URL
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { longUrl } = req.body;

    if (!longUrl) {
      return res.status(400).json({ error: "longUrl is required" });
    }

    const baseUrl = normalizeBaseUrl(config.get("baseUrl"));

    if (!validUrl.isUri(baseUrl)) {
      return res.status(500).json({ error: "Invalid base url configuration" });
    }

    if (!validUrl.isUri(longUrl)) {
      return res.status(400).json({ error: "Invalid long url" });
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
        message: "Long URL already exists.",
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
      return res.status(500).json({ error: "Failed to generate unique urlCode" });
    }

    const shortUrl = `${baseUrl}/${urlCode}`;

    const newUrl = new Url({
      longUrl,
      shortUrl,
      urlCode,
      date: new Date(),
    });

    await newUrl.save();

    return res.json({
      message: "New short URL created.",
      url: newUrl,
    });
  })
);

// @route     PUT /api/url/:id
// @desc      Update long URL by ID
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { longUrl } = req.body;

    if (!longUrl) {
      return res.status(400).json({ error: "longUrl is required" });
    }

    if (!validUrl.isUri(longUrl)) {
      return res.status(400).json({ error: "Invalid long url" });
    }

    const url = await Url.findById(req.params.id);
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    // If another record already uses this longUrl, block the update
    const conflict = await Url.findOne({ longUrl, _id: { $ne: url._id } });
    if (conflict) {
      return res.status(409).json({ error: "longUrl already exists for a different record" });
    }

    url.longUrl = longUrl;
    await url.save();

    return res.json(url);
  })
);

// @route     DELETE /api/url/:id
// @desc      Delete URL by ID
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deleted = await Url.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "URL not found" });
    }

    return res.json({ message: "URL deleted successfully" });
  })
);

module.exports = router;
