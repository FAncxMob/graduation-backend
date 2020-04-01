let mongoose = require('./db.js')

let LostAndFoundContentSchema = mongoose.Schema({
    iid: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    openId: {
        type: String,
        index: true
    },
    contact: String,
    status: {
        type: Number,
        default: 0,
        enum: [0, 2, 3, 6],
        // 1：已被承接，2：完成(结束)， 3 下架，4 待中止 5.已中止
        index: true
    },

})

module.exports = mongoose.model('lostAndFound_content', LostAndFoundContentSchema, 'lostAndFound_content')