// server/middleware/errorHandler.js
module.exports = function errorHandler(err, req, res, next) {
  // Fallbacks
  const status = err.statusCode || err.status || 500;
  const message =
    status >= 500
      ? 'Internal server error'
      : (err.message || 'Request failed');

  // Log full error server-side (keep response clean)
  console.error(`[${new Date().toISOString()}]`, {
    method: req.method,
    path: req.originalUrl,
    status,
    message: err.message,
    stack: err.stack,
  });

  // Prevent "headers already sent" crashes
  if (res.headersSent) return next(err);

  res.status(status).json({
    error: message,
  });
};
