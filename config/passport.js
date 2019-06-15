const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const config = require('./database');
const User = require('../models/user');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});




passport.use(new GoogleStrategy({
  clientID: '180721579924-5rtnemgkgo244cmvff4m1se58ka05q93.apps.googleusercontent.com',
  clientSecret: '-EiWWRqTg9R5o9UnY41rXtU_',
  callbackURL: 'http://localhost:3000/user/auth/google/callback',

}, function(accessToken, refreshToken, profile, next) {
    User.findOne({ googleId: profile.id }, function(err, user) {
      if (user) {
        return next(err, user);
      } else {
        var newUser = new User();
        newUser.email = profile.emails[0].value;
        newUser.googleId = profile.id;
        newUser.name = profile.displayName;
        newUser.photo = profile._json.image.url;
        newUser.save(function(err) {
          if (err) throw err;
          next(err, newUser);
        });
      }
    });
}));



passport.use(new FacebookStrategy({
  clientID: '285418728610828',
  clientSecret: '3fb61c938d3e93beaff28938a09e0d68',
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'email']
}, function(accessToken, refreshToken, profile, next) {
    User.findOne({ facebookId: profile.id }, function(err, user) {
      if (user) {
        return next(err, user);
      } else {
        var newUser = new User();
        newUser.email = profile._json.email;
        newUser.facebookId = profile.id;
        newUser.name = profile.displayName;
        newUser.photo = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
        newUser.save(function(err) {
          if (err) throw err;
          next(err, newUser);
        });
      }
    });
}));

exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/');
}
