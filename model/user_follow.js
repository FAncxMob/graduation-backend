let mongoose = require('./db.js')

let UserFollowSchema = mongoose.Schema({
    userId: {
        type: String,
        index: true
    },
    followId: {
        type: String,
        index: true
    },
    createTime: {
        type: Number,
        index: true
    }
})



module.exports = mongoose.model('user_follow', UserFollowSchema, 'user_follow')