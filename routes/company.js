var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Employee = require('../models/employee');
var User = require('../models/user');
var async = require('async');
var {arrayAverage} = require("../myFunction");
//helper upload
var {isEmpty } = require("../helpers/upload-helper");
var app = express();

/* GET home page. */





router.get('/create', function(req, res, next) {
  res.render('company/create');
});


router.post('/create', function(req, res, next) {
//validate form 

  let errors = [];
  if(!req.body.name){
    errors.push({message:"Please add a name"});
  }
    if(!req.body.body){
    errors.push({message:"Please add a descriptin"});
  }

  if(errors.length > 0){
    res.render('company/create',{errors:errors})
  }else{

  let filename = "banner-33.jpg";

  if(!isEmpty(req.files)){
       let file = req.files.file;
       //Date.now() modify duplicate pic
       filename = Date.now() + '-' + file.name;

        file.mv('./public/uploads/' + filename, (err)=>{

            if(err) throw err;

        });

}


  var company = new Company();
    company.name = req.body.name;
    company.user = req.user.id;
    company.website = req.body.website;
    company.address = req.body.address;
    company.body = req.body.body;
    company.file = filename;
  
  company.save(function (err,company){
    if (err){
      console.log(err);
    }
    console.log(company);
  req.flash('success_message','Company was created successfly') ;
    res.redirect('/');
   }); 
  }
});


router.get('/', function(req, res, next) {
  Company.find({}).populate("user").exec(function(err,companies){
  res.render('company/index',{companies:companies,user:req.user});
  });
});




router.get('/:id', function(req, res, next) {
  Company.findOne({_id:req.params.id}).populate("user").populate("companyRating").exec(function(err,company){
      var avg = arrayAverage(company.ratingNumber);
  res.render('company/single',{company:company,user:req.user,avg:avg});
  });
});

// register employee
router.get('/register-employee/:id', function(req, res, next) {
  Company.findOne({_id:req.params.id}).populate("user").exec(function(err,company){
  res.render('company/register-employee',{id:req.params.id , company:company,user:req.user});
  });
});

router.post('/register-employee/:id', function(req, res, next) {
  var companyId = req.params.id;
 var userId = req.user._id;
  console.log(userId);
    async.parallel([
       function(callback){
          var employee = new Employee();
           employee.employeeId = req.user._id;
           employee.employeeName = req.user.name;
           employee.employeeRole = req.body.employeeRole;
           employee.save(function (err){
            callback(err,employee);
            console.log(companyId);
          });
       },function(employee,callback){
          Company.update({
             _id:companyId
           },
           {
            $push:{employees:{
              employeeId : req.user._id,
              employeeName : req.user.name,
              employeeRole : req.body.employeeRole
               }}
             }
           ,function(err,count){
            if(err) throw err;
               res.redirect("/company/"+req.params.id);
            
           }

           );
         }//call back end
         ,

         function(callback){
           async.waterfall([
            function(callback){
          Company.findOne({_id:req.params.id},function(err,company){
             callback(err,company);
          })
        },function(company,callback){
          User.update({
            _id:req.user._id
          },
          {
            $push:{company:req.params.id}
          }

          )
        },function(err,count){
            if(err) throw err;
               res.redirect("/company/"+req.params.id);
            
           }

            ])
         }//end function

      ])
});

router.get('/employees/:id', function(req, res, next) {
  Company.findOne({_id:req.params.id}).populate("employees").exec(function(err,company){
  res.render('company/employees',{id:req.params.id ,company:company,user:req.user });
  });
});


module.exports = router;
