// server/index.js
// Entry point for the Express server: loads env, connects to MongoDB, registers middleware/routes, and starts listening.

require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

/**
 * Middleware: parse incoming JSON payloads
 * (Must be registered before routes that read req.body)
 */
app.use(express.json());

/**
 * Routes
 * - /api/url : REST API for CRUD operations on URLs
 * - /        : redirect layer (/:code) for resolving short links
 */
app.use('/api/url', require('./routes/url'));
app.use('/', require('./routes/redirect'));

/**
 * Global error handler (MUST be registered last)
 * Ensures all thrown/forwarded errors are returned in a consistent response shape.
 */
app.use(errorHandler);

/**
 * Bootstraps the server:
 * - connect to the database
 * - start listening only after DB connection is ready (depends on connectDB implementation)
 */
async function startServer() {
  // Connect to database (connectDB should throw on failure)
  await connectDB();

  // Use env PORT when deploying (Heroku/Render/etc.), fallback to 5000 locally
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer().catch((err) => {
  // If startup fails (e.g., DB connection error), log and exit with failure code
  console.error('Failed to start server:', err);
  process.exit(1);
});
