const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true
                }
            }
        ]
    }
})

userSchema.methods.addToCart = function (course) {
    const items = [...this.cart.items]
    const index = items.findIndex(item => course._id.toString() === item.courseId.toString())
    const currentCourse = items[index]

    if (currentCourse) {
        currentCourse.count = currentCourse.count + 1
    } else {
        items.push({
            courseId: course._id,
            count: 1
        })
    }
    this.cart = {items}
    return this.save()
}

userSchema.methods.removeFromCart = function (id) {
    debugger;
    let items = [...this.cart.items];
    const index = items.findIndex(item => item.courseId.toString() === id.toString())

    if (items[index].count === 1) {
        items = items.filter(item => item.courseId.toString() !== id.toString())
    } else {
        items[index].count--
    }
    // const items = oldItems.filter(item => item.courseId.toString() !== id)

    this.cart = {items}
    return this.save()
}

userSchema.methods.clearCart = function () {
    this.cart = {items: []}

    return this.save()
}

module.exports = model('User', userSchema)
