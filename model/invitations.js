let mongoose = require('./db.js')

let InvitationsSchema = mongoose.Schema({
    openId: {
        type: String,
        index: true
    },
    classify: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5], // 枚举只能用在String类型上
        //  0：校内跑腿，1：二手交易，2：兼职招聘，3：失物招领。4:校园热点文章
        index: true
    },
    title: {
        type: String,
        validate: function (title) {
            return title.length <= 40
        }
    },
    desc: String,
    pic: {
        type: Array,
        default: []
    },
    createTime: {
        type: Number,
        index: true,
        default: Date.now()
    },
    price: {
        type: String,
        default: ''
    },
    status: {
        type: Number,
        default: 0,
        enum: [0, 1, 2, 3, 4, 5, 6],
        // 1：已被承接，2：完成(结束)， 3 下架(只有0可以下架)，4 待中止 5.已中止  6 删除(0,2可以删除，做的假删除)
        index: true
    },

    // ,


    // status: {
    //     type: String,
    //     default: 0,
    //     enum: [0, 1, 2, 3, 4], // 1：已接单，2：待核销，3：完成，4：中止
    //     index: true
    // },

    // detail: Object,
    // verify: {
    //     type: String,
    //     index: true
    // },
    // takers: Number

})

module.exports = mongoose.model('invitations', InvitationsSchema, 'invitations')