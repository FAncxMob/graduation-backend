let mongoose = require('./db.js')

let InvitationsWatchSchema = mongoose.Schema({
    invitationsId: {
        type: String,
        index: true
    },
    userId: {
        type: String,
        index: true
    },
    createTime: {
        type: String,
        index: true
    }
})



module.exports = mongoose.model('invitations_watch', InvitationsWatchSchema, 'invitations_watch')