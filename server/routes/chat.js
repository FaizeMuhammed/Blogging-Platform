const express =require('express');
const router=express.Router()
const checkAuth=require('../middleware/auth')
const User=require('../models/user')


router.post('',checkAuth, async(req,res)=>{
    
    
    const username=req.username;
    const userId=req.userId;
    const receivername=req.body.receivername;
    const receiverId=req.body.receiverId
 

    
    
    
    const receiver = await User.findById(receiverId);
    
    const data={
      
    username,
    userId,
    receivername,
    receiverId,
    socketId: receiver.socketId

        
    }

    

    res.render('chat',{data})

})

module.exports=router;