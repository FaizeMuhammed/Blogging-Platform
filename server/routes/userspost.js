const express =require('express');
const router=express.Router()
const checkAuth=require('../middleware/auth')
const post=require('../models/post')

router.get('',checkAuth,async (req,res)=>{
    try{
        const posts= await post.find({userId:req.userId}).exec();
        res.render('userposts',{posts,layout:'./layouts/main'});

    }
    catch(error){
        console.error(error);
        res.status(500).send('Server error');
    }
})

module.exports=router;