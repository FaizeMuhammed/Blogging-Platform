const express=require("express");
const router=express.Router();
const checkAuth=require('../middleware/auth');
const post=require('../models/post');


router.get('/:id',checkAuth,async (req,res)=>{
    try{
        const postId = req.params.id;
        const Post = await post.findOne({ _id: postId });
        if (!Post) {
            return res.status(403).send('cannot edit this post');
        }
        res.render('editPost', { Post, layout: './layouts/main' });

    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }

})

router.post('/:id',checkAuth,async (req,res)=>{
    try{
        const postId = req.params.id;
        const { title, body } = req.body;

        console.log(body);
        

        const Post = await post.findOne({ _id: postId});
        if (!Post) {
            return res.status(403).send('cannot edit this post');
          }
        
        Post.title = title;
        Post.body = body;
        await Post.save();  

        res.redirect('/userposts');


    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }

})



module.exports=router;