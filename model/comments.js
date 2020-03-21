let mongoose = require('./db.js')
// 如果是直接对帖子进行回复 则replyCommentId和parentCommentId都是
// 5e73a4fc3793ae3a44a97e52
let CommentsSchema = mongoose.Schema({
    openId: {
        type: String,
        index: true
    },
    iid: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    replyCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        default: mongoose.Types.ObjectId('5e73a4fc3793ae3a44a97e52')
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        default: mongoose.Types.ObjectId('5e73a4fc3793ae3a44a97e52')
    },
    content: String,
    createTime: {
        type: Number,
        index: true,
        default: Date.now()
    },
})

module.exports = mongoose.model('comments', CommentsSchema, 'comments')