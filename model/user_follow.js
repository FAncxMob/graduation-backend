let mongoose = require('./db.js')

let UserFollowSchema = mongoose.Schema({
    openId: {
        type: String,
        index: true
    },
    followId: {
        type: String,
        index: true
    },
    createTime: {
        type: Number,
        index: true,
        default: Date.now()
    },
})



module.exports = mongoose.model('user_follow', UserFollowSchema, 'user_follow')