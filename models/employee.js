const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const employeeSchema = new Schema({
          user: { type: Schema.Types.ObjectId, ref: 'User'},
        employeeId:{type:String,default:""},
     	employeeName:{type:String,default:""},
     	employeeRole:{type:String,default:""},
});


module.exports = mongoose.model('Employee', employeeSchema);