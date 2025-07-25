const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
    name: {
        type:String,
        required: true,
        unique:true
    },
    description: {
        type: String,
        // required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    }
})


module.exports = mongoose.model('Product',productSchema);