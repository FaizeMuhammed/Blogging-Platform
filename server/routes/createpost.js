const express=require('express');
const router=express.Router()
const checkAuth=require('../middleware/auth')
const post=require('../models/post')


router.get('',checkAuth,(req,res)=>{
    res.render('createpost',{layout:'./layouts/main'});
});

router.post('',checkAuth,async (req,res)=>{
    try{
        const {title,body}=req.body;
        const userId=req.userId;
        const username=req.username;
        const newPost = new post({
            title,
            body,
            userId,    
            username  
          });
        await newPost.save();

        res.redirect('/userposts');


    }
    catch(error){
        console.error(err);
        res.status(500).send("Server error while creating post.");
      

    }
})
















module.exports=router;