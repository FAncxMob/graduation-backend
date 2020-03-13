let mongoose = require('./db.js')

let LostAndFoundContentSchema = mongoose.Schema({
    iid: {
        type: Number,
        index: true
    },
    uid: {
        type: Number,
        index: true
    },
    tag: {
        type: Number,
        enum: [0, 1], // 0：丢东西  1：捡到东西
        default: 0,
    },
    title: String,
    desc: String,
    contact: String,
    createTime: {
        type: Number,
        index: true
    }
})

module.exports = mongoose.model('lostAndFound_content', LostAndFoundContentSchema, 'lostAndFound_content')