let mongoose = require('./db.js')

let InvitationsCollectSchema = mongoose.Schema({
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



module.exports = mongoose.model('invitations_collect', InvitationsCollectSchema, 'invitations_collect')