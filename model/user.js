let mongoose = require('./db.js')

let UserSchema = mongoose.Schema({
    openId: {
        type: String,
        require: true,
        index: true,
    },
    tel: String,
    idCard: String,
    name: String,
    desc: {
        type: String,
        default: '写点什么来介绍一下自己吧~'
    },
    school: String,
    faculty: String,
    major: String,
    sno: String,
    status: {
        type: Number,
        default: 1
    },
    nickName: String,
    // gender: {
    //     type: Number,
    //     default: 1,
    //     enum: [1, 2], // 1：男，2：女
    // },
    avatar: String,
    createTime: {
        type: Number,
        index: true,
        default: Date.now()
    },

})

// 静态方法

// 创建User
UserSchema.statics.createUser = function (num, cb) {
    for (let index = 1; index <= num; index++) {
        let u = new this({
            openId: `${index}`,
            tel: `${index}`,
            idCard: `${index}`,
            name: `我是用户${index}的姓名啦`,
            desc: `我是用户${index}的个性签名~`,
            school: '湖北经济学院',
            faculty: '信息与通信工程',
            major: '软件工程',
            sno: `${index}`,
            nickName: `我是用户${index}的昵称啦`,
            avatar: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLWheJRmxCGTbHncmcqgWhOVsd6nPsTAK6cbpuCibMs5icibzSZBZH0KzNZk2DYIAvlBBpk0hibg98wmw/132'
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
UserSchema.statics.removeAllUser = function (cb) {
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