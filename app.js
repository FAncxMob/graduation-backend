let Koa = require('koa')
let router = require('koa-router')()
let app = new Koa()

let dbOperate = require('./util')

var UserModel = require('./model/user')

var jwt = require('jsonwebtoken');
let Fly = require("flyio/src/node")
let fly = new Fly;

const PWD = 'fcx'

// UserModel.createUser(10, (err, doc) => {
//     console.log(err, doc)
// })

// 获取地址
router.get('/getAddress', async (ctx, next) => {
    console.log('/getAddress')
    let code = 0
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.getAddress(openid)
        ctx.body = {
            code: 1,
            data
        }

    } catch {
        ctx.body = {
            code: 0,
            message: 'token验证失败辽'
        }
    }
})
// 获取全部帖子，按类别分组
router.get('/getAllOrder', async (ctx, next) => {
    console.log('/getAllOrder')
    let code = 0
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.getAllOrder(openid)
        ctx.body = {
            code: 1,
            data
        }

    } catch {
        ctx.body = {
            code: 0,
            message: 'token验证失败辽'
        }
    }
})
// 取消我收藏的某个帖子
router.get('/cancelCollectPost', async (ctx, next) => {
    console.log('/cancelCollectPost')
    let code = 0
    let cancelInvitationsId = ctx.query.cancelInvitationsId
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.cancelCollectPost(openid, cancelInvitationsId)
        ctx.body = {
            code: 1
        }

    } catch {
        ctx.body = {
            code: 0,
            message: 'token验证失败辽'
        }
    }
})

// 获取我收藏的帖子
router.get('/getMyCollect', async (ctx, next) => {
    console.log('/getMyCollect')
    let code = 0
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.getMyCollect(openid)
        ctx.body = {
            code: 1,
            data
        }

    } catch {
        ctx.body = {
            code: 0,
            message: 'token验证失败辽'
        }
    }
})
// 获取回复我的评论
router.get('/getMyCommentReply', async (ctx, next) => {
    console.log('/getMyCommentReply')
    let code = 0

    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.getMyCommentReply(openid)
        ctx.body = {
            code: 1,
            data
        }

    } catch {
        ctx.body = {
            code: 0,
            message: 'token验证失败辽'
        }
    }
})
// 获取点赞数据
router.get('/getLikeByOpenId', async (ctx, next) => {
    console.log('/getLikeByOpenId')
    let code = 0

    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.getLikeByOpenId(openid)
        ctx.body = {
            code: 1,
            data
        }

    } catch {
        ctx.body = {
            code: 0,
            message: 'token验证失败辽'
        }
    }
})

// 关注某人
router.get('/followingTa', async (ctx, next) => {
    console.log('/followingTa')
    let code = 0
    let {
        followId
    } = ctx.query

    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        await dbOperate.followingTa(openid, followId)
        ctx.body = {
            code: 1
        }

    } catch {
        ctx.body = {
            code: 0,
            message: 'token验证失败辽'
        }
    }
})

// 取消关注
router.get('/cancelFollowing', async (ctx, next) => {
    console.log('/cancelFollowing')
    let code = 0
    let {
        cancelOpenId
    } = ctx.query

    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        await dbOperate.cancelFollowing(openid, cancelOpenId)
        ctx.body = {
            code: 1
        }

    } catch {
        ctx.body = {
            code: 0,
            message: 'token验证失败辽'
        }
    }
})

// 获取关注粉丝数据
router.get('/getFollowingAndFollowerByOpenId', async (ctx, next) => {
    console.log('/getFollowingAndFollowerByOpenId')
    let code = 0
    // 获取token和userInfo的值
    let token = ctx.request.header.authorization
    try {
        let result = jwt.verify(token, PWD)

        let data = await dbOperate.getFollowsAndFansByOpenId(result.openid)
        ctx.body = {
            code: 1,
            data
        }

    } catch {
        ctx.body = {
            code: 0,
            message: 'token验证失败辽'
        }
    }
})

