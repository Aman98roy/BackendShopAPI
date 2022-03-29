const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, 'Please Enter product name'],
        trim:true,
        maxLength : [100, 'Product name cannot exceed 100 character']
    },
    price:{
        type:Number,
        required: [true, 'Please Enter product price'],
        maxLength : [5, 'Product name cannot exceed 100 character'],
        default: 0.0
    },
    description:{
        type:String,
        required: [true, 'Please enter product description'],
        maxLength : [5, 'Product name cannot exceed 100 character'],
        default: 0.0
    }

})

module.exports = mongoose.model('Product', productSchema)