const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    description: {
          type: String,
          
    },
    owner: {
          type: mongoose.Schema.Types.ObjectId,
          required: true      
    },
    likes: {

    },
    images:[{
        type: String
    }]
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post