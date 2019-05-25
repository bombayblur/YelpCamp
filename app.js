var express = require("express");
var mongoose = require('mongoose');
var passport = require('passport');
var passportLocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var moment = require('moment');
var dotenv = require('dotenv').config(); //enviornment variables are stored here
 //passing options to geocoder

let user = require('./models/user');
let campground = require("./models/campground"); //importing campground models and schema
let comment = require('./models/comment');
let profile = require('./models/profile');

let seed = require('./seeds');

let campgroundRoutes = require("./routes/campgrounds");
let commentroutes = require("./routes/comments");
let indexroutes = require("./routes/index");


var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.locals.moment = moment;


app.use(expressSession({ //cookie id generation
    secret: 'hashtables',
    resave: false,  // Boilerplate for express-session
    saveUninitialized: false // Boilerplate for express-session
}));

app.use(passport.initialize()); //starts passport
app.use(passport.session()); //initialtes session serializing

app.use(flash());

passport.use(new passportLocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

mongoose.set('useNewUrlParser',true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false); //for findbyidandupdate
mongoose.connect('mongodb://localhost/yelpdb');

app.use(async (req,res,next)=>{
    res.locals.currentUser = req.user;
    
    if(req.user){
        await profile.findOne({authId:req.user._id},(err,result)=>{
            if(err){
                console.log(error);
            }
            else {
                res.locals.currProfile = result;
             }
            // next();  // Putting next() and after else gives it async functionality
        });
    } else {
        // next();  
    }
    
    res.locals.success = req.flash('success'); //passing flash messages as global variables.
    res.locals.error = req.flash('error'); //passing flash messages as global variables.
   
    next() //keep next() here if you're using async/await
});

// seed();

app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comments',commentroutes);
app.use(indexroutes);

app.listen(process.env.PORT || 800,()=>console.log('server is running...800'));