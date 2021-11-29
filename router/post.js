const express = require('express');
const router  = express.Router();
var Post = require('../model/blog');
var multer = require('multer');
var crypto = require('crypto');
var path = require('path');

//Middleware
var ensureAuth = function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash("info","You must be login first to see");
        res.redirect('/login');
    }
}

router.use(ensureAuth);

var storage = multer.diskStorage({
        destination : './img/',
        filename : function(req,file,cb){
               crypto.pseudoRandomBytes(16,function(err,raw){
                cb(null,raw.toString('hex') + Date.now() + path.extname(file.originalname))
               }); 
        }
    }
);

var upload = multer({storage:storage});

router.get('/', (req,res) =>{

    Post.find({userid: req.user._id}).exec(function(err,post){
        if(err) { console.log(err);}
        res.render('../views/post',{post:post});
    });

});

router.get('/add',(req,res) => {
    res.render('../views/addpost');
});

router.post('/add',(req,res) => {
    var newblog = new Post({
        title : req.body.title,
        description : req.body.description,
        userid :req.user._id
    });
    newblog.save(function(err,post){
        if(err) { 
            console.log(err); 
        }
        res.redirect('/post');
    });
    
});

router.get('/:postId',(req,res) =>{
    Post.findById(req.params.postId).exec(function(err,post){
        res.render('../views/details',{post:post});
    });
});

router.get('/edit/:postId',(req,res) =>{
    Post.findById(req.params.postId).exec(function(err,post){
        res.render('../views/editdetails',{post:post});
    });
});

router.post('/update', upload.single('image') ,async(req,res) =>{
    const post = await Post.findById(req.body.postid);

    post.title = req.body.title;
    post.description = req.body.description;
    post.image = req.file.path;

    try {
        let savePost = await post.save();
        console.log('savepost',savePost);
        res.redirect('/post/' + req.body.postid);
    } catch (err) {
        console.log(err);
        
    }
});




module.exports = router;