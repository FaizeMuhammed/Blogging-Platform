const express=require("express");
const router=express.Router();
const post=require('../models/post')
const User=require('../models/user')
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const checkAuth=require('../middleware/auth')
require('dotenv').config();


// Routes
router.use('/create-post',require('./createpost'));
router.use('/signup',require('./signup'));
router.use('/delete-post',require('./deletepost'));
router.use('/userposts',require('./userspost'));
router.use('/edit-post',require('./editpost'));
router.use('/Users',require('./users'));
router.use('/chat',require('./chat'));
// login get page
router.get('/login',(req,res)=>{
    res.render('loginpage',{layout:'./layouts/login'})
})
// 

// login post and check
router.post('/login',async (req, res) => {
        const { username, password } = req.body;
        
        
        
        
        

        try {
            const user = await User.findOne({ username });
            
            
            
            
            if(!user){
                return res.render('loginpage', {
                    layout: './layouts/login', 
                    error: 'Invalid username...!'
                });
            }
            
            
            
  
            
            if(password!==user.password){
                return res.render('loginpage', {
                    layout: './layouts/login', 
                    error: 'Invalid  password...!'
                });
            }
            
            
            
            
            const token=jwt.sign(
                {id:user._id,username:user.username},
                process.env.JWT_SECRET,
                {expiresIn:'1h'}
            )
            
            
            res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); 
            
            
            res.redirect('/');
        }
        catch (error) {
            
             res.status(500).render('loginpage', {
                layout: './layouts/login', 
                error: 'server error...!'
            });
        }
    })

// home//
router.get('',checkAuth, async (req,res)=>{
   
    try{
        const local={
            title:"home",
            description:"home page"
        }
        const perpage=8;
        const page=req.query.page || 1
        const data = await post.aggregate([
            { $sort: { createdAt: -1 } },
            { $skip: perpage * page - perpage },
            { $limit: perpage },
            {
                $lookup: {
                    from: 'users', 
                    localField: 'userId', 
                    foreignField: '_id', 
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails' 
            },
            {
                $project: {
                    title: 1,
                    body: 1,
                    createdAt: 1,
                    username: '$userDetails.username' 
                }
            }
        ]).exec();
        

        const count=await post.countDocuments();
        const nextPage=parseInt(page)+1;
        const hasnextPage=nextPage<=Math.ceil(count/perpage);
        res.render('index',{
            local,
            data,
            current:page,
            nextPage:hasnextPage ? nextPage:null
        });

    }
    catch(error){
        console.log(error);
    }

    
});
// posts
router.get('/post/:id', async (req,res)=>{
   
    try{
        let id=req.params.id.trim();
        const data= await post.findById({_id:id});
        res.render('posts',{data})
        
    }
    catch(error){
        console.log(error);
    }

    
});

router.get('/logout', (req, res) => {
    res.clearCookie('token'); 
    res.render('loginpage', {
        layout: './layouts/login'
    
    });  
});

router.get('/about',(req,res)=>{
    res.render('about')
});


module.exports=router;


