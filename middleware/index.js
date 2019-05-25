let campground = require('../models/campground');
let comment = require('../models/comment');

middlewareObj = {};


middlewareObj.commentOwnershipCheck = function (req, res, next) {
    if (req.isAuthenticated()) {        
        comment.findById(req.params.cid)
            .then((result) => {               
                if (result.author.id.equals(req.user._id) || req.user.isAdmin) { //THIS IS HOW YOU CMPARE VALUES IN MONGOOSE IT WONT WORK IF YOU USE ===
                                                                                    //req.user.isAdmin is to check for admin priveleges
                    next();
                } else {
                    req.flash('error','Access Denied');
                }
            })
            .catch(error=>console.log(error));
    } else {
        res.redirect('/login');
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    console.log(req.body);
    if (req.isAuthenticated()) {
        next();
    } else {
        req.session.redirectTo = req.originalUrl;
        req.session.sbody=req.body;

        console.log(req.session);
        req.flash('error','You need to be logged in.');
        res.redirect('/login');
    }
}

middlewareObj.ownershipCheck = function (req,res,next){
    if(req.isAuthenticated()){ 
        campground.findById(req.params.id)
        .then((result)=>{
            if(result.author.id.equals(req.user._id) || req.user.isAdmin){ //THIS IS HOW YOU CMPARE VALUES IN MONGOOSE IT WONT WORK IF YOU USE ===
                next();                                                     //req.user.isAdmin is to check for admin priveleges
            } else {
                req.flash('error','You need to be logged in.');
                res.redirect('/campgrounds');
            }})
        .catch(error=>console.log(error));
    } else {
        req.flash('error','You need to be logged in.');
        res.redirect('/login');
    }
}






module.exports = middlewareObj;