// server/models/Url.js
// Mongoose model for storing URL mappings (longUrl <-> urlCode/shortUrl) for the URL shortener service.

const mongoose = require('mongoose');

/**
 * Url schema:
 * - urlCode: the generated short code (must be unique)
 * - longUrl: the original destination URL (unique in this no-auth design)
 * - shortUrl: the full shortened URL (baseUrl + urlCode)
 * - date: creation timestamp (kept as a single field for simplicity)
 */
const urlSchema = new mongoose.Schema({
  urlCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
  },
  longUrl: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  shortUrl: {
    type: String,
    required: true,
    trim: true,
  },

  // Use Date type so sorting/filtering works properly
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Url', urlSchema);
