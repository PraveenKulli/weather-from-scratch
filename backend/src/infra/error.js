class AppError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status || 500;
    this.details = details;
  }
}
const notFound = (req,res,next) => next(new AppError(404, 'Not found'));
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const body = { error: err.message || 'Server error' };
  if (err.details) body.details = err.details;
  res.status(status).json(body);
};
module.exports = { AppError, notFound, errorHandler };