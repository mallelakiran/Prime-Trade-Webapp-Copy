const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }
    
    next();
  };
};

// User validation schemas
const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Username must contain only alphanumeric characters',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must not exceed 30 characters',
      'any.required': 'Username is required'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(6)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'Password is required'
    }),
  role: Joi.string()
    .valid('user', 'admin')
    .default('user'),
  adminCode: Joi.when('role', {
    is: 'admin',
    then: Joi.string()
      .required()
      .messages({
        'any.required': 'Admin code is required for admin registration',
        'string.empty': 'Admin code cannot be empty'
      }),
    otherwise: Joi.optional()
  })
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

// Task validation schemas
const createTaskSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.min': 'Title cannot be empty',
      'string.max': 'Title must not exceed 200 characters',
      'any.required': 'Title is required'
    }),
  description: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Description must not exceed 1000 characters'
    }),
  status: Joi.string()
    .valid('pending', 'in_progress', 'completed')
    .default('pending'),
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .default('medium')
});

const updateTaskSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .messages({
      'string.min': 'Title cannot be empty',
      'string.max': 'Title must not exceed 200 characters'
    }),
  description: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Description must not exceed 1000 characters'
    }),
  status: Joi.string()
    .valid('pending', 'in_progress', 'completed'),
  priority: Joi.string()
    .valid('low', 'medium', 'high')
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  createTaskSchema,
  updateTaskSchema
};
