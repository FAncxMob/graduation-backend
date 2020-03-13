let mongoose = require('./db.js')

let SecondhandContentSchema = mongoose.Schema({
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
    buyPrice: Number,
    sellPrice: Number,
    deliveryWay: {
        type: Number,
        enum: [0, 1, 2], // 0：都可以  1：自提，2：送货上门
        default: 0,
    },
    deliveryAddressId: Number,
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

module.exports = mongoose.model('secondhand_content', SecondhandContentSchema, 'secondhand_content')