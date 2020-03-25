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
        enum: [0, 1, 2, 3, 4, 5],
        // 1：已被承接，2：完成(结束)， 3 下架，4 待中止 5.已中止
        index: true
    },
    takerContact: {
        type: String,
        default: ''
    }

})

module.exports = mongoose.model('legwork_content', LegworkContentSchema, 'legwork_content')