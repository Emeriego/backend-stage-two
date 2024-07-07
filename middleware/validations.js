// validations.js
const { body, validationResult } = require('express-validator');
const { User } = require('../models');

const validateUserRegistration = [
  body('firstName')
    .notEmpty().withMessage('First name must not be null')
    .isString().withMessage('First name must be a string'),
  body('lastName')
    .notEmpty().withMessage('Last name must not be null')
    .isString().withMessage('Last name must be a string'),
  body('email')
    .notEmpty().withMessage('Email must not be null')
    .isEmail().withMessage('Email must be a valid email address')
    .custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        throw new Error('Email must be unique');
      }
      return true;
    }),
  body('password')
    .notEmpty().withMessage('Password must not be null')
    .isString().withMessage('Password must be a string'),
  body('phone')
    .optional()
    .isString().withMessage('Phone must be a string'),
];

const validateUserLogin = [
  body('email')
    .notEmpty().withMessage('Email must not be null')
    .isEmail().withMessage('Email must be a valid email address'),
  body('password')
    .notEmpty().withMessage('Password must not be null')
    .isString().withMessage('Password must be a string'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array().map(err => ({
        "field": err.path,
        "message": err.msg
      
      })),
    });
  }
  next();
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  handleValidationErrors,
};
