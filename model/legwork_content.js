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
        type: Number,
        index: true,
        default: Date.now()
    },
    addressId: {
        type: String,
        index: true
    },
    takerId: {
        type: String,
        index: true,
        default: 0
    },

    verify: {
        type: String,
        default: '',
        index: true
    },
    status: {
        type: Number,
        default: 0,
        enum: [0, 1, 2, 3, 4], // 1：已接单，2：待核销，3：完成，4：中止
        index: true
    },

})

module.exports = mongoose.model('legwork_content', LegworkContentSchema, 'legwork_content')