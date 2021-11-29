const express = require('express');
const router  = express.Router();
const passport = require('passport');
const User = require('../model/user');

router.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.info = req.flash('info');

    next();
});

router.get('/',(req,res) => {
    res.render('../views/home');
});

router.get('/home',(req,res) => {
    res.render('../views/home');
});

router.get('/login',(req,res) => {
    res.render('../views/login');
});

router.post('/login',passport.authenticate("login",{
    successRedirect : "/",
    failureRedirect : "/login",
    failureFlash : true
}));

router.get('/logout',(req,res) => {
    req.logOut();
    res.redirect('/home');
});

router.get('/signup',(req,res) => {
    res.render('../views/signup');
});

router.post('/signup',(req,res,next) => {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({email:email},function(err,user){
        if(err) { return next(err);}
        if(user){
            req.flash("error","There's is an already account");
            return res.redirect('/signup');
        }

        var newUser = new User({
            username : username,
            password : password,
            email :email
        });

        newUser.save(next)
    });
}, passport.authenticate("login",{
    successRedirect : "/",
    failureRedirect : "/signup",
    failureFlash : true
}));


module.exports = router;