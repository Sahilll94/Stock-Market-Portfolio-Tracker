/**
 * Catch async errors and pass to error handler
 * @param {function} fn - Express controller function
 * @returns {function} Wrapped function
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default catchAsync;
