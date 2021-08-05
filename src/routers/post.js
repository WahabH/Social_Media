const express = require('express')
const router = new express.Router()
const Post = require('../models/post')
const auth = require('../middleware/auth')
const User = require('../models/user')

// Create a post
router.post('/posts', auth, async (req, res) => {

    const post = new Post({
        owner: req.user._id
    })
    post.images = req.body.url
    await post.save()
    res.send()

}), (error, req, res, next) => {
    res.status(400).send(error)
}

// Like Post
router.patch('/posts/like/:id', auth, async (req, res) => {
    // Check if post is available
    const post = await Post.findById(req.params.id)
    if(!post){
        return res.send({error:"Post unavailable"})
    }

    const owner = await User.findById(post.owner.toString())

    // Check if user is either following the owner of the post or is  the owner of the post 
    const valid = owner.followers.find(element => element.toString()===req.user._id.toString())
    if(valid === undefined && owner._id.toString()!==req.user._id.toString()){
        return res.send({error:"Follow user first"})
    }
     
    // Check if post is already liked
    const liked = post.likes.find(element => element.toString()===req.user._id.toString())
    if(liked!== undefined){
        return res.send({error:"Post already liked"})
    }
    
    // Like Post and update
     Post.findByIdAndUpdate(req.params.id, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).then(result => {
        res.json(result)
    }).catch(err => {
        return res.status(422).json({ error: err })
    })

})




module.exports = router