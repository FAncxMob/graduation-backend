let mongoose = require('./db.js')

let AddressSchema = mongoose.Schema({
    addressId: {
        type: String,
        index: true
    },
    uid: {
        type: String,
        index: true // 索引
    },
    name: {
        type: String,
        trim: true // 预定义修饰符

    },
    tel: String,
    location: {
        type: String,
        trim: true,
        set(val) { // 自定义修饰符
            return '湖北经济学院 ' + val
        }
    },
    status: {
        type: Number,
        enum: [0, 1], // 0：不是默认 1： 是默认
        default: 0,
    }
})

module.exports = mongoose.model('address', AddressSchema, 'address')