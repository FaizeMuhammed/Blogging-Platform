const express =require('express');
const router=express.Router()
const checkAuth=require('../middleware/auth')
const User=require('../models/user')


router.get('',checkAuth,async (req,res)=>{
    const userId=req.userId
    
    
    try{
        
        const perpage=8;
        const page=req.query.page || 1
        const data = await User.find().skip((perpage * page) - perpage).limit(perpage);
        

        const count=await User.countDocuments();
        const nextPage=parseInt(page)+1;
        const hasnextPage=nextPage<=Math.ceil(count/perpage);
        res.render('users',{
            userId,
            data,
            current:page,
            nextPage:hasnextPage ? nextPage:null
        });

    }
    catch(error){
        console.log(error);
    }
})

module.exports=router;