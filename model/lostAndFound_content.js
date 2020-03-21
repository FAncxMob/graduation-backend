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
    contact: String

})

module.exports = mongoose.model('lostAndFound_content', LostAndFoundContentSchema, 'lostAndFound_content')