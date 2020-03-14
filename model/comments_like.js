let mongoose = require('./db.js')

let CommentsLikeSchema = mongoose.Schema({
    userId: {
        type: String,
        index: true
    },
    commentId: {
        type: String,
        index: true
    },
    createTime: {
        type: String,
        index: true
    }
})



module.exports = mongoose.model('comments_like', CommentsLikeSchema, 'comments_like')