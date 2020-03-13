let mongoose = require('./db.js')

let UserSchema = mongoose.Schema({
    userId: {
        type: Number,
        index: true
    },
    openId: Number,
    nickname: String,
    avatar: String,
    desc: String,
    school: String,
    faculty: String,
    major: String,
    sno: Number,
    status: {
        type: Number,
        default: 1
    },
})

// 静态方法

// 创建User
UserSchema.statics.createUser = function (num, cb) {
    for (let index = 1; index <= num; index++) {
        let u = new this({
            userId: index,
            openId: index,
            nickname: `nameIs ${index}`,
            avatar: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLWheJRmxCGTbHncmcqgWhOVsd6nPsTAK6cbpuCibMs5icibzSZBZH0KzNZk2DYIAvlBBpk0hibg98wmw/132',
            school: '湖北经济学院',
            faculty: '信息与通信工程',
            major: '软件工程',
            sno: `1616${index}`
        })

        u.save(function (err, doc) {
            cb(err, doc)
            // if (err) {
            //     console.log('添加User出错啦！' + err)
            //     return
            // }
            // console.log(`${index}个添加成功`)
        })
    }
}

// 清空User
UserSchema.statics.removeAllUser = function (a, cb) {
    this.remove({
        "major": "软件工程"
    }, (err, doc) => {
        cb(err, doc)
        // if (err) {
        //     console.log('删除全部User出错啦！' + err)
        //     return
        // }
        //     console.log('成功删除全部User')
        // })
    })
}

UserSchema.statics.findByUserId = function (userId, cb) {

    // 通过this获取当前的model
    this.find({
        "userId": userId
    }, function (err, docs) {
        cb(err, docs)
    })
}

// 实例方法
UserSchema.methods.print = function () {
    console.log('我是一个实例方法', this)
}


module.exports = mongoose.model('user', UserSchema, 'user')