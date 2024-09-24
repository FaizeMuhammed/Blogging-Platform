const jwt=require('jsonwebtoken');
require('dotenv').config();



const checkAuth=(req,res,next)=>{
    
    
    const token=req.cookies.token;
    
    if(!token){
        return res.redirect('/login')
    }

    try{
        const decode=jwt.verify(token,process.env.JWt_SECRET);
        
        
       

        req.userId=decode.id;
        req.username=decode.username;
        ;
        
        
        

        next()
    }
    catch(error){
        res.redirect('/login')
    }
};


module.exports=checkAuth;