let mongoose = require('./db.js')

let LegworkContentSchema = mongoose.Schema({
    iid: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    openId: {
        type: String,
        index: true
    },
    tag: String,
    // price: {
    //     type: Number,
    //     default: 99999
    // },
    expectedTime: {
        type: String
    },
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    takerId: {
        type: String,
        index: true,
        default: ''
    },

    verify: {
        type: String,
        default: '',
        index: true
    },
    status: {
        type: Number,
        default: 0,
        enum: [0, 1, 2, 3, 4, 5, 6, 7],
        // 1：已被承接，2：已被购买，3：完成，4：中止，5：已结束 6：已找回 7：物归原主
        index: true
    },
    takerContact: {
        type: String,
        default: ''
    }

})

module.exports = mongoose.model('legwork_content', LegworkContentSchema, 'legwork_content')