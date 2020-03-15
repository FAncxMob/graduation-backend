let mongoose = require('./db.js')

let CommentsLikeSchema = mongoose.Schema({
    openId: {
        type: String,
        index: true
    },
    commentId: {
        type: String,
        index: true
    },
    createTime: {
        type: Number,
        index: true
    }
})



module.exports = mongoose.model('comments_like', CommentsLikeSchema, 'comments_like')