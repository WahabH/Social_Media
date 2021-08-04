const express = require('express')
const router = new express.Router()
const Post = require('../models/post')
const auth = require('../middleware/auth')


router.post('/posts', auth, async(req,res)=>{
       
    const post = new Post({
               owner: req.user._id})
    post.images = req.body.url
    await post.save()
    res.send()
    
}),(error,req,res,next)=>{
    res.status(400).send(error)
}



module.exports = router