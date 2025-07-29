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
const userRouter = require('./app/router/user.route')

app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)

app.use('/upload', express.static(path.join(__dirname, 'upload')));




const port = process.env.PORT || 4002 ;
app.listen(port ,()=> console.log('Server is running at', port))