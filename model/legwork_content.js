let mongoose = require('./db.js')

let LegworkContentSchema = mongoose.Schema({
    iid: {
        type: String,
        index: true
    },
    openId: {
        type: String,
        index: true
    },
    tag: String,
    price: {
        type: Number,
        default: 99999
    },
    expectedTime: Number,
    addressId: {
        type: String,
        index: true
    },
    takerId: {
        type: String,
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
    }

})

module.exports = mongoose.model('legwork_content', LegworkContentSchema, 'legwork_content')