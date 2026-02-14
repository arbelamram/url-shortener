// server/middleware/errorHandler.js
// Global Express error handler: normalizes error responses and logs full error details server-side.

module.exports = function errorHandler(err, req, res, next) {
  /**
   * If headers are already sent, delegate to Express default handler
   * to avoid "Cannot set headers after they are sent" crashes.
   */
  if (res.headersSent) {
    console.error(`[${new Date().toISOString()}] Headers already sent`, {
      method: req.method,
      path: req.originalUrl,
      error: err?.message,
    });
    return next(err);
  }

  // Normalize known Mongoose errors into client-friendly statuses
  let status = err.statusCode || err.status || 500;

  // CastError often means "invalid ObjectId" or invalid type casting
  if (err?.name === 'CastError') {
    status = 400;
  }

  // Duplicate key error from MongoDB unique indexes (e.g., urlCode/longUrl)
  if (err?.code === 11000) {
    status = 409;
  }

  const message =
    status >= 500 ? 'Internal server error' : (err.message || 'Request failed');

  /**
   * Server-side logging: log full details for debugging,
   * while returning a safe, minimal message to the client.
   */
  console.error(`[${new Date().toISOString()}]`, {
    method: req.method,
    path: req.originalUrl,
    status,
    message: err?.message,
    stack: err?.stack,
  });

  return res.status(status).json({ error: message });
};
