const express = require('express')
const config = require('config')
/***********************************/
//база данных
const mongoose = require('mongoose')
/***********************************/
//вызов express (сервер)
const app = express()
/***********************************/

// Важное событие для работы с body (мидлвэр)-встроен в express
app.use(express.json({extended: true}))
/***********************************/
//вытаскиваем роутер из routes
const ROUTER = require('./routes/auth.routes')
/***********************************/
//запрос к роутам
app.use('/api/auth', ROUTER)
/***********************************/
//для конфига PORT
const PORT = config.get('port') || 5000
//функция для обёртки БД
async function start() {
    try {
        await mongoose.connect(config.get('mongoUrl',),{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useCreateIndex:true
        })
        app.listen(PORT,
            () => console.log(`App the server started up ${PORT}...`))
    } catch (e) {
        console.log('SERVER ERROR', e.message)
        // если что-то пошло  так, сделаем выход!!!
        process.exit(1)
    }
}
start()

