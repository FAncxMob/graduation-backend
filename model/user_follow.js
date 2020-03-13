let mongoose = require('./db.js')

let UserFollowSchema = mongoose.Schema({
    userId: {
        type: Number,
        index: true
    },
    followId: {
        type: Number,
        index: true
    },
    createTime: {
        type: Number,
        index: true
    }
})



module.exports = mongoose.model('user_follow', UserFollowSchema, 'user_follow')