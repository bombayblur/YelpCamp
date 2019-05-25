let express = require('express');
let router = express.Router();
let passport = require('passport');

let user = require('../models/user');
let profile = require('../models/profile');
let adminkey = process.env.ADMIN_KEY;



//landing page
router.get('/',(req,res)=>{
    res.render('home');
});


//AUTH ROUTES
//===========
//Register new user form
router.get('/register', (req,res)=>{
    res.render('register');
});


//post new user to db
router.post('/register', (req,res)=>{
    //registration steps
    let newUser = new user({
        username:req.body.username
    });

    //check if this is an admin
    if(req.body.adminkey===adminkey){
        newUser.isAdmin = true;

    }
    //check if this is an admin


    //profile--
    let firstName = req.body.firstname;
    let lastName = req.body.lastname;
    //---


    user.register(newUser, req.body.password, (error,result)=>{
        if(error){
            req.flash('error',error.message);
            res.redirect('/register');
        } else {
            
            
            //profile-----
            profile.create({
                authId:result._id,
                username:result.username,
                firstname:firstName,
                lastname:lastName  
            });
            //profile------

            passport.authenticate("local")(req,res,()=>{
                req.flash('success','You have signed up as '+ result.username);
                res.redirect('/campgrounds');
            });
        }
    } );
});


// get login form
router.get('/login', (req,res)=>{
    res.render('login');
});


//post login details
router.post('/login', passport.authenticate('local',{
    // successRedirect:"/campgrounds",
    failureRedirect:"/login",
    failureFlash: { type: 'error', message: 'Invalid username or password.' }
}), (req,res)=>{

    req.flash('success','You have logged in.');
    res.redirect('/campgrounds');
    
} );


//trigger logout
router.get('/logout', (req,res)=>{
    req.logOut();
    req.flash('success','You have logged out.');
    res.redirect('/campgrounds');
});




module.exports = router;