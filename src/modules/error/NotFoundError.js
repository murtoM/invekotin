const BaseError = require("./BaseError");
const httpStatusCodes = require("./httpStatusCodes");

class NotFoundError extends BaseError {
  /**
   * Not Found Error
   *
   * @constructor
   */
  constructor(
    name,
    statusCode = httpStatusCodes.NOT_FOUND,
    isOperational = true,
    description = "Not found."
  ) {
    super(name, statusCode, isOperational, description);
  }
}

module.exports = NotFoundError;
