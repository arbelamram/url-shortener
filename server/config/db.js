const config = require('config');

const mongoose = require('mongoose');

const {
  MONGO_USER,
  MONGO_PASSWORD,

  MONGO_CLUSTER,
  MONGO_PROJECT,
  MONGO_DOMAIN,

  MONGO_DB,
  MONGO_OPTIONS,
} = process.env;

if (
  !MONGO_USER ||
  !MONGO_PASSWORD ||

  !MONGO_CLUSTER ||
  !MONGO_PROJECT ||
  !MONGO_DOMAIN ||

  !MONGO_DB
) {
  console.error('Missing MongoDB environment variables');
  process.exit(1);
}

// Passwords with @ / : # % will not break the URI
const encodedPassword = encodeURIComponent(MONGO_PASSWORD);
const mongoHost = `${MONGO_CLUSTER}.${MONGO_PROJECT}.${MONGO_DOMAIN}`;

const mongoURI =
  `mongodb+srv://` +
  `${MONGO_USER}:${encodedPassword}` +
  `@${mongoHost}/${MONGO_DB}` +
  (MONGO_OPTIONS ? `?${MONGO_OPTIONS}` : '');

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;