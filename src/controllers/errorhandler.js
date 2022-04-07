exports.logErrors = (error, req, res, next) => {
  console.error(error);
  next(error);
};