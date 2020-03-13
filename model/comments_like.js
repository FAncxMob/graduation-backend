let mongoose = require('./db.js')

let CommentsLikeSchema = mongoose.Schema({
    userId: {
        type: Number,
        index:true  
    },
    commentId: {
        type: Number,
        index:true
    },
    createTime: {
        type: String,
        index:true
    }
})



module.exports = mongoose.model('comments_like',CommentsLikeSchema,'comments_like')