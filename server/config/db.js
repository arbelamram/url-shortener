// server/config/db.js
// Builds a MongoDB connection URI from environment variables and connects via Mongoose.

const mongoose = require('mongoose');

/**
 * Reads and validates MongoDB environment variables.
 * Throws a descriptive error if required variables are missing.
 */
function getMongoEnv() {
  const {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_CLUSTER,
    MONGO_PROJECT,
    MONGO_DOMAIN,
    MONGO_DB,
    MONGO_OPTIONS,
  } = process.env;

  // List missing vars for easier debugging
  const missing = [];
  if (!MONGO_USER) missing.push('MONGO_USER');
  if (!MONGO_PASSWORD) missing.push('MONGO_PASSWORD');
  if (!MONGO_CLUSTER) missing.push('MONGO_CLUSTER');
  if (!MONGO_PROJECT) missing.push('MONGO_PROJECT');
  if (!MONGO_DOMAIN) missing.push('MONGO_DOMAIN');
  if (!MONGO_DB) missing.push('MONGO_DB');

  if (missing.length) {
    throw new Error(`Missing MongoDB environment variables: ${missing.join(', ')}`);
  }

  return {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_CLUSTER,
    MONGO_PROJECT,
    MONGO_DOMAIN,
    MONGO_DB,
    MONGO_OPTIONS,
  };
}

/**
 * Builds a MongoDB Atlas SRV connection string.
 * Uses encodeURIComponent for the password to safely support special characters.
 */
function buildMongoUri(env) {
  const encodedPassword = encodeURIComponent(env.MONGO_PASSWORD);
  const mongoHost = `${env.MONGO_CLUSTER}.${env.MONGO_PROJECT}.${env.MONGO_DOMAIN}`;

  return (
    `mongodb+srv://${env.MONGO_USER}:${encodedPassword}` +
    `@${mongoHost}/${env.MONGO_DB}` +
    (env.MONGO_OPTIONS ? `?${env.MONGO_OPTIONS}` : '')
  );
}

/**
 * Connects to MongoDB using Mongoose.
 * Throws on failure so the caller (server/index.js) can decide how to handle startup errors.
 */
async function connectDB() {
  const env = getMongoEnv();
  const mongoURI = buildMongoUri(env);

  // Optional: set a short timeout so connection issues fail fast
  // (kept minimal and safe)
  const mongooseOptions = {
    serverSelectionTimeoutMS: 10_000,
  };

  await mongoose.connect(mongoURI, mongooseOptions);
  console.log('MongoDB Connected...');
}

module.exports = connectDB;
