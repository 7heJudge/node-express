const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const {Router} = require('express')

const User = require('./models/user')

const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const cardRoutes = require('./routes/card')
const coursesRoutes = require('./routes/courses')
const ordersRoutes = require('./routes/orders')

const router = Router()

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async(req,res, next) => {
    try {
        const user = await User.findById('62dec9b8395a019611c08157')
        req.user = user
        next()
    } catch (e) {
        console.log(e);
    }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);
app.use('/courses', coursesRoutes);
app.use('/orders', ordersRoutes);

const PORT = process.env.PORT || 3001

async function start() {
    try {
        const url = `mongodb+srv://yanuck:61RD818gcjj5mLg1@cluster0.nxkuq.mongodb.net/shop`
        await mongoose.connect(url, {useNewUrlParser: true})
        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'yanuck00723@gmail.com',
                name: 'Yan',
                cart: {items: []}
            })
            await user.save()
        }
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()
