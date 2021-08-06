const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    description: {
          type: String,
          
    },
    owner: {
          type: mongoose.Schema.Types.ObjectId,
          required: true      
    },
    likes: [{
        type: ObjectId,
        ref:"User",
    }],
    images:[{
        type: String,
        required: true
    }],
    comments:[{
        type: String
    }]
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post