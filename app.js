let Koa = require('koa')
const multer = require('koa-multer');
let router = require('koa-router')()
var path = require("path")
const staticFiles = require('koa-static')
let app = new Koa()

let dbOperate = require('./util')

var UserModel = require('./model/user')
const config = require('./model/config')
var jwt = require('jsonwebtoken');
let Fly = require("flyio/src/node")
let fly = new Fly;
const fs = require('fs')
const PWD = 'fcx'
app.use(staticFiles(path.join(__dirname + '/uploads/')))

var storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    //修改文件名称
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split("."); //以点分割成数组，数组的最后一项就是后缀名
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
//加载配置
var upload = multer({
    storage: storage
});

// UserModel.createUser(10, (err, doc) => {
//     console.log(err, doc)
// })

// 上传图片
router.post('/uploadPic', upload.single('file'), async (ctx, next) => {
    console.log('/uploadPic')
    // console.log(ctx.req.file)

    ctx.body = {
        fileName: config.host + '/' + ctx.req.file.filename //返回文件名
    }
})
// 删除图片
router.get('/deletePic', async (ctx, next) => {
    let path = ctx.query.path
    let result = await dbOperate.deletePic(path)
    ctx.body = {
        ...result
    }
})


// 修改失物招领
router.get('/updateLostAndFound', async (ctx, next) => {
    console.log('/updateLostAndFound')
    let code = 0
    let data = ctx.query
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        await dbOperate.updateLostAndFound(openid, data)
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

// 修改兼职招聘
router.get('/updatePartTimeJob', async (ctx, next) => {
    console.log('/updatePartTimeJob')
    let code = 0
    let data = ctx.query
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        await dbOperate.updatePartTimeJob(openid, data)
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
// 修改二手交易
router.get('/updateSecondhand', async (ctx, next) => {
    console.log('/updateSecondhand')
    let code = 0
    let data = ctx.query
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        await dbOperate.updateSecondhand(openid, data)
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
// 修改跑腿
router.get('/updateLegWork', async (ctx, next) => {
    console.log('/updateLegWork')
    let code = 0
    let data = ctx.query
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        await dbOperate.updateLegWork(openid, data)
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
// 完成 status=>2 
router.get('/complete', async (ctx, next) => {
    console.log('/complete')
    let code = 0
    let {
        iid,
        classify
    } = ctx.query
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.completeByClass(openid, iid, classify)
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
// 删除 status=>6 
router.get('/delete', async (ctx, next) => {
    console.log('/delete')
    let code = 0
    let {
        iid,
        classify
    } = ctx.query
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.deleteByClass(openid, iid, classify)
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
// 上架 status=>  0 -> 3 
router.get('/putOn', async (ctx, next) => {
    console.log('/putOn')
    let code = 0
    let {
        iid,
        classify
    } = ctx.query
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.putOnByClass(openid, iid, classify)
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
// 下架 status=>  3 -> 0 
router.get('/drop', async (ctx, next) => {
    console.log('/drop')
    let code = 0
    let {
        iid,
        classify
    } = ctx.query
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.dropByClass(openid, iid, classify)
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
// 获取我发布的二手交易帖子，按类别分组
router.get('/getMyReleaseLegwork', async (ctx, next) => {
    console.log('/getMyReleaseLegwork')
    let code = 0
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.getMyReleaseLegwork(openid)
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


// 确认购买二手交易帖子
router.get('/submitBuy', async (ctx, next) => {
    console.log('/submitBuy')
    let code = 0
    let {
        buyerAddressId,
        iid
    } = ctx.query

    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.submitBuy(openid, buyerAddressId, iid)
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
// 确认承接跑腿帖子
router.get('/submitHelp', async (ctx, next) => {
    console.log('/submitHelp')
    let code = 0
    let {
        takerContact,
        iid
    } = ctx.query

    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.submitHelp(openid, takerContact, iid)
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
// 获取我要帮忙界面需要的数据
router.get('/getHelpData', async (ctx, next) => {
    console.log('/getHelpData')
    let code = 0
    let iid = ctx.query.iid

    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.getHelpData(openid, iid)
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
// 获取我要购买界面需要的数据
router.get('/getBuyData', async (ctx, next) => {
    console.log('/getBuyData')
    let code = 0
    let iid = ctx.query.iid

    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.getBuyData(openid, iid)
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
// 发布失物招领帖子
router.get('/publishLostAndFound', async (ctx, next) => {
    console.log('/publishLostAndFound')
    let code = 0
    let data = ctx.query

    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        await dbOperate.publishLostAndFound(openid, data)
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
// 发布兼职招聘帖子
router.get('/publishPartTimeJob', async (ctx, next) => {
    console.log('/publishPartTimeJob')
    let code = 0
    let data = ctx.query

    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        await dbOperate.publishPartTimeJob(openid, data)
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
// 发布二手交易帖子
router.get('/publishSecondhand', async (ctx, next) => {
    console.log('/publishSecondhand')
    let code = 0
    let data = ctx.query

    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        await dbOperate.publishSecondhand(openid, data)
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

// 发布跑腿帖子
router.get('/publishLegWork', async (ctx, next) => {
    console.log('/publishLegWork')
    let code = 0
    let data = ctx.query

    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        await dbOperate.publishLegWork(openid, data)
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


// 取消点赞某个帖子
router.get('/cancelLikePost', async (ctx, next) => {
    console.log('/cancelLikePost')
    let code = 0
    let {
        iid
    } = ctx.query

    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        await dbOperate.cancelLikePost(openid, iid)
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

// 点赞某个帖子
router.get('/likePost', async (ctx, next) => {
    console.log('/likePost')
    let code = 0
    let {
        iid,
        postOpenId
    } = ctx.query

    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        await dbOperate.likePost(openid, iid, postOpenId)
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



// 收藏某个帖子
router.get('/collectPost', async (ctx, next) => {
    console.log('/collectPost')
    let code = 0
    let {
        iid,
        postOpenId
    } = ctx.query

    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        await dbOperate.collectPost(openid, iid, postOpenId)
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

// 取消点赞某个评论
router.get('/cancelCommentLike', async (ctx, next) => {
    console.log('/cancelCommentLike')
    let code = 0
    let {
        commentId
    } = ctx.query

    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        await dbOperate.cancelCommentLike(openid, commentId)
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

// 点赞某个评论
router.get('/commentLike', async (ctx, next) => {
    console.log('/commentLike')
    let code = 0
    let {
        commentId,
        postOpenId
    } = ctx.query

    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        await dbOperate.commentLike(openid, commentId, postOpenId)
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

// 发布评论
router.get('/sendComment', async (ctx, next) => {
    console.log('/sendComment')
    let code = 0
    let {
        content,
        iid,
        replyCommentId,
        parentCommentId
    } = ctx.query

    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        await dbOperate.sendComment(openid, content, iid, replyCommentId, parentCommentId)
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

// 获取帖子详情用于修改 ,并且将该openid访问该iid插入到帖子—_watch这个关联表
router.get('/getPostDetailForUpdate', async (ctx, next) => {
    console.log('/getPostDetailForUpdate')
    let code = 0
    let {
        iid
    } = ctx.query

    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.getPostDetailForUpdateAndAddWatchPost(openid, iid)

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
// 获取主页帖子详情,并且将该openid访问该iid插入到帖子—_watch这个关联表
router.get('/getPostDetail', async (ctx, next) => {
    console.log('/getPostDetail')
    let code = 0
    let {
        iid
    } = ctx.query


    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.getPostDetailAndAddWatchPost(openid, iid)

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
// 我购买的二手交易的搜索
router.get('/searchMyBuyer', async (ctx, next) => {
    console.log('/searchMyBuyer')
    let code = 0
    let {
        searchStr,
        statusArr
    } = ctx.query
    let _statusArr = JSON.parse(statusArr)
    console.log(_statusArr)
    let classifyStr = ''
    if (_statusArr[0] === 1) {
        classifyStr = 'secondHandStatusIs1'
    } else if (_statusArr[0] === 2) {
        classifyStr = 'secondHandStatusIs2'
    }

    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.searchMyTakerByClassAndStatus(openid, 1, searchStr, statusArr)
        ctx.body = {
            code: 1,
            data,
            classifyStr
        }

    } catch {
        ctx.body = {
            code: 0,
            message: 'token验证失败辽'
        }
    }
})
// 我承接的搜索
router.get('/searchMyTaker', async (ctx, next) => {
    console.log('/searchMyTaker')
    let code = 0
    let {
        searchStr,
        statusArr
    } = ctx.query
    let _statusArr = JSON.parse(statusArr)
    let classifyStr = ''
    if (_statusArr[0] === 1) {
        classifyStr = 'legWorkStatusIs1'
    } else if (_statusArr[0] === 2) {
        classifyStr = 'legWorkStatusIs2'
    }

    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.searchMyTakerByClassAndStatus(openid, 0, searchStr, statusArr)
        ctx.body = {
            code: 1,
            data,
            classifyStr
        }

    } catch {
        ctx.body = {
            code: 0,
            message: 'token验证失败辽'
        }
    }
})
// 我下架的搜索
router.get('/searchMyDrop', async (ctx, next) => {
    console.log('/searchMyDrop')
    let code = 0
    let {
        searchStr,
        classify,
    } = ctx.query
    let str = ''
    switch (classify) {
        case '0':
            str = 'legWork'
            break;
        case '1':
            str = 'secondHand'
            break;
        case '2':
            str = 'partTimeJob'
            break;
        case '3':
            str = 'lost'
            break;
        case '5':
            str = 'found'
            break;
        default:
            break;
    }




    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.searchMyDrop(searchStr, classify)
        ctx.body = {
            code: 1,
            data,
            classifyStr: str
        }

    } catch {
        ctx.body = {
            code: 0,
            message: 'token验证失败辽'
        }
    }
})
// 主页搜索
router.get('/searchInIndexPage', async (ctx, next) => {
    console.log('/searchInIndexPage')
    let code = 0
    let {
        searchStr,
        classify,
        statusArr
    } = ctx.query
    let str = ''
    switch (classify) {
        case '0':
            str = 'legWork'
            break;
        case '1':
            str = 'secondHand'
            break;
        case '2':
            str = 'partTimeJob'
            break;
        case '3':
            str = 'lost'
            break;
        case '5':
            str = 'found'
            break;
        default:
            break;
    }




    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.searchInIndexPage(searchStr, classify, statusArr)
        ctx.body = {
            code: 1,
            data,
            classifyStr: str
        }

    } catch {
        ctx.body = {
            code: 0,
            message: 'token验证失败辽'
        }
    }
})
// 校园热点搜索
router.get('/searchSchoolNews', async (ctx, next) => {
    console.log('/searchSchoolNews')
    let code = 0
    let {
        searchStr,
        classify
    } = ctx.query
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.searchSchoolNews(searchStr, classify)

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
// 我的历史搜索
router.get('/searchMyHistory', async (ctx, next) => {
    console.log('/searchMyHistory')
    let code = 0
    let {
        searchStr,
    } = ctx.query
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.searchMyHistory(openid, searchStr)

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
// 我的收藏搜索
router.get('/searchMyCollect', async (ctx, next) => {
    console.log('/searchMyCollect')
    let code = 0
    let {
        searchStr
    } = ctx.query
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.searchMyCollect(openid, searchStr)

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
// 回复我的搜索
router.get('/searchMyComment', async (ctx, next) => {
    console.log('/searchMyComment')
    let code = 0
    let {
        searchStr
    } = ctx.query
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.searchMyComment(openid, searchStr)


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


// 获取全部的帖子，按类别分组
router.get('/getAllPost', async (ctx, next) => {
    console.log('/getAllPost')
    let code = 0
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.getAllPost()
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
// 获取校园热点新闻
router.get('/getSchoolNews', async (ctx, next) => {
    console.log('/getSchoolNews')
    let code = 0
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.getSchoolNews()
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
// 获取历史记录
router.get('/getHistory', async (ctx, next) => {
    console.log('/getHistory')
    let code = 0
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.getHistory(openid)
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
// 修改地址
router.get('/editAddress', async (ctx, next) => {
    console.log('/editAddress')
    let code = 0
    let data = ctx.query
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        await dbOperate.editAddress(openid, data)
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
// 获取地址的详细信息
router.get('/getAddressByAddressId', async (ctx, next) => {
    console.log('/getAddressByAddressId')
    let code = 0
    let addressId = ctx.query.addressId
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.getAddressByAddressId(openid, addressId)
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
// 添加地址
router.get('/addAddress', async (ctx, next) => {
    console.log('/addAddress')
    let code = 0
    let data = ctx.query
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        await dbOperate.addAddress(openid, data)
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
// 获取我下架的全部帖子，按类别分组
router.get('/getDrop', async (ctx, next) => {
    console.log('/getDrop')
    let code = 0
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.getDrop(openid)
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
// 获取我购买的的二手交易帖子
router.get('/getMyBuyer', async (ctx, next) => {
    console.log('/getMyBuyer')
    let code = 0
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.getMyBuyer(openid)
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
// 获取我承接的校园拍腿部帖子
router.get('/getMyTaker', async (ctx, next) => {
    console.log('/getMyTaker')
    let code = 0
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.getMyTaker(openid)
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
// 获取我发布的全部帖子，按类别分组
router.get('/getAllPublish', async (ctx, next) => {
    console.log('/getAllPublish')
    let code = 0
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        let data = await dbOperate.getAllPublish(openid)
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
    let iid = ctx.query.iid
    let token = ctx.request.header.authorization
    try {
        let {
            openid
        } = jwt.verify(token, PWD)
        await dbOperate.cancelCollectPost(openid, iid)
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
    let userInfo = JSON.parse(result.data)
    // 判断是新用户还是老用户
    let _haveUser = await dbOperate.haveUser(userInfo.openid)
    console.log(userInfo)

    // 自定义登录状态，就是根据用户的openId和sessionKey进行加密生成token，返回给前端
    // d对openId和sessionKey进行加密,自定义登录状态
    let token = jwt.sign(userInfo, PWD)

    // 3. 响应数据
    ctx.body = {
        token,
        haveUser: _haveUser,
        openId: userInfo.openid
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