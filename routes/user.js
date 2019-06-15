var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var mongoose = require('mongoose');
var LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// reset password
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require("crypto");
//Google Facebook AUTH
const passportConfig = require('../config/passport');

//helper upload
var {isEmpty} = require("../helpers/upload-helper");

//Login 

router.get('/login', function(req, res) {
  res.render('user/login');
});

// APP LOGIN


passport.use(new LocalStrategy({usernameField: 'email'},function (email, password, done){

    User.findOne({email: email}).then(user=>{

        if(!user) return done(null, false, {message: 'No user found'});

        bcrypt.compare(password, user.password,function (err, matched){

            if(err) return err;


            if(matched){

                return done(null, user);

            } else {

                return done(null, false, { message: 'Incorrect password' });

            }

        });

    });

}));


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});



router.post('/login',function (req, res, next){


    passport.authenticate('local', {

        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
     
    })(req, res, next);

});


//register

router.get('/register', function(req, res, next) {
  res.render('user/register');
});

router.post('/register', function(req, res, next) {

  

    let errors = [];


    if(!req.body.name) {

        errors.push({message: 'please enter your name'});

    }


  

    if(!req.body.email) {

        errors.push({message: 'please add an email'});

    }

    if(!req.body.password) {

        errors.push({message: 'please enter a password'});

    }


    if(!req.body.passwordConfirm) {

        errors.push({message: 'This field cannot be blank'});

    }


    if(req.body.password !== req.body.passwordConfirm) {

        errors.push({message: "Password fields don't match"});

    }



    if(errors.length > 0){

        res.render('user/register', {

            errors: errors,
            name: req.body.name,
            email: req.body.email,

        })

      
   
    } else{

  let filename = "banner-33.jpg";

  if(!isEmpty(req.files)){
       let file = req.files.file;
       //Date.now() modify duplicate pic
       filename = Date.now() + '-' + file.name;

        file.mv('./public/uploads/' + filename, (err)=>{

            if(err) {
              console.log(err)
            };

        });

}

    User.findOne({email:req.body.email},function(err,user){
         if(!user){

  var user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.file = filename;
      console.log(filename);

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
       user.password = hash;
       user.save(function (err,user){
    if(err) throw err ;
    req.flash("success_message" , "You are registered, please login");
      res.redirect('/user/login');

       });

    });
  });

         }else{

                req.flash('error_message', 'That email exist please login');
                res.redirect('/user/login');

            }

        });
    }//end else
});

//Logout

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});




//Reset Password
router.get('/forgot', function(req, res, next) {
  res.render("user/forgot");
  });

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'ragdaaaaadel@gmail.com',
          pass: 'regorego1'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'ragdaaaaadel@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/user/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success_message', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/user/forgot');
  });
});


router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error_message', 'Password reset token is invalid or has expired.');
      return res.redirect('/user/forgot');
    }
    res.render('user/reset', {token: req.params.token});
  });
});


router.post('/reset/:token', function(req, res) {
async.waterfall([
function(done) {
User.findOne({ resetPasswordToken: req.params.token,     resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
if (!user) {
  req.flash('error_message', 'Password reset token is invalid or has expired.');
  return res.redirect('back');
}

user.password = req.body.password;
user.resetPasswordToken = undefined;
user.resetPasswordExpires = undefined;

user.save(function(err) {
  req.logIn(user, function(err) {
    done(err, user);
    console.log(user);
  });
});
});
},
function(user, done) {
var smtpTransport = nodemailer.createTransport({
service: 'Gmail',
auth: {
  user: 'ragdaaaaadel@gmail.com',
  pass: 'regorego1'
}
});
var mailOptions = {
to: user.email,
from: 'ragdaaaaadel@gmail.com',
subject: 'Your password has been changed',
text: 'Hello,\n\n' +
  'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
};
smtpTransport.sendMail(mailOptions, function(err) {
req.flash('success_message', 'Success! Your password has been changed.');
done(err);
});
}
], function(err) {
res.redirect('/');
});
});



router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/register',
  failureFlash: true
 }));


 router.get('/auth/google', passport.authenticate('google', { scope: 'email' }));

 router.get('/auth/google/callback', passport.authenticate('google', {
   successRedirect: '/user/profile',
   failureRedirect: '/user/register',
   failureFlash: true
  }));

/* PROFILE ROUTE */
router.route('/profile')
  .get(passportConfig.isAuthenticated, (req, res, next) => {
    res.render('user/profile', { message: req.flash('success') });
  })
  .post((req, res, next) => {
    User.findOne({ _id: req.user._id }, function(err, user) {
      if (user) {
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.about) user.about = req.body.about
        user.save(function(err) {
          req.flash('success', 'Your details have been updated');
          res.redirect('/profile');
        });
      }
    });
  });

module.exports = router;
