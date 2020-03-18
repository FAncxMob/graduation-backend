let mongoose = require('./db.js')

let InvitationsWatchSchema = mongoose.Schema({
    invitationsId: {
        type: String,
        index: true
    },
    openId: {
        type: String,
        index: true
    },
    createTime: {
        type: Number,
        index: true
    },
    postOpenId: {
        type: String,
        index: true
    }
})



module.exports = mongoose.model('invitations_watch', InvitationsWatchSchema, 'invitations_watch')