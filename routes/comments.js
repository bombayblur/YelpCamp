//CREATE COMMENT(nested routes)

let _ = require('lodash');
let express = require('express');
let router = express.Router({
    mergeParams: true
});
let middleware = require('../middleware');

let campground = require('../models/campground');
let comment = require('../models/comment');


//form for adding new comment
router.get("/new", middleware.isLoggedIn, (req, res) => {

    campground.findById(req.params.id).then((location) => {

        res.render('newComment', {
            campground: location
        });
    }).catch((error) => {
        req.flash('error', error.message);
        res.redirect('/campgrounds/' + req.params.id);
    });
});



//posting new comment
router.post("/", middleware.isLoggedIn, (req, res) => {

    campground.findById(req.params.id, (error, location) => {
        if (error) {
            req.flash('error', error.message);
            res.redirect('/campgrounds');
        } else {
            //first create a comment
            comment.create(req.body.comment, (error, comment) => {
                if (error) {
                    req.flash('error', error.message);
                    res.redirect('/campgrounds');
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save(); //comment is a mongo model and needs to be saved before pushing.

                    //now append the comment to the campground document
                    location.comments.push(comment);
                    location.save();
                    req.flash('success', 'Your comment has been added.');
                    res.redirect('/campgrounds/' + req.params.id);
                }
            });
        }
    });
});

//campgrounds/:id/comments/:cid/edit'


//render comment edit form
router.get('/:cid/edit', middleware.commentOwnershipCheck, (req, res) => {

    comment.findById(req.params.cid)
        .then((comment) => {
            campground.findById(req.params.id)
                .then((campground) => {
                    res.render("comntedit", {
                        comment: comment,
                        campground: campground
                    });
                });
        })
        .catch((error) => {
            req.flash('error', error.message);
            res.redirect('/campgrounds');
        });

});

//update comments
router.put('/:cid', middleware.commentOwnershipCheck, (req, res) => {
    
    comment.findByIdAndUpdate(req.params.cid, req.body.comment)
        .then((result) => {
            req.flash('success', 'Your comment has been updated.');
            res.redirect('/campgrounds/' + req.params.id);
        })
        .catch((error) => {
            req.flash('error', error.message);
            res.redirect('/campgrounds' + req.params.id);
        });
});


router.delete('/:cid', middleware.commentOwnershipCheck, (req, res) => {

    //delete from comment collection
    comment.findByIdAndDelete(req.params.cid)
        .then(

            //delete comments listed in campgrounds
            campground.findById(req.params.id, (error, result) => {
                if (error) {
                    req.flash('error', error.message);
                    res.redirect('/campgrounds/' + req.params.id);
                } else {
                    result.comments.pull(req.params.cid);
                    result.save();
                    req.flash('success', 'Your comment has been deleted.')
                    res.redirect('/campgrounds/' + req.params.id);
                }
            }))
        .catch((error) => {
            req.flash('error', error.message);
            res.redirect('/campgrounds/' + req.params.id);
        });
});


module.exports = router;