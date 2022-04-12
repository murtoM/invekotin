/**
 * Error Handler
 * 
 * This is largely influenced by Sematext's excellent blog post on handling 
 * errors: https://sematext.com/blog/node-js-error-handling/
 */

const BaseError = require('./BaseError');

function logError(error) {
  console.log(error);
}

function logErrorMiddleWare(err, req, res, next) {
  logError(err);
  next(err);
}

function respondWithError(err, req, res, next) {
  let code = err.statusCode || 500;
  res.status(code);
  res.render(`errors/${code}`, {
    message: err.message,
  });
}

function isOperationalError(error) {
  if (error instanceof BaseError) {
    return error.isOperational;
  }
  return false;
}

module.exports = {
  logError,
  logErrorMiddleWare,
  respondWithError,
  isOperationalError,
}
