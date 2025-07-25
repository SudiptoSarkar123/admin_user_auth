const mongoose = require('mongoose')
const { type } = require('os')


const roleSchema = mongoose.Schema({
    roleName:{
        type:String,
        enum:["Super-admin","User"]
    }
})


module.exports = mongoose.model('Role',roleSchema);