var mongoose = require('mongoose');

let commentSchema = new mongoose.Schema({
    body:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User" //We do it this way as a means of telling mongoose, 
                       //HOW this entry may be related to another collection elsewhere
                       //so when mongoose has to populate an entry it can use this reference here.
        },
        username: String
    },
    rating:Number,
    created:{
        type:Date,
        default:Date.now
    }
});

let comment = new mongoose.model("Comment",commentSchema);

module.exports = comment;