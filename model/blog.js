const mongoose = require('mongoose');

var PostSchema = mongoose.Schema({
    title : { type :String , required : true},
    description : { type: String, required : true},
    createdAt : {type:Date , default: Date.now},
    image : {type:String , required:false, unique: false},
    userid : {type:mongoose.Schema.Types.ObjectId , required:false, unique:false},
    public : {type:Boolean , required: false,default:false }
});


module.exports = mongoose.model('Post',PostSchema);