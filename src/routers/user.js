const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const Post = require('../models/post')


// Signup a new user
router.post('/users', async (req, res) => {
    const user = new User(req.body)


    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.send({ user, token })

    } catch (e) {
        res.status(400).send(e)
    }
})

// Login User
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// Read user profile
router.get('/users/me', auth, async (req, res) => {
        res.send({
        Name: req.user.name,
        Username: req.user.username,
        Email: req.user.email,
        Age: req.user.age,
        Followers: req.user.followers,
        Following: req.user.following

    })
})

// Update User Profile
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const validUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!validUpdate) {
        return res.status(400).send({ error: "Invalid Update" })
    }

    try {

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()


        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Logout a user out of all devices
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// Delete User Account
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    }
    catch (e) {
        res.status(500).send(e)
    }
})


// Follow an account
router.patch('/users/follow/:id', auth, async (req, res) => {


    const user = await User.findById(req.params.id)
    if (!user) {
        return res.status(404).send({ error: "User not found" })
    }

    if (req.user.username === user.username) {
        return res.status(400).send({ error: "Cannot follow yourself" })
    }

    if (req.user.username !== user.username) {
        const follow = req.user.following.find(element => element.toString() === req.params.id)
        if (follow !== undefined) {
            return res.send({ error: "Already following" })
        }
    }

    User.findByIdAndUpdate(req.params.id, {
        $push: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: { following: req.params.id }

        }, { new: true }).then(result => {
            res.json(result)
        }).catch(err => {
            return res.status(422).json({ error: err })
        })
    })
})

// Unfollow an account
router.patch('/users/unfollow/:id', auth, async(req, res)=>{
    try{
        const follow = await User.findById(req.params.id)
        if(!follow){
            return res.status(404).send({error:"Account not found"})
        }
        req.user.following = req.user.following.filter((element)=>{
            return element.toString() !== req.params.id.toString()
        })
        res.send(req.user)
    }catch(e){
        res.send(e) 
    }
})

module.exports = router