const {body} = require('express-validator/check')
const User = require('../models/user')

exports.registerValidators = [
    body('email')
        .isEmail()
        .withMessage('Enter correctly email')
        .custom(async (value) => {
            try {
                const candidate = await User.findOne({email: value})

                if (candidate) {
                    return Promise.reject('This email already used')
                }

                return true;
            } catch (e) {
                console.log(e);
            }
        }
    )
    .normalizeEmail(),
    body('password', 'Password length should be at least 6')
        .isLength({min: 6, max: 56})
        .isAlphanumeric()
        .trim(),
    body('confirm')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Passwords is not match')
            }
            return true;
    })
    .trim(),
    body('name')
        .isLength({min: 3})
        .withMessage('Name length should be at least 3')
        .trim()
]

exports.courseValidators = [
    body('title').isLength({min: 3})
        .withMessage('Min length at least 3 chars')
        .trim(),
    body('price').isNumeric().withMessage('Enter correctly price'),
    body('photo', 'Enter correctly URL photo').isURL()
]
