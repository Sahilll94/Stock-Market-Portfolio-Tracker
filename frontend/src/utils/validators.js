export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateStockSymbol = (symbol) => {
  return /^[A-Z0-9]{1,10}$/.test(symbol.toUpperCase());
};

export const validatePositiveNumber = (value) => {
  return !isNaN(value) && value > 0;
};

export const validateForm = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const validators = rules[field];
    validators.forEach((validator) => {
      if (!validator.validate(data[field])) {
        errors[field] = validator.message;
      }
    });
  });

  return errors;
};
