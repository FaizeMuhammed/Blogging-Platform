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
        const data=await post.aggregate([{$sort:{createdAt:-1}}]).skip(perpage*page-perpage).limit(perpage).exec();
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

// function insertPostdata(){
//     post.insertMany([
        
//             {
//               "title": "Introduction to JavaScript",
//               "body": "JavaScript is a versatile programming language used for web development, among other things. It allows developers to create dynamic and interactive web pages."
//             },
//             {
//               "title": "Benefits of Regular Exercise",
//               "body": "Regular physical activity can improve your muscle strength and boost your endurance. Exercise delivers oxygen and nutrients to your tissues and helps your cardiovascular system work more efficiently."
//             },
//             {
//               "title": "Exploring the Universe",
//               "body": "The universe is vast and full of mysteries. From black holes to distant galaxies, there is so much to discover and understand about the cosmos."
//             },
//             {
//               "title": "Healthy Eating Tips",
//               "body": "Eating a balanced diet with a variety of nutrients is crucial for maintaining good health. Include plenty of fruits, vegetables, lean proteins, and whole grains in your daily meals."
//             },
//             {
//               "title": "Learning a New Language",
//               "body": "Learning a new language can be challenging but rewarding. It opens up new cultural experiences and improves cognitive abilities. Start with simple vocabulary and practice regularly."
//             },
//             {
//               "title": "Time Management Skills",
//               "body": "Effective time management helps you make the most of each day. By setting priorities, creating a schedule, and avoiding distractions, you can achieve your goals efficiently."
//             },
//             {
//               "title": "The Importance of Sleep",
//               "body": "Quality sleep is essential for mental and physical health. It helps the brain function properly and repairs the body. Aim for 7-9 hours of sleep each night for optimal well-being."
//             },
//             {
//               "title": "Basic Cooking Skills",
//               "body": "Knowing how to cook basic meals can save money and improve your diet. Start with simple recipes and gradually expand your culinary skills to include more complex dishes."
//             },
//             {
//               "title": "The Basics of Investing",
//               "body": "Investing is a way to grow your wealth over time. Learn about different types of investments, such as stocks, bonds, and real estate, and consider starting with small, diversified investments."
//             },
//             {
//               "title": "Stress Management Techniques",
//               "body": "Managing stress is crucial for maintaining mental health. Techniques such as deep breathing, meditation, exercise, and spending time in nature can help reduce stress levels."
//             },
//             {
//               "title": "Digital Privacy and Security",
//               "body": "Protecting your digital privacy is important in today's interconnected world. Use strong passwords, enable two-factor authentication, and be cautious about the personal information you share online."
//             },
//             {
//               "title": "Sustainable Living Practices",
//               "body": "Sustainable living involves making choices that reduce your environmental impact. This can include using reusable products, conserving energy, and supporting eco-friendly brands."
//             },
//             {
//               "title": "Creative Writing Tips",
//               "body": "Creative writing is an art form that allows you to express your imagination. To improve your writing, read regularly, practice daily, and experiment with different styles and genres."
//             },
//             {
//               "title": "Remote Work Best Practices",
//               "body": "Working remotely can be productive if you set up a dedicated workspace, maintain a routine, and communicate effectively with your team. Take breaks to avoid burnout and stay focused."
//             },
//             {
//               "title": "The Power of Positive Thinking",
//               "body": "Positive thinking can lead to better mental health and improved outcomes in life. Practice gratitude, surround yourself with positive influences, and focus on solutions rather than problems."
//             }
          
          
//     ])
// }
// insertPostdata();

router.get('/about',(req,res)=>{
    res.render('about')
});


module.exports=router;


