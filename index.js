// npm i express-handlebars
const express = require('express') 
const exphbs = require('express-handlebars')
const app = express()
const mongoose = require('mongoose')
const carsRouter = require('./router/cars')
const usersRouter = require('./router/users')
const pageRouter = require('./router/page')
const tasksRouter = require('./router/task')
const varMid = require('./middleware/var')
const authRouter = require('./router/auth')
const session =  require('express-session')
const flash = require('connect-flash')
const MongoStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')



const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})
const MONGODB_URL = 'mongodb://127.0.0.1:27017/taskmen'

// handlebars ni boglash
app.engine('hbs',hbs.engine)
app.set('view engine','hbs')
app.set('views','views')

// form dan malumotlarni to'g'ri olish
app.use(express.urlencoded({extended:true})) // !

// statik fayllar asosiy papkasi
app.use(express.static('public'))

const store = new MongoStore({
    collection:'session',
    uri:MONGODB_URL
})

//////////session nastroyka

app.use(session({
    secret: 'some secret key',
    saveUninitialized:false,
    resave:false,
    store
}))

app.use(csrf())
app.use(flash())
app.use(varMid)

// routerlar ro'yhati
app.use(pageRouter)
app.use('/cars',carsRouter) 
app.use('/tasks',tasksRouter)
app.use('/users',usersRouter)
app.use('/auth',authRouter)




async function dev(){
    try {
        await mongoose.connect(MONGODB_URL, {
            useNewUrlParser: true
        })
        app.listen(3000,()=>{
            console.log('Server is running')
        })
    } catch (error) {
        console.log(error)
    }
}
dev()



// c:\data\db
// 1-terminal
// cd c:\mongodb\bin
// mongod --dbpath c:\data\db

// 2-terminal
// cd c:\mongodb\bin
// mongo 
