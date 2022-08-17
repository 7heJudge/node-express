const {Router} = require('express')
const Course = require('../models/course')
const auth = require('../middleware/auth')
const router = Router()
const {validationResult} = require('express-validator/check')
const {courseValidators} = require('../utils/validators')

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Add course page',
        isAdd: true
    })
})

router.post('/', auth, courseValidators, async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).render('add', {
            title: 'Add course page',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                title: req.body.title,
                price: req.body.price,
                photo: req.body.photo,
            }
        })
    }

    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        photo: req.body.photo,
        userId: req.user
    })

    try {
        await course.save()
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router
