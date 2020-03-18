let mongoose = require('./db.js')

let SecondhandContentSchema = mongoose.Schema({
    iid: {
        type: String,
        index: true
    },
    openId: {
        type: String,
        index: true
    },
    tag: String,
    buyPrice: Number,
    // price: String,
    deliveryWay: {
        type: Number,
        enum: [0, 1, 2], // 0：都可以  1：自提，2：送货上门
        default: 0,
    },
    deliveryAddressId: String,
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

module.exports = mongoose.model('secondhand_content', SecondhandContentSchema, 'secondhand_content')