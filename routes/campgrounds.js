let express = require('express');
let router = express.Router();
let campground = require('../models/campground');
let profile = require('../models/profile');
var methodOverride = require('method-override');
let comment = require('../models/comment');
let middleware = require('../middleware');

var NodeGeocoder = require('node-geocoder');
 
var options = { //options for geocoder
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);



//  parent '/campgrounds'


// INDEX ROUTE
router.get('/',(req,res)=>{
    console.log(req.user);
    
    campground.find({}).then((response)=>{
        res.render('campgrounds', {"campgrounds" :response});
        }).catch((error)=>{
            req.flash("error",error.message);
            res.redirect('/campgrounds');
        });   
});


//NEW CAMPGROUND ROUTE Crud
router.get('/new',middleware.isLoggedIn, (req,res)=>{
    let val = req.user;
    res.render('new');
});


// CREATE CAMPGROUND ROUTE Crud
router.post('/', middleware.isLoggedIn, (req,res)=>{
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let price = req.body.price;
    let rating = req.body.rating;
    let author = {
        id: req.user._id,
        username: req.user.username,
    };

  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    let obj = {name:name, image:image, description:description, price:price, rating:rating, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    campground.create(obj,(err,result)=>{
        if(err) {
            req.flash('error',err.message);
            res.redirect("/campgrounds");
        } else {
            req.flash('success','Your entry has been added.');
            res.redirect("/campgrounds");
        }
        });
  });   
});


//SHOW CAMPGROUND ROUTE  cRud
router.get('/:id',(req,res)=>{
    campground.findById(req.params.id).populate('comments').exec((error,location)=>{
        
        if(error){
            
                req.flash("error",error.message);
                res.redirect('/campgrounds');
            
        } else {
        res.render('show',{campground:location});
        }
    }); 
});

//// EDIT AND DELETE ROUTES /////


//edit campgroud route /:id/edit
router.get('/:id/edit', middleware.ownershipCheck, (req,res)=>{
    campground.findById(req.params.id)
    .then((result)=>res.render('campedit',{campground:result}))
    .catch((error)=>{
        req.flash("error",error.message);
        res.redirect('/campgrounds');
    });
});


//update campground route /:id
router.put('/:id', middleware.ownershipCheck, (req,res)=>{

    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        
        campground.findByIdAndUpdate(req.params.id ,{
            name:req.body.name,
            image:req.body.image,
            description:req.body.description,
            price:req.body.price,
            rating:req.body.rating,
            location:data[0].formattedAddress,
            lat:data[0].latitude,
            lng:data[0].longitude,
    
        })
        .then((result)=>{
            req.flash('success','Your entry has been updated.');
            res.redirect('/campgrounds/'+req.params.id);
        })
            .catch((error)=>{
                req.flash("error",error.message);
                res.redirect('/campgrounds/'+req.params.id);
            });
      });
    
});

//delete campground
router.delete('/:id', middleware.ownershipCheck, async (req,res)=>{

    //delete comments associated with campground
    await campground.findById(req.params.id)
    .then(
        (result)=>{
            let comIds = result.comments;
            comIds.forEach((id)=>{
                comment.findByIdAndDelete(id);              
            });
        }
    ).catch((error)=>{
        req.flash('error',error.message);
        res.redirect('/campgrounds');
    });

    //delete campground
    await campground.findByIdAndDelete(req.params.id)
    .then((result)=>{
        req.flash('success','Your entry has been deleted.');
        res.redirect('/campgrounds')})
    
    .catch((error)=>{
        req.flash('error',error.message);
        res.redirect('/campgrounds');
    });  
});






module.exports = router;