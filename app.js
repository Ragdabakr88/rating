var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var methodOverride = require("method-override");
var session = require('express-session');
var flash= require('connect-flash');
const passport = require('passport');
var{mongoDbUrl} = require("./config/database");
var _ = require('underscore');
 

 //chat 
const app = express();



var LocalStrategy = require("passport-local").Strategy;
var MongoStore = require('connect-mongo')(session);
// reset password
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require("crypto");
// upload files
var upload = require('express-fileupload');




var routes = require('./routes/index');
var user = require('./routes/user');
var company= require('./routes/company');
var review= require('./routes/review');
var message = require('./routes/message');




require('./config/passport');

// mongo connected
mongoose.Promise = global.Promise;
mongoose.connect(mongoDbUrl).then(() => {
    console.log('connect to DB :' +  mongoDbUrl)
}).catch(err => {
    console.log('can`t connect to DB ' + mongoDbUrl)
})


const {GenerateTime} = require("./helpers/hbs-helper")
// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', helpers:{GenerateTime:GenerateTime}, extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//upload midleware
app.use(upload());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'mysupersecret', 
  resave: false, 
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(express.static(path.join(__dirname, 'public')));

//methodOverride midleware
app.use(methodOverride('_method'));

app.use(session({
   secret: 'edwindiaz123ilovecoding',
    resave: true,
    saveUninitialized: true

}));
app.use(flash());


// PASSPORT

app.use(passport.initialize());
app.use(passport.session());




// Local Variables using Middleware


app.use(function(req, res, next){

    res.locals.user = req.user || null;
    res.locals._ = _;

    res.locals.success_message = req.flash('success_message');
    res.locals.message = req.flash('message');

    res.locals.error_message = req.flash('error_message');

    res.locals.form_errors = req.flash('form_errors');

    res.locals.error = req.flash('error');
    

    next();


});


app.use('/', routes);
app.use('/user', user);
app.use('/company', company);
app.use('/review', review);
app.use('/message', message);



//deplying to heroku


//deplying to heroku
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'),
  function(){
    console.log("Express server listening on port " + app.get('port'));
});




