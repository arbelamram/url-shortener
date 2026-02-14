// server/middleware/asyncHandler.js
// Async route wrapper: lets you write async Express handlers without repetitive try/catch,
// and forwards any thrown/rejected errors to the global error handler.

 /*
  * Wraps an async Express handler and forwards errors to next().
  * @param {(req, res, next) => Promise<any>} fn
  * @returns {(req, res, next) => void}
  */
module.exports = function asyncHandler(fn) {
  return function asyncRouteHandler(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
