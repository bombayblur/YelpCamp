var mongoose = require('mongoose');
let campschema = new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    price:Number,
    rating:Number,
    location:String,
    lat:Number,
    lng:Number,
    created:{
        type:Date,
        default:Date.now
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId ,
        ref:'Comment'
    }]
});

let campground = new mongoose.model("Campground",campschema);

module.exports = campground;