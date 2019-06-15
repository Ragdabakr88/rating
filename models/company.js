const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const companySchema = new Schema({
user: { type: Schema.Types.ObjectId, ref: 'User'},
     name:{ type: String,required: true },
     address:{ type: String,required: true },
     website:{ type: String },
     file: String,
     body: String,

     companies: [{ type: Schema.Types.ObjectId, ref: 'Company'}],
   
   employees: [{

        employeeId:{type:String,default:""},
        employeeName:{type:String,default:""},
        employeeRole:{type:String,default:""},


    }],
     companyRating:[{
     	userName:{type:String,default:""},
     	userImage:{type:String,default:""},
     	userRating:{type:Number,default:0},
     	userReview:{type:String,default:""},

     }],

     ratingNumber:[Number],
     ratingSum:{type:Number,default:0}

 
     
});


module.exports = mongoose.model('Company', companySchema);