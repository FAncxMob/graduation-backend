let mongoose = require('./db.js')

let LegworkContentSchema = mongoose.Schema({
    iid: {
        type: Number,
        index: true
    },
    uid: {
        type: Number,
        index: true
    },
    title: String,
    tag: String,
    desc: String,
    pic: String,
    price: {
        type: Number,
        default: 99999
    },
    expectedTime: String,
    addressId: {
        type: Number,
        index: true
    },
    takerId: {
        type: Number,
        index: true,
        default: 0
    },
    status: {
        type: Number,
        default: 0,
        enum: [0, 1, 2, 3, 4], // 1：已接单，2：待核销，3：完成，4：中止
        index: true
    },
    verify: {
        type: String,
        default: '',
        index: true
    },
    createTime: {
        type: Number,
        index: true
    }

})

module.exports = mongoose.model('legwork_content', LegworkContentSchema, 'legwork_content')