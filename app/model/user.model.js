const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');


const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        // unique:true // commented for testing purpose
    },
    password:{
        type:String,
        required:true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    }

},{
    timeStamps:true
})


userSchema.pre("save",async function (next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10)
    }
    next()
})

module.exports = mongoose.model('user',userSchema);
