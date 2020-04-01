let mongoose = require('./db.js')

let StudentSchema = mongoose.Schema({
    sno: {
        type: String,
        index: true
    },
    school: {
        type: String,
    },
    faculty: {
        type: String,
    },
    major: {
        type: String,
    },
    name: {
        type: String,
    },
    idCard: {
        type: String,
    },
    status: {
        type: Number,
        enum: [0, 1], // 0：不是在校生 1： 是在校生
        default: 1,
    }
})

module.exports = mongoose.model('student', StudentSchema, 'student')