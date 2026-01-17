/*
    This lets you write async routes without repetitive try/catch, 
    and any error automatically goes to your errorHandler
*/

// server/middleware/asyncHandler.js
module.exports = function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
