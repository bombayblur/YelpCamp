let mongoose = require("mongoose");
let campground = require('../models/campground');
let comment = require('../models/comment');

let dummyCampGrounds = [
    {name:"Smokey creek",image:"https://source.unsplash.com/400x300/?camping",description:"This camp sucks. I've been wiping my ass with leaves."},
    {name:"Wet Marsk",image:"https://source.unsplash.com/500x350/?camping",description:"This camp sucks. I've been wiping my ass with leaves."},
    // {name:"Dry Hill",image:"https://source.unsplash.com/400x300/?camping",description:"This camp sucks. I've been wiping my ass with leaves."},
    // {name:"Buffalo River",image:"https://source.unsplash.com/400x300/?camping",description:"This camp sucks. I've been wiping my ass with leaves."},
    // {name:"Fox Canal",image:"https://source.unsplash.com/400x300/?camping",description:"This camp sucks. I've been wiping my ass with leaves."},
    // {name:"Smokey creek",image:"https://source.unsplash.com/400x300/?camping",description:"This camp sucks. I've been wiping my ass with leaves."},
    // {name:"Wet Marsk",image:"https://source.unsplash.com/500x350/?camping",description:"This camp sucks. I've been wiping my ass with leaves."},
    // {name:"Dry Hill",image:"https://source.unsplash.com/400x300/?camping",description:"This camp sucks. I've been wiping my ass with leaves."},
    // {name:"Buffalo River",image:"https://source.unsplash.com/400x300/?camping",description:"This camp sucks. I've been wiping my ass with leaves."},
    // {name:"Fox Canal",image:"https://source.unsplash.com/400x300/?camping",description:"This camp sucks. I've been wiping my ass with leaves."},
]

function seedDb(){
comment.deleteMany({},(err,result)=>{
    if(err){
        console.log(err);
    } else {
        campground.deleteMany({}, (err,result)=>{
            if(err){
                console.log(err);
            } else {
                console.log('campgrounds deleted')
                dummyCampGrounds.forEach((dummyCamp)=>{
                    campground.create(dummyCamp, (err,dummyCampDocu)=>{
                        if(err){
                            console.log(err);
                        } else {
                            console.log('campground created');
        
                            comment.create({
                                body: "The bears here are horny",
                                author: "Monty Python"
                            },(err,commentDocu)=>{
                                if(err){
                                    console.log(err);
                                } else {
                                    dummyCampDocu.comments.push(commentDocu);
                                    dummyCampDocu.save();
                                    console.log("comment added");
                                }
                            });
                        }
                    });
                });
            }
        });
    }
});
}

// function seedDb(){
//     campground.deleteMany({},(err)=>{console.log(err);});
// }








module.exports = seedDb;