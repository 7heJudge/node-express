const {Router} = require('express')
const Course = require('../models/course')
const router = Router()

function mapCartItems (cart) {
    return cart.items.map(item => ({
        ...item.courseId._doc,
        id: item.courseId.id,
        count: item.count
    }))
}

function computePrice(courses) {
    return courses.reduce((acc, next) => acc += next.count * next.price, 0)
}

router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id).lean()
    await req.user.addToCart(course)
    res.redirect('/card')
})

router.delete('/remove/:id', async (req, res) => {
    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate('cart.items.courseId')

    const courses = mapCartItems(user.cart)
    const cart = {
        courses, price: computePrice(courses)
    }

    res.status(200).json(cart)
})

router.get('/', async (req, res) => {
    const user = await req.user.populate('cart.items.courseId');

    const courses = mapCartItems(user.cart)

    res.render('card', {
        title: 'Card',
        isCard: true,
        courses: courses,
        price: computePrice(courses)
    })
})

module.exports = router
