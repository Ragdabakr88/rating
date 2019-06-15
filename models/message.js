const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const messageSchema = new Schema({
  //for chat
  body:{type:String},
  sender:{type: Schema.Types.ObjectId, ref: 'User'},
  reciever:{type: Schema.Types.ObjectId, ref: 'User'},
  userFromName:{type:String,required :true},
  userFile:{type:String},
  userFileTo:{type:String},
  userToName:{type:String,required :true},
  createdAt:{type:Date , default:Date.now}

    
});



module.exports = mongoose.model('Message', messageSchema);