// 老用户更新userInfo
router.get('/updateUserInfo', async (ctx, next) => {
    console.log('/updateUserInfo')
    let code = 0
    // 获取token和userInfo的值
    let token = ctx.request.header.authorization
    let data = ctx.query
    try {
        let result = jwt.verify(token, PWD)

        let updateResult = await dbOperate.updateUserInfo(result.openid, data)
        if (updateResult) {
            code = 1
            console.log('/updateUserInfo  更新成功了')
        }
        ctx.body = {
            code
        }

    } catch {
        console.log('/updateUserInfo  更新失败了！')
        ctx.body = {
            code: 0,
            message: 'token验证失败辽'
        }
    }
})

// 获取老用户的用户信息
router.get('/getUserInfo', async (ctx, next) => {
    console.log('/getUserInfo')
    let code = 0
    // 获取token和userInfo的值
    let token = ctx.request.header.authorization

    try {
        let result = jwt.verify(token, PWD)
        let userInfo = await dbOperate.getUserInfo(result.openid)
        ctx.body = {
            code: 1,
            userInfo
        }

    } catch {
        ctx.body = {
            code: 0,
            message: 'token验证失败辽'
        }
    }
})

// 登陆的接口(保存OpenId和用户信息)
// code ：用于表示认证（登陆）是否成功，1：成功，0：失败
// message：具体的登陆失败信息
router.get('/login', async (ctx, next) => {
    console.log('/login')
    // 获取token和userInfo的值
    let data = ctx.query
    let token = ctx.request.header.authorization
    let code = 0 // 用于表示认证是否成功，1：成功，0：失败

    try {
        let result = jwt.verify(token, PWD)

        let isOurSchoolResult = await dbOperate.isOurSchool(data)
        if (isOurSchoolResult) {
            // 是我校人员才将openId写入数据库
            await dbOperate.saveUserInfo(result.openid, data)
            code = 1
        }
        ctx.body = {
            code
        }

    } catch {
        ctx.body = {
            code: 0,
            message: 'token验证失败辽'
        }
    }
})

//  登陆的接口(保存OpenId和用户信息)
router.get('/saveOpenId', async (ctx, next) => {
    console.log('/saveOpenId')
    // 获取token和userInfo的值
    let userInfo = ctx.query.userInfo
    let token = ctx.request.header.authorization

    try {
        let result = jwt.verify(token, PWD)
        let saveResult = await dbOperate.saveOrUpdateUserInfo(result.openid, userInfo)

        ctx.body = saveResult
    } catch {
        ctx.body = 'token验证失败'
    }
})

// 测试验证身份token的接口
router.get('/testToken', (ctx, next) => {
    console.log('/testToken')
    // 获取token 的值
    let token = ctx.request.header.authorization
    try {
        let result = jwt.verify(token, PWD)
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
    // 判断是新用户还是老用户
    let _haveUser = await dbOperate.haveUser(userInfo.openid)

    // 自定义登录状态，就是根据用户的openId和sessionKey进行加密生成token，返回给前端
    // d对openId和sessionKey进行加密,自定义登录状态
    let token = jwt.sign(userInfo, PWD)

    // 3. 响应数据
    ctx.body = {
        token,
        haveUser: _haveUser
    }
})

/**
 * 根据userId和class获取当前用户发布的某类帖子
 */
router.get('/getInvitationsByUserIdAndClass', async (ctx, next) => {
    console.log('/getInvitationsByUserIdAndClass')
    // 1. 获取请求的参数,注意拿来的是字符串，数据库里的是number！！！！
    let req = ctx.request.query
    let userId = +req.userId
    let classify = +req.class

    // 2. 查询数据库获取数据
    let result = await dbOperate.getInvitationsByUserIdAndClass(userId, classify)

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
    console.log('/getInvitationsByUserId')
    // 1. 获取请求的参数,注意拿来的是字符串，数据库里的是number！！！！
    let req = ctx.request.query
    let userId = +req.userId

    // 2. 查询数据库获取数据
    let legwork = await dbOperate.getInvitationsByUserIdAndClass(userId, 0)
    let secondhand = await dbOperate.getInvitationsByUserIdAndClass(userId, 1)
    let partTimeJob = await dbOperate.getInvitationsByUserIdAndClass(userId, 2)
    let lostAndFound = await dbOperate.getInvitationsByUserIdAndClass(userId, 3)

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