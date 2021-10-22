const {body, validationResult} = require('express-validator')
exports.userSignUpValidator = [
    //express-validator validation used a middleware
    body('name', 'Name is required').trim().notEmpty(),
    body('email', 'Email is required and must be between 3 & 32 characters')
    .matches(/.+\@.+\..+/)
    .withMessage('Email must have an @')
    .isLength({
        min:4,
        max:32

    }).withMessage('Short Email Address'),
    body('password', 'Password is Required').notEmpty()
    .isLength({min:6})
    .withMessage("Password must contain atleast 6 characters")
    .matches(/\d/)
    .withMessage('Password must contain a number'),
    //Handle response to validation
    function(req, res, next){
        const errors = validationResult(req);
        if (!errors.isEmpty()){
         const firstError = errors.errors.map((err) => err.msg)[0]
         return res.status(400).json({err:firstError});
        }
        next();
    }
];