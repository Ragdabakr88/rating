const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({

     name:{ type: String,required: true },
     email:{ type: String,required: true },
     role:{ type: String },
     password:{ type: String },
     file: String,
     facebookId: String,
     googleId:String,
     resetPasswordToken:String,
     resetPasswordExpires:Date,
     company: {
         type: Schema.Types.ObjectId, ref: 'Company'
     }

});


module.exports = mongoose.model('User', userSchema);
