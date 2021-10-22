const User = require('../models/user');

exports.UserById = function(req, res, next, id){
    User.findById(id).exec((err, user) => {
        if(err || !user){
            res.status(400).json({
                err: "User not Found"
            });
        }
        req.profile = user;
        next();
    });
}

exports.read = function (req, res) {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json({profile : req.profile});
}

exports.update = function (req, res) {
    User.findOneAndUpdate({_id: req.profile._id}, {$set : req.body}, {new : true}, function (error, user) {
        if (error){
            return res.status(400).json({
                error : 'You are not authorized to perform the action you just did'
            });
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        return res.json({user : user});
    });
}