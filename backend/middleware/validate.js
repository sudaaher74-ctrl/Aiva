const AppError = require('../utils/AppError');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    next(error); // Pass ZodError to global error handler
  }
};

module.exports = validate;
