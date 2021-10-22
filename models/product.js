const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        maxlength:80,
        required:true,
    },
    description:{
        type:String,
        maxlength:2000,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        trim:true,
        maxlength:32,
        required:true,
    },
    quantity:{
        type:Number,
        trim:true,
        maxlength:32,
        required:true,
    },
    sold:{
        type:Number,
        default:0
    },
    category:{
        type:ObjectId,
        maxlength:32,
        required:true,
        trim:true,
        ref:'Category'
    },
    photo:{
        data: Buffer,
        contentType: String
    },
    shipping:{
        required:false,
        type:Boolean

    }   
}, {timestamps:true});


const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;