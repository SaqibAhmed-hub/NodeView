const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const setuppassport = require('./setuppassport');
const environ = require('dotenv').config(); 

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

//Middleware
app.use(express.static('img'));
app.use(express.static('style'));
app.use('/post',express.static('img'));
app.use('/post',express.static('style'));
app.use('/post/edit',express.static('img'));
app.use('/img',express.static(path.resolve(__dirname,'img')));
app.use(bodyparser.urlencoded({extended:false}));
app.use(cookieparser());
app.use(session({
    secret: "kajsdklfjalksjflsjdlf",
    resave : false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//Database Connection
mongoose.connect(process.env.DB_CONNECTION,{useUnifiedTopology: true, useNewUrlParser : true});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
setuppassport();

//Router
const approute  = require('./router/approuter');
const apiroute = require('./router/api');
const postroute = require('./router/post');
app.use('/',approute);
app.use('/api',apiroute);
app.use('/post',postroute);


//Server Port
const port = process.env.port || 3000
app.listen(port,() => {
    console.log(`Server running on the port ${port}...`);
});