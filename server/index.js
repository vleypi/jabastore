require('dotenv').config()

const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const PORT = process.env.PORT || 5000
const app = express()
const router = require('./routes/index')
const errorHandler = require("./middleware/error.mw")
const fileUpload = require('express-fileupload')
const path = require('path')

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname,'static')))
app.use(fileUpload({}))
app.use('/api',router)
app.use(errorHandler)


const start = async () =>{
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT,()=>console.log(PORT))
    }
    catch(err){
        console.log(err)
    }
}

start()