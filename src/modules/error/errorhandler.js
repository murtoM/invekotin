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
  res.status(err.statusCode || 500).send(err.message);
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
