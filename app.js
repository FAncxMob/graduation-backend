var {
    getCommentsByIID,
    getFollowsAndFansByUserId,
    getInvitationsByClass,
    getInvitationsByUserId,
    getInvitationsByUserIdAndClass
} = require('./util')
// var InvitationsModel = require('./model/invitations')
const Koa = require('koa')
const router = require('koa-router')()
let app = new Koa()

// const CLASS_TO_NAME = ['legwork_content', 'secondhand_content', 'partTimeJob_content', 'lostAndFound_content']

router.get('/getInvitationsByUserIdAndClass', async (ctx, next) => {
    // 1. 获取请求的参数,注意拿来的是字符串，数据库里的是number！！！！
    let req = ctx.request.query
    let userId = +req.userId
    let classify = +req.class

    // 2. 查询数据库获取数据
    let result = await getInvitationsByUserIdAndClass(userId, classify)

    // 3. 响应数据
    ctx.body = {
        code: 0,
        result
    }
})

router.get('/getInvitationsByUserId', async (ctx, next) => {
    // 1. 获取请求的参数,注意拿来的是字符串，数据库里的是number！！！！
    let req = ctx.request.query
    let userId = +req.userId

    // 2. 查询数据库获取数据
    let legwork = await getInvitationsByUserIdAndClass(userId, 0)
    let secondhand = await getInvitationsByUserIdAndClass(userId, 1)
    let partTimeJob = await getInvitationsByUserIdAndClass(userId, 2)
    let lostAndFound = await getInvitationsByUserIdAndClass(userId, 3)

    let result = {
        userId,
        legwork,
        secondhand,
        partTimeJob,
        lostAndFound
    }
    // 3. 响应数据
    ctx.body = {
        code: 0,
        result
    }
})


app.use(router.routes())
    .use(router.allowedMethods())

app.listen(3000)

// getCommentsByIID(1)
// getFollowsAndFansByUserId(1)
// getInvitationsByClass(1)
// getInvitationsByUserId(1)
// getInvitationsByUserIdAndClass(1, 3)

// let u = new InvitationsWatchModel({
//     invitationsId: 8,
//     userId: 88,
//     createTime: 126563
// })

// u.save(function (err, doc) {
//     // cb(err, doc)
//     if (err) {
//         console.log('添加出错啦！' + err)
//         return
//     }
// })