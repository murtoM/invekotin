class BaseError extends Error {
  /**
   * Base Error
   *
   * A base error for mainly passing the operational status of the app along
   * with error-specific data to error handlers.
   *
   * @constructor
   * @param {string} name - Name of the error.
   * @param {int} statusCode - The HTTP status code related to the error.
   * @param {boolean} isOperational - Is the error operational (not a programmer 
   *   error / bug).
   * @param {string} description - A longer description of the error.
   */
  constructor(name, statusCode, isOperational, description) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

module.exports = BaseError;
