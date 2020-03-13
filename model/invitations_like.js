let mongoose = require('./db.js')

let InvitationsLikeSchema = mongoose.Schema({
    invitationsId: {
        type: Number,
        index: true
    },
    userId: {
        type: Number,
        index: true
    },
    createTime: {
        type: String,
        index: true
    }
})



module.exports = mongoose.model('invitations_like', InvitationsLikeSchema, 'invitations_like')