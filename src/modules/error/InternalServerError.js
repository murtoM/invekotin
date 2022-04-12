const BaseError = require("./BaseError");
const httpStatusCodes = require("./httpStatusCodes");

class InternalServerError extends BaseError {
  /**
   * Internal Server Error
   *
   * @constructor
   */
  constructor(
    name,
    statusCode = httpStatusCodes.INTERNAL_SERVER,
    isOperational = true,
    description = "Internal Server Error."
  ) {
    super(name, statusCode, isOperational, description);
  }
}

module.exports = InternalServerError;
