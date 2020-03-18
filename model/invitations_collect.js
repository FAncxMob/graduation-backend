let mongoose = require('./db.js')

let InvitationsCollectSchema = mongoose.Schema({
    invitationsId: {
        type: String,
        index: true
    },
    openId: {
        type: String,
        index: true
    },
    postOpenId: {
        type: String,
        index: true
    },
    createTime: {
        type: Number,
        index: true
    }
})



module.exports = mongoose.model('invitations_collect', InvitationsCollectSchema, 'invitations_collect')