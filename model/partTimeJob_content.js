let mongoose = require('./db.js')

let PartTimeJobContentSchema = mongoose.Schema({
    iid: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    openId: {
        type: String,
        index: true
    },
    // price: String,
    workTime: String,
    workPlace: String,
    contact: String,
    status: {
        type: Number,
        default: 0,
        enum: [0, 1, 2, 3, 4, 5, 6, 7],
        // 1：已被承接，2：已被购买，3：完成，4：中止，5：已结束 6：已找回 7：物归原主
        index: true
    },

})

module.exports = mongoose.model('partTimeJob_content', PartTimeJobContentSchema, 'partTimeJob_content')