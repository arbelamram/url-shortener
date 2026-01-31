const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  urlCode: { type: String, required: true, unique: true, index: true },
  longUrl: { type: String, required: true, unique: true },
  shortUrl: String,

  // Use Date type so sorting/filtering works properly
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Url', urlSchema);