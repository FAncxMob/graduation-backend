let mongoose = require('./db.js')

let LostAndFoundContentSchema = mongoose.Schema({
    iid: {
        type: String,
        index: true
    },
    openId: {
        type: String,
        index: true
    },
    tag: {
        type: Number,
        enum: [0, 1], // 0：丢东西  1：捡到东西
        default: 0,
    },
    contact: String

})

module.exports = mongoose.model('lostAndFound_content', LostAndFoundContentSchema, 'lostAndFound_content')