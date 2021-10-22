const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        minLength:4,
        maxlength:32,
        required:true,
        unique:true
    }   
}, {timestamps:true});


const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;