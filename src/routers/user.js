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
        Email: req.user.email,
        Age: req.user.age,
        Username: req.user.username
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
    
//         const user = await User.findById( req.params.id )
//         if (!user) {
//             return res.status(404).send({ error: "User not found" })
//         }
//         // res.send(user.username)
        
//         if (req.user.username === user.username) {
//             return res.status(400).send({ error: "Cannot follow yourself" })
//         } console.log(user.username)
//         //  else if (req.user.username !== user.username) {
//         //     req.user.following.forEach((follow) => {
//         //         if (follow === user.username) {
//         //             return res.send({
//         //                 error: "Already following!"
//         //             })
//         //         }
//         //     })}
//         //     req.user.following.push(user.username)
//         //     await req.user.save()
//         //     res.send(req.user.following)
    
})

module.exports = router