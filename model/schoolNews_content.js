let mongoose = require('./db.js')

let SchoolNewsContentSchema = mongoose.Schema({
    iid: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    postDept: {
        type: String
    },
    file: mongoose.Schema.Types.Buffer

})

module.exports = mongoose.model('schoolNews_content', SchoolNewsContentSchema, 'schoolNews_content')