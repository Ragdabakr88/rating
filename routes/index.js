var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var mongoose = require('mongoose');
var LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('shop/index');
});



module.exports = router;
