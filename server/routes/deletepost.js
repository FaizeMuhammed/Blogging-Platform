const express=require("express");
const router=express.Router();
const checkAuth=require('../middleware/auth');
const post=require('../models/post');

router.post('/:id',checkAuth, async(req,res)=>{
    try{
        console.log(req.params.id);
        
        const postId=req.params.id;
        const Post= await post.findOne({_id:postId});
        if(!post){
            return res.status(403).send('post not found');
        }
        await post.findByIdAndDelete(postId);
        res.redirect('/userposts');


    }
    catch(error){
        console.log(error);
        res.status(500).send('server error');
        
    }

})

module.exports=router;