let mongoose = require('./db.js')

let LegworkContentSchema = mongoose.Schema({
    iid: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    openId: {
        type: String,
        index: true
    },
    tag: String,
    // price: {
    //     type: Number,
    //     default: 99999
    // },
    expectedTime: Number,
    addressId: {
        type: String,
        index: true
    },
    takerId: {
        type: String,
        index: true,
        default: 0
    },

    verify: {
        type: String,
        default: '',
        index: true
    }

})

module.exports = mongoose.model('legwork_content', LegworkContentSchema, 'legwork_content')