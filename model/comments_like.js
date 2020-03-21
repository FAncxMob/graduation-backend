let mongoose = require('./db.js')

let CommentsLikeSchema = mongoose.Schema({
    openId: {
        type: String,
        index: true
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    createTime: {
        type: Number,
        index: true,
        default: Date.now()
    },
    postOpenId: {
        type: String,
        index: true
    }
})



module.exports = mongoose.model('comments_like', CommentsLikeSchema, 'comments_like')