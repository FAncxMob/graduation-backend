let mongoose = require('./db.js')

let CommentsSchema = mongoose.Schema({
    commentId: {
        type: Number
    },
    uid: Number,
    iid: {
        type: Number,
        index:true
    },
    replyId: Number,
    pid: Number,
    content: String,
    createTime: {
        type: String,
        index:true
    }
})

module.exports = mongoose.model('comments',CommentsSchema,'comments')
