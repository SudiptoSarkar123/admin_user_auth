const express = require('express')
const app = express()
const path = require('path')
const dotenv = require('dotenv')
dotenv.config()
const dbcon = require('./app/config/dbcon')
dbcon()


app.use(express.urlencoded({extended:true}))
app.use(express.json())

const User = require('./app/model/user.model')


const adminRouter = require('./app/router/admin.route')

app.use('/admin', adminRouter)

app.use('/upload', express.static(path.join(__dirname, 'upload')));




const port = process.env.PORT || 4002 ;
app.listen(port ,()=> console.log('Server is running at', port))