var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Employee = require('../models/employee');
var User = require('../models/user');
var Message = require('../models/message');
var async = require('async');
//helper upload
var {isEmpty } = require("../helpers/upload-helper");
var app = express();
var async = require('async');

/* GET home page. */


/*router.get('/:id', function(req, res, next) {
  async.parallel([
    function(callback){
  User.findOne({_id:req.params.id},function(err,result1){
     callback(err,result1);
   });
     },function(callback){
      Message.find({'$or':[{
        'sender' : req.user._id,'reciever' : req.params.id
      },{
         "userFromName": req.user._id,"userToName" : req.params.id
       }]},function(err,result2) {
          callback(err,result2);

      
     });
     }//end call back
    ], function(err,results){

      var data  = results[0];
      var messages = results[1];
      res.render("messages/message",{user:req.user ,data:data,chat:messages});
    });
  });  */



   router.get('/:id', function(req, res, next) {
        async.parallel([
            function(callback){
                User.findById({'_id':req.params.id}, (err, result1) => {
                    callback(err, result1);
                })
            },
            
            function(callback){
                Message.find({'$or': [{'sender':req.user._id, 'reciever':req.params.id}, {'userFrom': req.params.id, 'userTo':req.user._id},
                 {'userFile':req.user._id, 'userFileTo':req.params.id}
                  ]}, (err, result2) => {
                    callback(err, result2);
                });
            }
        ], function(err, results){
            var data = results[0];
            var messages = results[1];
            
            res.render('messages/message', {title: 'Private Message', user:req.user, data:data, chats:messages});
        });
    });
    







router.post('/:id', function(req, res, next) {
User.findOne({_id:req.params.id},function(err,data){
  var message = new Message();
  message.sender = req.user._id,
  message.reciever = req.params.id,
  message.body = req.body.message;
  message.userFromName = req.user.name,
  message.userFile = req.user.file,
  message.userFileTo = data.file,
  message.userToName = data.name,
  message.createdAt = new Date()
  console.log(message);
  message.save(function(err){
    res.redirect("/message/"+req.params.id);
  });
 });
});
module.exports = router;
