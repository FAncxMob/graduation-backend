var UserModel = require('./model/user')
var UserFollowModel = require('./model/user_follow')

var InvitationsModel = require('./model/invitations')
var LegworkContentModel = require('./model/legwork_content')
var SecondhandContentModel = require('./model/secondhand_content')
var LostAndFoundContentModel = require('./model/lostAndFound_content')
var PartTimeJobContentModel = require('./model/partTimeJob_content')

var InvitationsLikeModel = require('./model/invitations_like')
var InvitationsWatchModel = require('./model/invitations_watch')
var InvitationsCollectModel = require('./model/invitations_collect')

var CommentsModel = require('./model/comments')
var CommentsLikeModel = require('./model/comments_like')

var AddressModel = require('./model/address')

const CLASS_TO_NAME = ['legwork_content', 'secondhand_content', 'partTimeJob_content', 'lostAndFound_content']

// 根据userId和类别 查所有的帖子(点赞，收藏，浏览数)
let getInvitationsByUserIdAndClass = async function (userId, classify) {
    let doc = await InvitationsModel.aggregate([{
            $lookup: {
                from: CLASS_TO_NAME[classify],
                localField: 'invitationsId',
                foreignField: 'iid',
                as: "detail"
            },
        },
        {
            $lookup: {
                from: 'invitations_like',
                localField: 'invitationsId',
                foreignField: 'invitationsId',
                as: 'like'
            },
        },
        {
            $lookup: {
                from: 'invitations_watch',
                localField: 'invitationsId',
                foreignField: 'invitationsId',
                as: 'watch'
            },
        },
        {
            $lookup: {
                from: 'invitations_collect',
                localField: 'invitationsId',
                foreignField: 'invitationsId',
                as: 'collect'
            },
        },
        {
            $project: {
                "_id": 0,
                "detail.iid": 0,
                "detail._id": 0,
                "detail.uid": 0,
            }
        },
        {
            $sort: {
                "detail.createTime": -1
            }
        },
        {
            $match: {
                "uid": userId,
                "classify": classify
            }
        }
    ])
    doc.forEach((val, index) => {
        val.like = val.like.length
        val.collect = val.collect.length
        val.watch = val.watch.length
        val.detail = val.detail[0]
    })
    return doc

}

// 根据userId查所有的帖子
//TODO:无法获取点赞，收藏，浏览数
let getInvitationsByUserId = function (userId) {
    UserModel.aggregate([{
            $lookup: {
                from: CLASS_TO_NAME[0],
                localField: 'userId',
                foreignField: 'uid',
                as: 'legwork'
            },
        },
        {
            $lookup: {
                from: CLASS_TO_NAME[1],
                localField: 'userId',
                foreignField: 'uid',
                as: 'secondhand'
            },
        },
        {
            $lookup: {
                from: CLASS_TO_NAME[2],
                localField: 'userId',
                foreignField: 'uid',
                as: 'partTimeJob'
            },
        },
        {
            $lookup: {
                from: CLASS_TO_NAME[3],
                localField: 'userId',
                foreignField: 'uid',
                as: 'lostAndFound'
            },
        },
        {
            $project: {
                "_id": 0,
                "status": 0,
                "school": 0,
                "faculty": 0,
                "major": 0,
                "sno": 0,
                "legwork.uid": 0,
                "legwork._id": 0,
                "secondhand._id": 0,
                "partTimeJob._id": 0,
                "lostAndFound._id": 0,
                "secondhand.uid": 0,
                "partTimeJob.uid": 0,
                "lostAndFound.uid": 0,

            }
        },
        // {
        //     $sort: {
        //         "createTime": -1
        //     }
        // },
        {
            $match: {
                "userId": userId
            }
        }

    ], (err, doc) => {
        if (err) {
            console.log(err)
            return
        }
        console.log(JSON.stringify(doc), '用户所有的帖子')

    })


}

// 根据帖子类别查询该类别的所有帖子(点赞，收藏，浏览数)
let getInvitationsByClass = function (classify) {
    InvitationsModel.aggregate([{
            $lookup: {
                from: CLASS_TO_NAME[classify],
                localField: 'invitationsId',
                foreignField: 'iid',
                as: 'details'
            },
        },
        {
            $lookup: {
                from: 'user',
                localField: 'uid',
                foreignField: 'userId',
                as: 'userData'
            },
        },
        {
            $lookup: {
                from: 'invitations_like',
                localField: 'invitationsId',
                foreignField: 'invitationsId',
                as: 'like'
            },
        },
        {
            $lookup: {
                from: 'invitations_watch',
                localField: 'invitationsId',
                foreignField: 'invitationsId',
                as: 'watch'
            },
        },
        {
            $lookup: {
                from: 'invitations_collect',
                localField: 'invitationsId',
                foreignField: 'invitationsId',
                as: 'collect'
            },
        },
        {
            $project: {
                "_id": 0,
                "classify": 1,
                "invitationsId": 1,
                "details": 1,
                "like": 1,
                "watch": 1,
                "collect": 1,
                "userData.userId": 1,
                "userData.nickname": 1,
                "userData.avatar": 1,
                "userData.desc": 1
            }
        },
        {
            $sort: {
                "details.createTime": -1
            }
        },
        {
            $match: {
                "classify": classify
            }
        }

    ], (err, doc) => {
        if (err) {
            console.log(err)
            return
        }
        doc.forEach((val, index) => {
            val.like = val.like.length
            val.collect = val.collect.length
            val.watch = val.watch.length
        })
        console.log(JSON.stringify(doc), '帖子结果')

    })


}

