const express=require("express");
const router=express.Router();
const User=require('../models/user');



router.get('',(req,res)=>{
    res.render('signuppage',{layout:'./layouts/signup'})
})

router.post('',async (req,res)=>{
    const {username,password}=req.body;
    try{
        let user= await User.findOne({username})
        if(user){
            return res.status(400).send('user already exisit')
        }

        user=new User({username,password});
        await user.save();

        res.redirect('/login');
    }
    catch(error){
        res.status(500).send('server error');
    }
})
module.exports=router;

