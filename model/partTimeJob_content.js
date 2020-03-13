let mongoose = require('./db.js')

let PartTimeJobContentSchema = mongoose.Schema({
    iid: {
        type: Number,
        index: true
    },
    uid: {
        type: Number,
        index: true
    },
    title: String,
    desc: String,
    pic: String,
    price: String,
    workTime: String,
    workPlace: String,
    contact: String,
    createTime: {
        type: Number,
        index: true
    }
})

module.exports = mongoose.model('partTimeJob_content', PartTimeJobContentSchema, 'partTimeJob_content')