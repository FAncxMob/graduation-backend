let mongoose = require('./db.js')

let InvitationsWatchSchema = mongoose.Schema({
    iid: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    openId: {
        type: String,
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



module.exports = mongoose.model('invitations_watch', InvitationsWatchSchema, 'invitations_watch')