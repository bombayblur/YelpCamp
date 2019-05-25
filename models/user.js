var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

let userSchema = new mongoose.Schema({
    
    username:String,
    isAdmin:{
        type:Boolean,
        default:false
    },
    password:String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);