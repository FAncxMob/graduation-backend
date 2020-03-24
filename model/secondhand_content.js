let mongoose = require('./db.js')

// 如果选择了 仅支持送货上门。存的deliveryAddressId 就是  固定的5e73a4fc3793ae3a44a97e52，和评论的是一样的

let SecondhandContentSchema = mongoose.Schema({
    iid: {
        type: mongoose.Schema.Types.ObjectId,
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
    deliveryAddressId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        default: mongoose.Types.ObjectId('5e73a4fc3793ae3a44a97e52')
    },
    buyerAddressId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        default: mongoose.Types.ObjectId('5e73a4fc3793ae3a44a97e52')
    },
    takerId: {
        type: String,
        index: true,
        default: 0
    },
    status: {
        type: Number,
        default: 0,
        enum: [0, 1, 2, 3, 4, 5, 6, 7],
        // 1：已被承接，2：已被购买，3：完成，4：中止，5：已结束 6：已找回 7：物归原主
        index: true
    },
    verify: {
        type: String,
        default: '',
        index: true
    }
})

module.exports = mongoose.model('secondhand_content', SecondhandContentSchema, 'secondhand_content')