let mongoose = require('./db.js')

let InvitationsCollectSchema = mongoose.Schema({
    iid: {
        type: mongoose.Schema.Types.ObjectId,
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
        index: true,
        default: Date.now()
    },
})



module.exports = mongoose.model('invitations_collect', InvitationsCollectSchema, 'invitations_collect')