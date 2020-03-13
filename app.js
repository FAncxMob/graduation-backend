let Koa = require('koa')
let router = require('koa-router')()
let app = new Koa()
let {
    getCommentsByIID,
    getFollowsAndFansByUserId,
    getInvitationsByClass,
    getInvitationsByUserId,
    getInvitationsByUserIdAndClass
} = require('./util')

var jwt = require('jsonwebtoken');
let Fly = require("flyio/src/node")
let fly = new Fly;

// 测试验证身份token的接口
router.get('/testToken', (ctx, next) => {
    // 获取token 的值
    let token = ctx.request.header.authorization
    try {
        let result = jwt.verify(token, 'fcx')
        ctx.body = '验证成功'
    } catch {
        ctx.body = '验证失败'
    }
})

// 获取用户openId的接口
router.get('/getOpenId', async (ctx, next) => {
    console.log('/getOpenId')
    // 1. 获取请求的参数,注意拿来的是字符串，数据库里的是number！！！！
    let code = ctx.query.code
    let appId = 'wx4d5f694ed6ddf688'
    let appSecret = 'dcebd2f38acbeb08013d783283272952'

    // 根据请求的地址和参数处理数据
    let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`
    // 发送请求给微信接口，获取openId
    let result = await fly.get(url)
    userInfo = JSON.parse(result.data)

    // 将用户的openId存入数据库

    // 自定义登录状态，就是根据用户的openId和sessionKey进行加密生成token，返回给前端
    // d对openId和sessionKey进行加密,自定义登录状态
    let token = jwt.sign(userInfo, 'fcx')

    // 3. 响应数据
    ctx.body = token
})

/**
 * 根据userId和class获取当前用户发布的某类帖子
 */
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

/**
 * 根据userId获取当前用户发布的全部帖子
 */
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