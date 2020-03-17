let mongoose = require('./db.js')

let PartTimeJobContentSchema = mongoose.Schema({
    iid: {
        type: String,
        index: true
    },
    openId: {
        type: String,
        index: true
    },
    price: String,
    workTime: String,
    workPlace: String,
    contact: String

})

module.exports = mongoose.model('partTimeJob_content', PartTimeJobContentSchema, 'partTimeJob_content')