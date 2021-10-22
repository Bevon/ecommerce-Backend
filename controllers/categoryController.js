const Category = require('../models/category');
const {errorHandler} = require('../helpers/DBErrorHandlers');
const _ = require('lodash');

exports.CategoryById = function (req, res, next, id){
    Category.findById(id).exec((err, category) => {
        if (err || !category){
            res.status(400).json({
                error : "Category not Found"
            });
        }
        req.category = category
        next();
    });
}

exports.create = function (req, res){
    const category = new Category(req.body);
    category.save(function (err, category){
        if (err){
            return res.status(400).json({err:errorHandler(err)});
        }
        else{
           
            res.json({category});
        }
    });
}

exports.remove = function (req, res){
    let category = req.category
    category.remove(function (err, deletedCategory){
        if (err){
            res.status(400).json({
                error : errorHandler(err)
            });
        }
        res.json({
            deletedCategory,
            message : "Category Deleted Successfully"
        });
    });
}

exports.update = function (req, res){
    let category = req.category;
    category = _.extend(category, req.body);
    category.save((err, category) =>{
        if (err){
            return res.status(400).json({err:errorHandler(err)});
        }
        else{
           
            res.json({category});
        }
    });

}

exports.read = function (req, res){
    return res.json(req.category);
}

exports.list = function (req, res){
    Category.find().exec(function (err, response) {
        if(err){
            return res.status(400).json({
                error : errorHandler(err)
            });
        }
        res.json(response);
    });
}

