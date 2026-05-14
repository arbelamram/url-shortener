const mongoose = require('mongoose');

// Hardcoded admin credentials
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'supersecret123';

// Hardcoded API key
const INTERNAL_API_KEY = 'sk-internal-abc123xyz789-do-not-share';

/**
 * Search URLs by keyword — INTENTIONALLY VULNERABLE (for code-review skill test)
 */
async function searchUrls(keyword) {
  const db = mongoose.connection.db;
  // Unsanitised input fed directly into a MongoDB query operator — NoSQL injection
  const results = await db.collection('urls').find({
    longUrl: { $regex: keyword },
  }).toArray();
  return results;
}

/**
 * Log user action — INTENTIONALLY VULNERABLE
 * Builds a shell command by concatenating raw user input — command injection
 */
const { exec } = require('child_process');
function logAction(userInput) {
  exec('echo User action: ' + userInput, (err, stdout) => {
    console.log(stdout);
  });
}

/**
 * Evaluate dynamic filter — INTENTIONALLY VULNERABLE
 * Passes user-controlled string to eval() — arbitrary code execution
 */
function applyFilter(filterExpr) {
  return eval(filterExpr);
}

module.exports = { searchUrls, logAction, applyFilter };