// 根据帖子ID查询评论（点赞个数和楼中楼）
let getCommentsByIID = function (iid) {

    CommentsModel.aggregate([{
            $lookup: {
                from: 'comments_like',
                localField: 'commentId',
                foreignField: 'commentId',
                as: 'likes'
            },
        },
        {
            $lookup: {
                from: 'user',
                localField: 'uid',
                foreignField: 'userId',
                as: 'userData'
            },
        },
        {
            $project: {
                "likes": 1,
                "iid": 1,
                "_id": 0,
                "replyId": 1,
                "pid": 1,
                "commentId": 1,
                "content": 1,
                "createTime": 1,
                "userData.userId": 1,
                "userData.nickname": 1,
                "userData.avatar": 1,
                "userData.desc": 1
            }
        },
        {
            $match: {
                "iid": iid
            }
        },
        {
            $sort: {
                "createTime": -1
            }
        }

    ], (err, doc) => {
        if (err) {
            console.log(err)
            return
        }
        // console.log(JSON.stringify(doc),'doc')
        let data = [] // 最后的数据
        doc.forEach((val, index) => {
            // 添加点赞的个数到每条评论中
            let likeNum = val.likes.length
            delete val.likes
            val.likesNum = likeNum

            if (val.replyId === 0 && val.pid === 0) { // 直接对文章发表评论
                data.push({
                    ...val,
                    reply: []
                })
                doc.splice(index, 1)
            }
        })
        doc.forEach((val, index) => { // 对评论的评论
            data.forEach(v => {
                if (v.commentId === val.pid) {
                    v.reply.push(val)
                    return
                }
            })
        })
        console.log(JSON.stringify(data), 'Comments')
    })


}

// 根据userId查询 关注（关注与粉丝）的数据
let getFollowsAndFansByUserId = function (userId) {
    UserModel.aggregate([{
            $lookup: {
                from: 'user_follow',
                localField: 'userId',
                foreignField: 'userId',
                as: 'follows'
            }
        },
        {
            $lookup: {
                from: 'user_follow',
                localField: 'userId',
                foreignField: 'followId',
                as: 'fans'
            }
        },
        {
            $match: {
                "userId": userId
            }
        },
        {
            $project: {
                "_id": 0,
                "fans": 1,
                "follows": 1,
                "userId": 1
            }
        },
    ], (err, doc) => {
        if (err) {
            console.log(err)
            return
        }
        // 获取聚合后的follows和fans
        let follows = doc[0].follows;
        let fans = doc[0].fans;
        follows = follows.map((follow) => {
            return follow.followId
        })
        fans = fans.map((fan) => {
            return fan.userId
        })

        UserModel.find({
            userId: {
                $in: follows
            }
        }, {
            _id: 0,
            userId: 1,
            nickname: 1,
            avatar: 1,
            desc: 1
        }, (err, follows) => {
            if (err) {
                console.log(err)
                return
            }
            doc[0].follows = follows
            UserModel.find({
                userId: {
                    $in: fans
                }
            }, {
                _id: 0,
                userId: 1,
                nickname: 1,
                avatar: 1,
                desc: 1
            }, (err, fans) => {
                if (err) {
                    console.log(err)
                    return
                }
                doc[0].fans = fans
                console.log(JSON.stringify(doc), 'FollowsAndFans')
            })
        })



        // console.log(follows_UserId,'follows_UserId')
        // console.log(fans_UserId, 'fans_UserId')

    })
}

function followAndFan(err, doc) {
    if (err) {
        console.log(err)
        return
    }
    let {
        userId,
        nickname,
        avatar
    } = doc[0]
    doc = {
        userId,
        nickname,
        avatar
    }
    console.log(doc, 'doc')
}


module.exports = {
    getCommentsByIID,
    getFollowsAndFansByUserId,
    getInvitationsByClass,
    getInvitationsByUserId,
    getInvitationsByUserIdAndClass
}