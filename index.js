const express = require('express')
const path = require('path')
const csrf = require('csurf')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const exphbs = require('express-handlebars')
const {Router} = require('express')

const User = require('./models/user')

const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const authRoutes = require('./routes/auth')
const cardRoutes = require('./routes/card')
const coursesRoutes = require('./routes/courses')
const ordersRoutes = require('./routes/orders')

const router = Router()

const MONGODB_URI = `mongodb+srv://yanuck:61RD818gcjj5mLg1@cluster0.nxkuq.mongodb.net/shop`
const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
})

const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'some secer value',
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(csrf())

app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/auth', authRoutes);
app.use('/card', cardRoutes);
app.use('/courses', coursesRoutes);
app.use('/orders', ordersRoutes);

const PORT = process.env.PORT || 3001

async function start() {
    try {
        await mongoose.connect(MONGODB_URI, {useNewUrlParser: true})
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()
