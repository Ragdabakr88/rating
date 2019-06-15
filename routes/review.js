var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Employee = require('../models/employee');
var User = require('../models/user');
var async = require('async');
//helper upload
var {isEmpty } = require("../helpers/upload-helper");
var app = express();

/* GET home page. */


router.get('/:id', function(req, res, next) {
  Company.findOne({_id:req.params.id}).populate("user").exec(function(err,company){
  res.render('company/reviews',{id:req.params.id , company:company,user:req.user });
  });
});

/*router.post('/:id', function(req, res, next) {
  var companyId = req.params.id;
  console.log(companyId);

    async.parallel([
       function(callback){
      Company.findOne({_id:req.params.id},function(err,company){
         callback(err,company);
      });
       },function(company,callback){
          Company.update({
             _id:req.params.id
           },
           {
            $push:{companyRating:{
              userName : req.body.sender,
              userImge : req.user.file,
              userRating: req.body.clickedValue,
              userReview:  req.body.review,
            
            },
               ratingNumber:req.body.clickedValue
            },
 
        $inc: { 'ratingSum': req.body.clickedValue}
                 },function(err){
            if(err) throw err;
             // res.flash("success_message","Review added");
              // res.redirect("/reviews/"+req.params.id);
              res.redirect("/");
            
           }
           );
         }//call back end
      ])
});  */


   router.post('/:id', (req, res) => {
        async.waterfall([
            function(callback){
                Company.findOne({'_id':req.params.id}, (err, result) => {
                    callback(err, result);
                });
            },
            
            function(result, callback){
                Company.update({
                    '_id': req.params.id
                },
                {
                    $push: {companyRating: {
                     userName : req.body.sender,
                     userImage : req.user.file,
                     userRating: req.body.clickedValue,
                     userReview:  req.body.review
                    }, 
                        ratingNumber: req.body.clickedValue       
                    },
                    $inc: {ratingSum: req.body.clickedValue}
                }, (err) => {
                    req.flash('success_message', 'Your review has been added.');
                    res.redirect('/company/'+req.params.id)
                })
            }
        ])
    });



module.exports = router;
