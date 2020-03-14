let mongoose = require('./db.js')

let InvitationsSchema = mongoose.Schema({
    invitationsId: {
        type: String,
        index: true
    },
    uid: {
        type: String,
        index: true
    },
    classify: {
        type: Number,
        enum: [0, 1, 2, 3], // 枚举只能用在String类型上
        //  0：校内跑腿，1：二手交易，2：兼职招聘，3：失物招领。
        index: true
    }
    // ,


    // status: {
    //     type: String,
    //     default: 0,
    //     enum: [0, 1, 2, 3, 4], // 1：已接单，2：待核销，3：完成，4：中止
    //     index: true
    // },
    // title: {
    //     type: String,
    //     validate: function (title) {
    //         return title.length <= 40
    //     }
    // },
    // detail: Object,
    // verify: {
    //     type: String,
    //     index: true
    // },
    // takers: Number

})

module.exports = mongoose.model('invitations', InvitationsSchema, 'invitations')