const mongoose = require('mongoose');
const crypto = require('crypto');
const {v4:uuidv4} = require('uuid');


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        maxlength:32,
        required:true,
    },
    email:{
        type:String,
        trim:true,
        unique:32,
        required:true,
    },
    about:{
        type:String,
        trim:true,
    },
    hashed_password:{
        type:String,
        trim:true,
    },
    salt:String,
    role:{
        type:Number,
        default:0
    },
    history:{
        type:Array,
        default:[]
    }
    
}, {timestamps:true});

// virtual fields

userSchema
.virtual('password')
.set(function(password){
    this._password = password;
    this.salt = uuidv4();
    this.hashed_password = this.encryptPassword(password)
})
.get(function(){
    return this._password;
});

userSchema.methods = {

    authenticate:function(plainTextPass){
        return this.encryptPassword(plainTextPass) === this.hashed_password
    },
    
    encryptPassword:function (password){
       if(!password){
           return ''
       }
       try{
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
        }catch(err){
            return ''
        }
    }
}
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;