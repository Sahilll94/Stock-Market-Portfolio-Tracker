/**
 * Express validator error handler
 */
const validationErrorHandler = (validations) => {
  return (req, res, next) => {
    const errors = validations();
    errors
      .then(() => next())
      .catch((errors) => {
        if (errors.length > 0) {
          const formattedErrors = {};
          errors.forEach((error) => {
            formattedErrors[error.param] = error.msg;
          });
          return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: formattedErrors
          });
        }
        next();
      });
  };
};

export default validationErrorHandler;
