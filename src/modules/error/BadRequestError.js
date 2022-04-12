const BaseError = require("./BaseError");
const httpStatusCodes = require("./httpStatusCodes");

class BadRequestError extends BaseError {
  /**
   * Bad Request Error
   *
   * @constructor
   */
  constructor(
    name,
    statusCode = httpStatusCodes.BAD_REQUEST,
    isOperational = true,
    description = "Bad Request."
  ) {
    super(name, statusCode, isOperational, description);
  }
}

module.exports = BadRequestError;
