let mongoose = require('./db.js')

let InvitationsLikeSchema = mongoose.Schema({
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
    }
})



module.exports = mongoose.model('invitations_like', InvitationsLikeSchema, 'invitations_like')