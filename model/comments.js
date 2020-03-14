let mongoose = require('./db.js')

let CommentsSchema = mongoose.Schema({
    commentId: {
        type: String
    },
    uid: String,
    iid: {
        type: String,
        index: true
    },
    replyId: String,
    pid: String,
    content: String,
    createTime: {
        type: String,
        index: true
    }
})

module.exports = mongoose.model('comments', CommentsSchema, 'comments')