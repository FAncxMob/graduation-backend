let mongoose = require('./db.js')

let SchoolNewsContentSchema = mongoose.Schema({
    iid: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    postDept: {
        type: String
    },
    // file: mongoose.Schema.Types.Buffer,
    status: {
        type: Number,
        default: 0,
        enum: [0, 3, 6],
        // 1：已被承接，2：完成(结束)， 3 下架，4 待中止 5.已中止
        index: true
    },

})

module.exports = mongoose.model('schoolNews_content', SchoolNewsContentSchema, 'schoolNews_content')