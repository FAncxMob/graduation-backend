let mongoose = require('./db.js')

let CommentsSchema = mongoose.Schema({
    commentId: {
        type: String,
        index: true,
        unique: true
    },
    openId: {
        type: String,
        index: true
    },
    iid: {
        type: String,
        index: true
    },
    replyId: {
        type: String,
        index: true
    },
    pid: {
        type: String,
        index: true
    },
    content: String,
    createTime: {
        type: Number,
        index: true
    }
})

module.exports = mongoose.model('comments', CommentsSchema, 'comments')