const mongoose=require('mongoose');

const Schema=mongoose.Schema;
const postSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }, 
     userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',  
        required: true
    },
    username: {
        type: String, 
        required: true
      }
});
module.exports=mongoose.model('post',postSchema);
