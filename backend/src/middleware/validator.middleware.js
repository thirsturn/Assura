const { body, validationResult } = require('express-validator');

exports.validateLogin = [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
];

exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json(
            {
                message: 'Validation required',
                errors: errors.array()
            }
        );
    };
    next();
}