const mongoose = require('mongoose')
const Config = require('./config')

mongoose.connect(Config.dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err) {
    if (err) {
        console.log('mongodb连接失败:' + err)
    } else {
        console.log('mongodb连接成功!')
    }

})

module.exports = mongoose