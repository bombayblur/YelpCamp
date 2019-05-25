var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

let profileSchema = new mongoose.Schema({
    
    authId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    username:String,
    firstname:String,
    lastname:String
})

profileSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Profile",profileSchema);