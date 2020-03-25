var UserModel = require('./model/user')
var UserFollowModel = require('./model/user_follow')

const fs = require('fs')
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

var StudentModel = require('./model/student')
let mongoose = require('mongoose')

const CLASS_TO_NAME = ['legwork_content', 'secondhand_content', 'partTimeJob_content', 'lostAndFound_content']
let THE_NULL_ID_STRING = '5e73a4fc3793ae3a44a97e52'

const config = require('./model/config')

const THE_NULL_OBJECT_ID = mongoose.Types.ObjectId('5e73a4fc3793ae3a44a97e52')




let dbOperate = {
    // 更新userInfo
    async updateUserInfo(openId, data) {
        let result = await UserModel.updateOne({
            openId
        }, data)
        return result.n && result.ok ? true : false
    },

    // openId获取老用户的信息
    async getUserInfo(openId) {
        let doc = await UserModel.find({
            openId
        }, {
            "_id": 0,
            "openId": 0,
            "__v": 0,
            "idCard": 0
            // "sno": 0,
            // "name": 0
        })
        doc = doc[0]
        return doc
    },


    // 根据sno和身份证号判断是否是我校学生
    async isOurSchool(data) {
        let {
            sno,
            idCard,
            name
        } = data
        let doc = await StudentModel.find({
            sno,
            idCard,
            name
        })
        return doc.length === 1 ? true : false

    },
    // 保存openId
    async saveUserInfo(openId, data) {

        let n = new UserModel({
            openId: openId,
            ...data,
            createTime: Date.now()
        })
        await n.save()
    },

    // 判断openId是否已经存在 true: 存在。false：不存在
    async haveUser(openId) {
        let doc = await UserModel.find({
            "openId": openId
        })
        return doc.length
    },

    // 根据userId和类别 查所有的帖子(点赞，收藏，浏览数)
    // async getInvitationsByUserIdAndClass(userId, classify) {
    //     let doc = await InvitationsModel.aggregate([{
    //             $lookup: {
    //                 from: CLASS_TO_NAME[classify],
    //                 localField: '_id',
    //                 foreignField: 'iid',
    //                 as: "detail"
    //             },
    //         },
    //         {
    //             $lookup: {
    //                 from: 'invitations_like',
    //                 localField: '_id',
    //                 foreignField: 'iid',
    //                 as: 'like'
    //             },
    //         },
    //         {
    //             $lookup: {
    //                 from: 'invitations_watch',
    //                 localField: '_id',
    //                 foreignField: 'iid',
    //                 as: 'watch'
    //             },
    //         },
    //         {
    //             $lookup: {
    //                 from: 'invitations_collect',
    //                 localField: '_id',
    //                 foreignField: 'iid',
    //                 as: 'collect'
    //             },
    //         },
    //         {
    //             $project: {
    //                 "_id": 0,
    //                 "detail.iid": 0,
    //                 "detail._id": 0,
    //                 "detail.uid": 0,
    //             }
    //         },
    //         {
    //             $sort: {
    //                 "detail.createTime": -1
    //             }
    //         },
    //         {
    //             $match: {
    //                 "uid": userId,
    //                 "classify": classify
    //             }
    //         }
    //     ])
    //     doc.forEach((val, index) => {
    //         val.like = val.like.length
    //         val.collect = val.collect.length
    //         val.watch = val.watch.length
    //         val.detail = val.detail[0]
    //     })
    //     return doc

    // },

    // // 根据userId查所有的帖子
    // //TODO:无法获取点赞，收藏，浏览数
    // async getInvitationsByUserId(userId) {
    //     UserModel.aggregate([{
    //             $lookup: {
    //                 from: CLASS_TO_NAME[0],
    //                 localField: 'userId',
    //                 foreignField: 'uid',
    //                 as: 'legwork'
    //             },
    //         },
    //         {
    //             $lookup: {
    //                 from: CLASS_TO_NAME[1],
    //                 localField: 'userId',
    //                 foreignField: 'uid',
    //                 as: 'secondhand'
    //             },
    //         },
    //         {
    //             $lookup: {
    //                 from: CLASS_TO_NAME[2],
    //                 localField: 'userId',
    //                 foreignField: 'uid',
    //                 as: 'partTimeJob'
    //             },
    //         },
    //         {
    //             $lookup: {
    //                 from: CLASS_TO_NAME[3],
    //                 localField: 'userId',
    //                 foreignField: 'uid',
    //                 as: 'lostAndFound'
    //             },
    //         },
    //         {
    //             $project: {
    //                 "_id": 0,
    //                 "status": 0,
    //                 "school": 0,
    //                 "faculty": 0,
    //                 "major": 0,
    //                 "sno": 0,
    //                 "legwork.uid": 0,
    //                 "legwork._id": 0,
    //                 "secondhand._id": 0,
    //                 "partTimeJob._id": 0,
    //                 "lostAndFound._id": 0,
    //                 "secondhand.uid": 0,
    //                 "partTimeJob.uid": 0,
    //                 "lostAndFound.uid": 0,

    //             }
    //         },
    //         // {
    //         //     $sort: {
    //         //         "createTime": -1
    //         //     }
    //         // },
    //         {
    //             $match: {
    //                 "userId": userId
    //             }
    //         }

    //     ], (err, doc) => {
    //         if (err) {
    //             console.log(err)
    //             return
    //         }
    //         console.log(JSON.stringify(doc), '用户所有的帖子')

    //     })


    // },

    // 根据帖子ID查询评论（点赞个数和楼中楼）
    async getCommentsByIID(iid, openId) {
        iid = mongoose.Types.ObjectId(iid)
        let comments = await CommentsModel.aggregate([{
                $lookup: {
                    from: 'comments_like',
                    localField: '_id',
                    foreignField: 'commentId',
                    as: 'likes'
                },
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'openId',
                    foreignField: 'openId',
                    as: 'userDetail'
                },
            },
            {
                $project: {
                    "_id": 1,
                    "iid": 1,
                    "openId": 1,
                    "replyCommentId": 1,
                    "parentCommentId": 1,
                    "content": 1,
                    "createTime": 1,
                    "likes": 1,
                    "userDetail.openId": 1,
                    "userDetail.nickName": 1,
                    "userDetail.avatar": 1,
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

        ])
        // console.log(comments.length, 'length1')


        // 1. 先查询comments 找到——id = iid，的所有评论，得到c1
        // 2.遍历c1 获取所有的parentCommentId的数组  
        // 3. comments表关联comments表，
        // 先找到所有对帖子直接评论的帖子 即match:_id在parentCommentId里的
        // 然后 关联comments表 找到comments._id  = comments.parentCommentId 
        // 关联的结果是找到了每个直接对帖子进行评论的子评论。放在childComments里
        // 然后关联以下comments_like找到comments._id = comments_like.commentId的放在likes是点赞的个数
        // 最后关联 以下user 找到comments.openId = user.openId 
        // 问题:评论的子评论没法获得到like和用户信息。。。。。。

        let data = [] // 最后的数据
        comments = comments.map((val, index) => {
            // val.likes = val.likes.length
            val.likes.map((v, i) => {
                if (v.openId === openId) {
                    // 我赞过这条评论
                    val.iLikeThis = true
                }
            })
            val.likes = val.likes.length
            val.userDetail = val.userDetail[0]
            return val
        })
        comments.forEach((val, index) => {
            if (val.replyCommentId.toString() === THE_NULL_ID_STRING && val.parentCommentId.toString() === THE_NULL_ID_STRING) { // 直接对文章发表评论
                data.push({
                    ...val,
                    reply: []
                })
                comments.splice(index, 1)
            }
        })

        // console.log(comments.length, 'length2')
        comments.forEach((val, index) => { // 对评论的评论
            data.forEach(v => {
                // console.log(v._id.toString() === val.parentCommentId.toString())
                if (v._id.toString() === val.parentCommentId.toString()) {
                    v.reply.push(val)
                    // return
                }
            })
        })

        return data


    },

    // 根据openId查询 关注（关注与粉丝）的数据
    async getFollowsAndFansByOpenId(openId) {
        let doc = await UserModel.aggregate([{
                $lookup: {
                    from: 'user_follow',
                    localField: 'openId',
                    foreignField: 'openId',
                    as: 'following'
                }
            },
            {
                $lookup: {
                    from: 'user_follow',
                    localField: 'openId',
                    foreignField: 'followId',
                    as: 'follower'
                }
            },
            {
                $match: {
                    openId
                }
            },
            {
                $project: {
                    _id: 0,
                    following: 1,
                    follower: 1
                }
            }
        ])
        // 获取follows和fans  
        let following = doc[0].following;
        let follower = doc[0].follower;

        // 获取follows和fans的openId数组
        followingOpenIdArr = following.map((following) => {
            return following.followId
        })
        followerOpenIdArr = follower.map((follower) => {
            return follower.openId
        })

        // 根据openId数组获取对饮的用户信息
        let followingData = await this.GetFilterUserInfoBatch(followingOpenIdArr)
        let followerData = await this.GetFilterUserInfoBatch(followerOpenIdArr)

        // 给follower的对象中增加一个属性isFollowing来表示是否是互相关注
        followerData.forEach((obj, index) => {
            if (followingOpenIdArr.includes(obj.openId)) {
                // 因为直接为followerData添加新的属性值时不知道为什么不能添加，以只能赋值新的对象了....
                let newObj = {
                    openId: obj.openId,
                    desc: obj.desc,
                    nickName: obj.nickName,
                    avatar: obj.avatar,
                    isFollowing: 1
                }
                followerData[index] = newObj
            }
        })

        let data = {
            following: followingData,
            follower: followerData
        }
        return data
    },

    // 批量获取用户 头像，昵称，个签
    async GetFilterUserInfoBatch(openIdArr) {
        let result = await UserModel.find({
            openId: {
                $in: openIdArr
            }
        }, {
            _id: 0,
            openId: 1,
            nickName: 1,
            avatar: 1,
            desc: 1
        })
        return result
    },

    // 取消关注
    async cancelFollowing(openId, cancelOpenId) {
        let result = await UserFollowModel.remove({
            openId,
            followId: cancelOpenId
        })
    },

    // 添加关注
    async followingTa(openId, followId) {
        let n = new UserFollowModel({
            openId,
            followId: followId,
            createTime: Date.now()
        })
        let result = await n.save()
        // console.log(result)
    },

    // 点赞评论
    async commentLike(openId, commentId, postOpenId) {
        commentId = mongoose.Types.ObjectId(commentId)
        let n = new CommentsLikeModel({
            openId,
            commentId,
            postOpenId,
            createTime: Date.now()
        })
        await n.save()
    },
    // 取消点赞评论
    async cancelCommentLike(openId, commentId) {
        commentId = mongoose.Types.ObjectId(commentId)
        let result = await CommentsLikeModel.remove({
            openId,
            commentId
        })
        console.log(result)
    },

    // 点赞帖子
    async likePost(openId, iid, postOpenId) {
        iid = mongoose.Types.ObjectId(iid)
        let n = new InvitationsLikeModel({
            openId,
            iid,
            postOpenId,
            createTime: Date.now()
        })
        await n.save()
    },
    // 取消点赞帖子
    async cancelLikePost(openId, iid) {
        iid = mongoose.Types.ObjectId(iid)
        let result = await InvitationsLikeModel.remove({
            openId,
            iid
        })
        console.log(result)
    },

    // 收藏帖子
    async collectPost(openId, iid, postOpenId) {
        iid = mongoose.Types.ObjectId(iid)
        let n = new InvitationsCollectModel({
            openId,
            iid,
            postOpenId,
            createTime: Date.now()
        })
        await n.save()
    },
    // 取消收藏帖子
    async cancelCollectPost(openId, iid) {
        iid = mongoose.Types.ObjectId(iid)
        console.log(openId, iid)
        let result = await InvitationsCollectModel.deleteOne({
            openId,
            iid
        })
        console.log(result)
    },

    // 获取点赞数据（分我的帖子和我的回复）
    async getLikeByOpenId(openId) {
        // 获取回复点赞数据
        // 1. 查询comments 获取该openId所有的commentId。获得数组commentIdArr，
        // let commentIdDoc = await CommentsModel.find({
        //     openId
        // })
        // let commentIdArr = commentIdDoc.map((val, index) => {
        //     let id = mongoose.Types.ObjectId(val._id)
        //     return id
        // })

        // 2. comments_like的openId和user的openId做聚合查询,将user信息放到comments_like里
        // 筛选条件是commentId在commentIdArr里的
        let commentsData = await CommentsLikeModel.aggregate([{
                $lookup: {
                    from: 'user',
                    localField: 'openId',
                    foreignField: 'openId',
                    as: 'userDetail'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: 'commentId',
                    foreignField: '_id',
                    as: 'commentDetail'
                }
            },
            {
                $match: {
                    postOpenId: openId
                }
            },
            {
                $project: {
                    "_id": 1,
                    "commentId": 1,
                    "createTime": 1,
                    "userDetail.openId": 1,
                    "userDetail.avatar": 1,
                    "userDetail.nickName": 1,
                    "commentDetail.content": 1,
                    "commentDetail.iid": 1
                }
            },
            {
                $sort: {
                    "createTime": -1
                }
            }
        ])

        commentsData = commentsData.map((val, index) => {
            val.userDetail = val.userDetail[0]
            val.content = val.commentDetail[0].content

            return val
        })


        // 获取帖子点赞数据，步骤同评论
        // let invitationIdDoc = await InvitationsModel.find({
        //     openId
        // })
        // let invitationIdArr = invitationIdDoc.map((val, index) => {
        //     let id = mongoose.Types.ObjectId(val._id)
        //     return id
        // })

        let invitationData = await InvitationsLikeModel.aggregate([{
                $lookup: {
                    from: 'user',
                    localField: 'openId',
                    foreignField: 'openId',
                    as: 'userDetail'
                }
            }, {
                $lookup: {
                    from: 'invitations',
                    localField: 'iid',
                    foreignField: '_id',
                    as: 'invitationDetail'
                }
            },
            {
                $match: {
                    postOpenId: openId
                }
            },
            {
                $project: {
                    "_id": 1,
                    "iid": 1,
                    "createTime": 1,
                    "userDetail.openId": 1,
                    "userDetail.avatar": 1,
                    "userDetail.nickName": 1,
                    "invitationDetail.title": 1,
                    "invitationDetail.desc": 1,
                    "invitationDetail.pic": 1,
                    "invitationDetail.classify": 1,
                    "invitationDetail._id": 1
                }
            },
            {
                $sort: {
                    "createTime": -1
                }
            }
        ])

        invitationData = invitationData.map((val, index) => {
            val.userDetail = val.userDetail[0]
            val.invitationDetail = val.invitationDetail[0]
            return val
        })

        let data = {
            comment: commentsData,
            post: invitationData
        }
        return data
    },
    // 获取回复我的数据
    async getMyCommentReply(openId) {
        let myCommentArr = await CommentsModel.find({
            openId
        }, {
            _id: 1
        })

        myCommentArr = myCommentArr.map((val, index) => {
            let id = mongoose.Types.ObjectId(val._id)
            return id
        })


        let data = await CommentsModel.aggregate([{
                $lookup: {
                    from: 'user',
                    localField: 'openId',
                    foreignField: 'openId',
                    as: 'userDetail'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: 'replyCommentId',
                    foreignField: '_id',
                    as: 'myCommentDetail'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: 'parentCommentId',
                    foreignField: '_id',
                    as: 'fatherCommentDetail'
                }
            },
            {
                $lookup: {
                    from: 'invitations',
                    localField: 'iid',
                    foreignField: '_id',
                    as: 'invitationsDetail'
                }
            },
            {
                $match: {
                    replyCommentId: {
                        $in: myCommentArr
                    }
                }
            },
            {
                $project: {
                    "_id": 1,
                    "openId": 1, // 回复的人openId
                    "createTime": 1,
                    "iid": 1,
                    "invitationsDetail.classify": 1,
                    "parentCommentId": 1,
                    "replyCommentId": 1,
                    "content": 1, // 回复的内容
                    "userDetail.openId": 1, // 回复的人openId
                    "userDetail.avatar": 1,
                    "userDetail.nickName": 1,
                    "myCommentDetail.content": 1, // 我的评论内容
                    "fatherCommentDetail.content": 1 // 父级评论的内容
                }
            },
            {
                $sort: {
                    "createTime": -1
                }
            }
        ])

        data = data.map((val, index) => {
            val.userDetail = val.userDetail[0]
            val.myCommentDetail = val.myCommentDetail[0]
            val.fatherCommentDetail = val.fatherCommentDetail[0]
            val.invitationsDetail = val.invitationsDetail[0]
            return val
        })


        return data
    },

    // 获取我收藏的帖子
    async getMyCollect(openId) {
        let data = await InvitationsCollectModel.aggregate([{
                $match: {
                    openId
                }
            }, {
                $lookup: {
                    from: 'invitations',
                    localField: 'iid',
                    foreignField: '_id',
                    as: 'invitationsDetail'
                }
            }, {
                $lookup: {
                    from: 'user',
                    localField: 'postOpenId',
                    foreignField: 'openId',
                    as: 'userDetail'
                }
            }, {
                $lookup: {
                    from: 'invitations_collect',
                    localField: 'iid',
                    foreignField: 'iid',
                    as: 'collect'
                }
            },
            {
                $lookup: {
                    from: 'invitations_like',
                    localField: 'iid',
                    foreignField: 'iid',
                    as: 'like'
                }
            },
            {
                $lookup: {
                    from: 'invitations_watch',
                    localField: 'iid',
                    foreignField: 'iid',
                    as: 'watch'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: 'iid',
                    foreignField: 'iid',
                    as: 'comments'
                }
            },
            {
                $project: {
                    "_id": 1,
                    "iid": 1,
                    "openId": 1,
                    "createTime": 1,
                    "postOpenId": 1,
                    "invitationsDetail.openId": 1,
                    "invitationsDetail.title": 1,
                    "invitationsDetail.desc": 1,
                    "invitationsDetail.createTime": 1,
                    "invitationsDetail.pic": 1,
                    "invitationsDetail.price": 1,
                    "invitationsDetail.classify": 1,
                    "invitationsDetail.status": 1,
                    "userDetail.avatar": 1,
                    "userDetail.nickName": 1,
                    "userDetail.desc": 1,
                    "collect": 1,
                    "like": 1,
                    "watch": 1,
                    "comments": 1
                }
            },
            {
                $sort: {
                    "createTime": -1
                }
            }
        ])

        data = data.map((val, index) => {
            val.invitationsDetail = val.invitationsDetail[0]
            val.userDetail = val.userDetail[0]
            val.collect = val.collect.length
            val.like = val.like.length
            val.watch = val.watch.length
            val.comments = val.comments.length
            return val
        })
        console.log(data.length)

        return data
    },


    // 根据某用户某类别获取帖子数据(不要详情数据)
    async getMyInvitationsByClassAndStatus(openId, classify, statusArr) {
        let data = await InvitationsModel.aggregate([{
                $match: {
                    openId,
                    classify,
                    status: {
                        $in: statusArr
                    }
                }
            }, {
                $lookup: {
                    from: 'invitations_collect',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'collect'
                }
            },
            {
                $lookup: {
                    from: 'invitations_like',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'like'
                }
            },
            {
                $lookup: {
                    from: 'invitations_watch',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'watch'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'comments'
                }
            },
            {
                $project: {
                    "_id": 1,
                    "openId": 1,
                    "title": 1,
                    "desc": 1,
                    "pic": 1,
                    "status": 1,
                    "price": 1,
                    "classify": 1,
                    "createTime": 1,
                    "collect": 1,
                    "like": 1,
                    "watch": 1,
                    "comments": 1
                }
            }, {
                $sort: {
                    "createTime": -1
                }
            }
        ])

        data = data.map((val, index) => {
            val.like = val.like.length
            val.collect = val.collect.length
            val.watch = val.watch.length
            val.comments = val.comments.length
            return val
        })

        return data
    },

    // 获取我发布的所有帖子
    async getAllPublish(openId) {
        let legWork = {}
        let secondHand = {}
        let partTimeJob = {}
        let lost = {}
        let found = {}
        legWork.statusIs0 = await this.getMyInvitationsByClassAndStatus(openId, 0, [0])
        legWork.statusIs1 = await this.getMyInvitationsByClassAndStatus(openId, 0, [1])
        legWork.statusIs2 = await this.getMyInvitationsByClassAndStatus(openId, 0, [2])
        secondHand.statusIs0 = await this.getMyInvitationsByClassAndStatus(openId, 1, [0])
        secondHand.statusIs1 = await this.getMyInvitationsByClassAndStatus(openId, 1, [1])
        secondHand.statusIs2 = await this.getMyInvitationsByClassAndStatus(openId, 1, [2])
        partTimeJob.statusIs0 = await this.getMyInvitationsByClassAndStatus(openId, 2, [0])
        partTimeJob.statusIs2 = await this.getMyInvitationsByClassAndStatus(openId, 2, [2])
        lost.statusIs0 = await this.getMyInvitationsByClassAndStatus(openId, 3, [0])
        lost.statusIs2 = await this.getMyInvitationsByClassAndStatus(openId, 3, [2])
        found.statusIs0 = await this.getMyInvitationsByClassAndStatus(openId, 5, [0])
        found.statusIs2 = await this.getMyInvitationsByClassAndStatus(openId, 5, [2])

        let data = {
            legWork,
            secondHand,
            partTimeJob,
            lost,
            found
        }

        return data
    },

    // 获取用户的所有地址
    async getAddress(openId) {
        let data = AddressModel.find({
            openId
        }).sort({
            'status': -1
        })

        return data
    },
    // 添加地址
    async addAddress(openId, newAddress) {
        if (newAddress.status) {
            // 将该人原来为默认地址的status设为0
            await AddressModel.updateOne({
                openId,
                status: 1
            }, {
                status: 0
            })
        }
        newAddress.id = mongoose.Types.ObjectId(newAddress._id)
        // 新增当前这个
        let n = new AddressModel({
            openId,
            ...newAddress,
            createTime: Date.now()
        })
        await n.save()
    },

    // 获取用户的某个地址
    async getAddressByAddressId(openId, addressId) {
        let data = await AddressModel.find({
            openId,
            _id: addressId
        })
        data = data[0]
        return data

    },
    // 修改地址
    async editAddress(openId, data) {
        if (data.status) {
            // 将该人的其他的地址的status设为0
            let result = await AddressModel.update({
                openId,
                status: 1
            }, {
                status: 0
            })
        }
        data.id = mongoose.Types.ObjectId(data._id)
        // 修改当前这个
        let result2 = await AddressModel.update({
            _id: data._id
        }, {
            name: data.name,
            tel: data.tel,
            location: data.location,
            tag: data.tag,
            status: data.status
        })
    },

    // // 根据某类别全部帖子数据(不要用户数据和详情数据)
    // async getAllInvitationsByClass(classify) {
    //     let data = await InvitationsModel.aggregate([{
    //             $match: {
    //                 classify
    //             }
    //         }, {
    //             $lookup: {
    //                 from: 'invitations_collect',
    //                 localField: '_id',
    //                 foreignField: 'iid',
    //                 as: 'collect'
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: 'invitations_like',
    //                 localField: '_id',
    //                 foreignField: 'iid',
    //                 as: 'like'
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: 'invitations_watch',
    //                 localField: '_id',
    //                 foreignField: 'iid',
    //                 as: 'watch'
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: 'comments',
    //                 localField: '_id',
    //                 foreignField: 'iid',
    //                 as: 'comments'
    //             }
    //         },
    //         {
    //             $project: {
    //                 "_id": 1,
    //                 "openId": 1,
    //                 "title": 1,
    //                 "desc": 1,
    //                 "pic": 1,
    //                 "price": 1,
    //                 "classify": 1,
    //                 "createTime": 1,
    //                 "collect": 1,
    //                 "like": 1,
    //                 "watch": 1,
    //                 "comments": 1
    //             }
    //         },
    //         {
    //             $sort: {
    //                 "createTime": -1
    //             }
    //         }
    //     ])

    //     data = data.map((val, index) => {
    //         val.like = val.like.length
    //         val.collect = val.collect.length
    //         val.watch = val.watch.length
    //         val.comments = val.comments.length
    //         return val
    //     })

    //     return data
    // },

    // 获取我观看的帖子
    async getHistory(openId) {

        let data = await InvitationsWatchModel.aggregate([{
                $match: {
                    openId
                }
            }, {
                $lookup: {
                    from: 'invitations',
                    localField: 'iid',
                    foreignField: '_id',
                    as: 'invitationsDetail'
                }
            }, {
                $lookup: {
                    from: 'user',
                    localField: 'postOpenId',
                    foreignField: 'openId',
                    as: 'userDetail'
                }
            }, {
                $lookup: {
                    from: 'invitations_collect',
                    localField: 'iid',
                    foreignField: 'iid',
                    as: 'collect'
                }
            },
            {
                $lookup: {
                    from: 'invitations_like',
                    localField: 'iid',
                    foreignField: 'iid',
                    as: 'like'
                }
            },
            {
                $lookup: {
                    from: 'invitations_watch',
                    localField: 'iid',
                    foreignField: 'iid',
                    as: 'watch'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: 'iid',
                    foreignField: 'iid',
                    as: 'comments'
                }
            },
            {
                $project: {
                    "_id": 0,
                    "iid": 1,
                    "openId": 1,
                    "createTime": 1,
                    "postOpenId": 1,
                    "invitationsDetail.openId": 1,
                    "invitationsDetail.title": 1,
                    "invitationsDetail.desc": 1,
                    "invitationsDetail.createTime": 1,
                    "invitationsDetail.pic": 1,
                    "invitationsDetail.classify": 1,
                    "invitationsDetail.price": 1,
                    "invitationsDetail.status": 1,
                    "userDetail.avatar": 1,
                    "userDetail.nickName": 1,
                    "userDetail.desc": 1,
                    "collect": 1,
                    "like": 1,
                    "watch": 1,
                    "comments": 1
                }
            },
            {
                $sort: {
                    "createTime": -1
                }
            }
        ])


        data = data.map((val, index) => {
            val.invitationsDetail = val.invitationsDetail[0]
            val.userDetail = val.userDetail[0]
            val.collect = val.collect.length
            val.like = val.like.length
            val.watch = val.watch.length
            val.comments = val.comments.length
            return val
        })

        return data
    },
    // 获取校园热点文章
    async getSchoolNews() {
        let data = await InvitationsModel.aggregate([{
                $match: {
                    classify: 4
                }
            }, {
                $lookup: {
                    from: 'invitations_collect',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'collect'
                }
            },
            {
                $lookup: {
                    from: 'invitations_like',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'like'
                }
            },
            {
                $lookup: {
                    from: 'invitations_watch',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'watch'
                }
            }, {
                $lookup: {
                    from: 'schoolNews_content',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'detail'
                }
            },
            // {
            //     $lookup: {
            //         from: 'comments',
            //         localField: '_id',
            //         foreignField: 'iid',
            //         as: 'comments'
            //     }
            // },
            {
                $project: {
                    "_id": 1,
                    "title": 1,
                    "desc": 1,
                    "pic": 1,
                    "createTime": 1,
                    "collect": 1,
                    "like": 1,
                    "watch": 1,
                    "detail": 1,
                    // "comments": 1
                }
            },
            {
                $sort: {
                    "createTime": -1
                }
            }
        ])

        data = data.map((val, index) => {
            val.like = val.like.length
            val.collect = val.collect.length
            val.watch = val.watch.length
            val.detail = val.detail[0]
            // val.comments = val.comments.length
            return val
        })

        return data
    },


    // 根据某用户某类别获取帖子数据(不要详情数据)
    async getInvitationsByClassAndStatus(classify, statusArr) {
        let data = await InvitationsModel.aggregate([{
                $match: {
                    classify,
                    status: {
                        $in: statusArr
                    }
                }
            }, {
                $lookup: {
                    from: 'invitations_collect',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'collect'
                }
            },
            {
                $lookup: {
                    from: 'invitations_like',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'like'
                }
            },
            {
                $lookup: {
                    from: 'invitations_watch',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'watch'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'comments'
                }
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'openId',
                    foreignField: 'openId',
                    as: 'userDetail'
                }
            },
            {
                $project: {
                    "_id": 1,
                    "openId": 1,
                    "title": 1,
                    "desc": 1,
                    "pic": 1,
                    "price": 1,
                    "status": 1,
                    "classify": 1,
                    "createTime": 1,
                    "collect": 1,
                    "like": 1,
                    "watch": 1,
                    "comments": 1,
                    "createTime": 1,
                    "userDetail.openId": 1,
                    "userDetail.avatar": 1,
                    "userDetail.nickName": 1,
                }
            },
            {
                $sort: {
                    "createTime": -1
                }
            }
        ])


        data = data.map((val, index) => {
            val.like = val.like.length
            val.collect = val.collect.length
            val.watch = val.watch.length
            val.comments = val.comments.length
            val.userDetail = val.userDetail[0]
            return val
        })

        // if (classify === 3) {
        //     let _data = {
        //         lost: [],
        //         found: []
        //     }
        //     data.forEach((val, index) => {
        //         if (val.status === 8) {
        //             // 丢东西
        //             _data.lost.push(val)
        //         } else if (val.status === 9) {
        //             // 捡东西
        //             _data.found.push(val)
        //         }
        //     })
        //     data = _data
        // }

        return data
    },

    // 获取所有帖子
    async getAllPost() {
        let legWork = {}
        let secondHand = {}
        let partTimeJob = {}
        let lost = {}
        let found = {}

        legWork.statusIs0 = await this.getInvitationsByClassAndStatus(0, [0])
        legWork.statusIs1 = await this.getInvitationsByClassAndStatus(0, [1])
        legWork.statusIs2 = await this.getInvitationsByClassAndStatus(0, [2])
        legWork.statusIs01245 = await this.getInvitationsByClassAndStatus(0, [0, 1, 2, 4, 5]) // 除了下架的

        secondHand.statusIs0 = await this.getInvitationsByClassAndStatus(1, [0])
        secondHand.statusIs1 = await this.getInvitationsByClassAndStatus(1, [1])
        secondHand.statusIs2 = await this.getInvitationsByClassAndStatus(1, [2])
        secondHand.statusIs01245 = await this.getInvitationsByClassAndStatus(1, [0, 1, 2, 4, 5])

        partTimeJob.statusIs0 = await this.getInvitationsByClassAndStatus(2, [0])
        partTimeJob.statusIs2 = await this.getInvitationsByClassAndStatus(2, [2])
        partTimeJob.statusIs02 = await this.getInvitationsByClassAndStatus(2, [0, 2])

        lost.statusIs0 = await this.getInvitationsByClassAndStatus(3, [0])
        lost.statusIs2 = await this.getInvitationsByClassAndStatus(3, [2])
        lost.statusIs02 = await this.getInvitationsByClassAndStatus(3, [0, 2])

        found.statusIs0 = await this.getInvitationsByClassAndStatus(5, [0])
        found.statusIs2 = await this.getInvitationsByClassAndStatus(5, [2])
        found.statusIs02 = await this.getInvitationsByClassAndStatus(5, [0, 2])

        let data = {
            legWork,
            secondHand,
            partTimeJob,
            lost,
            found
        }
        return data
    },
    // 主页查询帖子
    async searchInIndexPage(searchStr, classify, statusArr) {
        statusArr = JSON.parse(statusArr)
        console.log(statusArr)
        classify = +classify
        let data = await InvitationsModel.aggregate([{
                $match: {
                    classify,
                    status: {
                        $in: statusArr
                    },
                    $or: [ //多条件，数组
                        {
                            title: {
                                $regex: searchStr
                            }
                        },
                        {
                            desc: {
                                $regex: searchStr
                            }
                        }
                    ]
                }
            }, {
                $lookup: {
                    from: 'invitations_collect',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'collect'
                }
            },
            {
                $lookup: {
                    from: 'invitations_like',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'like'
                }
            },
            {
                $lookup: {
                    from: 'invitations_watch',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'watch'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'comments'
                }
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'openId',
                    foreignField: 'openId',
                    as: 'userDetail'
                }
            },
            {
                $project: {
                    "_id": 1,
                    "openId": 1,
                    "title": 1,
                    "desc": 1,
                    "pic": 1,
                    "price": 1,
                    "status": 1,
                    "classify": 1,
                    "createTime": 1,
                    "collect": 1,
                    "like": 1,
                    "watch": 1,
                    "comments": 1,
                    "createTime": 1,
                    "userDetail.openId": 1,
                    "userDetail.avatar": 1,
                    "userDetail.nickName": 1,
                }
            },
            {
                $match: {
                    status: {
                        $in: statusArr
                    },
                }
            }, {
                $sort: {
                    "createTime": -1
                }
            }
        ])

        data = data.map((val, index) => {
            val.like = val.like.length
            val.collect = val.collect.length
            val.watch = val.watch.length
            val.comments = val.comments.length
            val.userDetail = val.userDetail[0]
            return val
        })
        return data
    },
    // 校园热点查询帖子
    async searchSchoolNews(searchStr, classify) {
        console.log(searchStr, classify)
        classify = +classify
        let data = await InvitationsModel.aggregate([{
                $match: {
                    classify,
                    $or: [ //多条件，数组
                        {
                            title: {
                                $regex: searchStr
                            }
                        },
                        {
                            desc: {
                                $regex: searchStr
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'invitations_collect',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'collect'
                }
            },
            // {
            //     $lookup: {
            //         from: 'invitations_like',
            //         localField: '_id',
            //         foreignField: 'iid',
            //         as: 'like'
            //     }
            // },
            {
                $lookup: {
                    from: 'invitations_watch',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'watch'
                }
            }, {
                $lookup: {
                    from: 'schoolNews_content',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'detail'
                }
            },
            // {
            //     $lookup: {
            //         from: 'comments',
            //         localField: '_id',
            //         foreignField: 'iid',
            //         as: 'comments'
            //     }
            // },
            {
                $project: {
                    "_id": 1,
                    "title": 1,
                    "desc": 1,
                    "pic": 1,
                    "createTime": 1,
                    "collect": 1,
                    // "like": 1,
                    "watch": 1,
                    "detail": 1,
                    // "comments": 1
                }
            },
            {
                $sort: {
                    "createTime": -1
                }
            }
        ])

        data = data.map((val, index) => {
            // val.like = val.like.length
            val.collect = val.collect.length
            val.watch = val.watch.length
            val.detail = val.detail[0]
            // val.comments = val.comments.length
            // val.userDetail = val.userDetail[0]
            return val
        })

        return data


    },
    // 我的收藏搜索帖子
    async searchMyCollect(openId, searchStr) {
        let data = await InvitationsCollectModel.aggregate([{
                $match: {
                    openId
                }
            }, {
                $lookup: {
                    from: 'invitations',
                    localField: 'iid',
                    foreignField: '_id',
                    as: 'invitationsDetail'
                }
            }, {
                $lookup: {
                    from: 'user',
                    localField: 'postOpenId',
                    foreignField: 'openId',
                    as: 'userDetail'
                }
            }, {
                $lookup: {
                    from: 'invitations_collect',
                    localField: 'iid',
                    foreignField: 'iid',
                    as: 'collect'
                }
            },
            {
                $lookup: {
                    from: 'invitations_like',
                    localField: 'iid',
                    foreignField: 'iid',
                    as: 'like'
                }
            },
            {
                $lookup: {
                    from: 'invitations_watch',
                    localField: 'iid',
                    foreignField: 'iid',
                    as: 'watch'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: 'iid',
                    foreignField: 'iid',
                    as: 'comments'
                }
            },
            {
                $project: {
                    "_id": 1,
                    "iid": 1,
                    "openId": 1,
                    "createTime": 1,
                    "postOpenId": 1,
                    "invitationsDetail.openId": 1,
                    "invitationsDetail.title": 1,
                    "invitationsDetail.desc": 1,
                    "invitationsDetail.createTime": 1,
                    "invitationsDetail.pic": 1,
                    "invitationsDetail.price": 1,
                    "invitationsDetail.classify": 1,
                    "invitationsDetail.status": 1,
                    "userDetail.avatar": 1,
                    "userDetail.nickName": 1,
                    "userDetail.desc": 1,
                    "collect": 1,
                    "like": 1,
                    "watch": 1,
                    "comments": 1
                }
            },
            {
                $match: {
                    $or: [ //多条件，数组
                        {
                            "invitationsDetail.title": {
                                $regex: searchStr
                            }
                        },
                        {
                            "invitationsDetail.desc": {
                                $regex: searchStr
                            }
                        }
                    ]
                }
            }, {
                $sort: {
                    "createTime": -1
                }
            }
        ])

        data = data.map((val, index) => {
            val.invitationsDetail = val.invitationsDetail[0]
            val.userDetail = val.userDetail[0]
            val.collect = val.collect.length
            val.like = val.like.length
            val.watch = val.watch.length
            val.comments = val.comments.length
            return val
        })

        return data


    },
    // 我的历史搜索帖子
    async searchMyHistory(openId, searchStr) {
        let data = await InvitationsWatchModel.aggregate([{
                $match: {
                    openId
                }
            }, {
                $lookup: {
                    from: 'invitations',
                    localField: 'iid',
                    foreignField: '_id',
                    as: 'invitationsDetail'
                }
            }, {
                $lookup: {
                    from: 'user',
                    localField: 'postOpenId',
                    foreignField: 'openId',
                    as: 'userDetail'
                }
            }, {
                $lookup: {
                    from: 'invitations_collect',
                    localField: 'iid',
                    foreignField: 'iid',
                    as: 'collect'
                }
            },
            {
                $lookup: {
                    from: 'invitations_like',
                    localField: 'iid',
                    foreignField: 'iid',
                    as: 'like'
                }
            },
            {
                $lookup: {
                    from: 'invitations_watch',
                    localField: 'iid',
                    foreignField: 'iid',
                    as: 'watch'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: 'iid',
                    foreignField: 'iid',
                    as: 'comments'
                }
            },
            {
                $project: {
                    "_id": 0,
                    "iid": 1,
                    "openId": 1,
                    "createTime": 1,
                    "postOpenId": 1,
                    "invitationsDetail.openId": 1,
                    "invitationsDetail.title": 1,
                    "invitationsDetail.desc": 1,
                    "invitationsDetail.createTime": 1,
                    "invitationsDetail.pic": 1,
                    "invitationsDetail.classify": 1,
                    "invitationsDetail.price": 1,
                    "invitationsDetail.status": 1,
                    "userDetail.avatar": 1,
                    "userDetail.nickName": 1,
                    "userDetail.desc": 1,
                    "collect": 1,
                    "like": 1,
                    "watch": 1,
                    "comments": 1
                }
            },
            {
                $match: {
                    $or: [ //多条件，数组
                        {
                            "invitationsDetail.title": {
                                $regex: searchStr
                            }
                        },
                        {
                            "invitationsDetail.desc": {
                                $regex: searchStr
                            }
                        }
                    ]
                }
            },
            {
                $sort: {
                    "createTime": -1
                }
            }
        ])

        data = data.map((val, index) => {
            val.invitationsDetail = val.invitationsDetail[0]
            val.userDetail = val.userDetail[0]
            val.collect = val.collect.length
            val.like = val.like.length
            val.watch = val.watch.length
            val.comments = val.comments.length
            return val
        })
        return data

    },
    // 回复我的搜索
    async searchMyComment(openId, searchStr) {
        let myCommentArr = await CommentsModel.find({
            openId
        }, {
            _id: 1
        })

        myCommentArr = myCommentArr.map((val, index) => {
            let id = mongoose.Types.ObjectId(val._id)
            return id
        })
        let data = await CommentsModel.aggregate([{
                $match: {
                    replyCommentId: {
                        $in: myCommentArr
                    }
                }
            }, {
                $lookup: {
                    from: 'user',
                    localField: 'openId',
                    foreignField: 'openId',
                    as: 'userDetail'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: 'replyCommentId',
                    foreignField: '_id',
                    as: 'myCommentDetail'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: 'parentCommentId',
                    foreignField: '_id',
                    as: 'fatherCommentDetail'
                }
            },
            {
                $lookup: {
                    from: 'invitations',
                    localField: 'iid',
                    foreignField: '_id',
                    as: 'invitationsDetail'
                }
            },

            {
                $project: {
                    "_id": 1,
                    "openId": 1, // 回复的人openId
                    "createTime": 1,
                    "iid": 1,
                    "invitationsDetail.classify": 1,
                    "parentCommentId": 1,
                    "replyCommentId": 1,
                    "content": 1, // 回复的内容
                    "userDetail.openId": 1, // 回复的人openId
                    "userDetail.avatar": 1,
                    "userDetail.nickName": 1,
                    "myCommentDetail.content": 1, // 我的评论内容
                    "fatherCommentDetail.content": 1 // 父级评论的内容
                }
            },
            {
                $match: {
                    $or: [ //多条件，数组
                        {
                            "fatherCommentDetail.content": {
                                $regex: searchStr
                            }
                        },
                        {
                            "myCommentDetail.content": {
                                $regex: searchStr
                            }
                        },
                        {
                            "content": {
                                $regex: searchStr
                            }
                        }
                    ]
                }
            },
            {
                $sort: {
                    "createTime": -1
                }
            }
        ])


        data = data.map((val, index) => {
            val.userDetail = val.userDetail[0]
            val.myCommentDetail = val.myCommentDetail[0]
            val.fatherCommentDetail = val.fatherCommentDetail[0]
            val.invitationsDetail = val.invitationsDetail[0]
            return val
        })
        return data

    },

    /**
     * 
     * @param {用户openId} openId 
     * @param {帖子的唯一表示} iid
     * 
     * 1. 帖子表关联帖子详情表，获取该帖子的
     * （帖子信息以及帖子详情信息，喜欢，浏览，点赞，留言数，发帖人用户信息）
     * 2. 存储该用户的观看记录到invitations_watch
     */
    async getPostDetailAndAddWatchPost(openId, iid) {

        let _id = mongoose.Types.ObjectId(iid)

        let h = await InvitationsModel.aggregate([{
            $match: {
                _id: _id
            }
        }])
        let classify = h[0].classify
        // 获取帖子详情
        let tableName = this.changeClassifyToStr(+classify)



        let detail = await InvitationsModel.aggregate([{
                $match: {
                    _id: _id
                }
            },
            {
                $lookup: {
                    from: `${tableName}_content`,
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'invitationsDetail'
                }
            },
            {
                $lookup: {
                    from: 'invitations_collect',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'collect'
                }
            },
            {
                $lookup: {
                    from: 'invitations_like',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'like'
                }
            },
            {
                $lookup: {
                    from: 'invitations_watch',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'watch'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'comments'
                }
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'openId',
                    foreignField: 'openId',
                    as: 'userDetail'
                }
            },
            {
                $project: {
                    "_id": 1,
                    "openId": 1,
                    "title": 1,
                    "desc": 1,
                    "pic": 1,
                    "price": 1,
                    "status": 1,
                    "classify": 1,
                    "createTime": 1,
                    "collect": 1,
                    "like": 1,
                    "watch": 1,
                    "comments": 1,
                    "invitationsDetail": 1,
                    "userDetail.openId": 1,
                    "userDetail.avatar": 1,
                    "userDetail.nickName": 1,
                    "userDetail.createTime": 1
                }
            }
            // ,
            // {
            //     $sort: {
            //         "createTime": -1
            //     }
            // }
        ])
        detail = detail[0]
        detail.invitationsDetail = detail.invitationsDetail[0]
        detail.userDetail = detail.userDetail[0]
        detail.collect = detail.collect.length
        detail.like = detail.like.length
        detail.watch = detail.watch.length
        detail.comments = detail.comments.length
        let num = await this.completedOrder(openId, classify)
        console.log(num)
        detail.userDetail.completedOrderNum = num


        // 判断如果该用户已经浏览过该帖子 则只更改浏览时间为当前时间
        let doc = await InvitationsWatchModel.find({
            iid: _id,
            openId
        })
        if (doc.length == 0) {
            let n = new InvitationsWatchModel({
                iid: _id,
                openId: openId,
                postOpenId: detail.openId,
                createTime: Date.now()
            })
            await n.save()
        } else {
            await InvitationsWatchModel.updateOne({
                iid: _id,
                openId
            }, {
                createTime: Date.now()
            })
        }


        // 获取帖子留言
        let commentDetail = await this.getCommentsByIID(_id, openId)


        // 是否关注了 发帖人
        let isFollowing = await UserFollowModel.aggregate([{
            $match: {
                openId,
                followId: detail.openId
            }
        }])
        // 是否点赞了帖子
        let isLike = await InvitationsLikeModel.aggregate([{
            $match: {
                openId,
                iid: _id
            }
        }])
        // 是否收藏了帖子
        let isCollect = await InvitationsCollectModel.aggregate([{
            $match: {
                openId,
                iid: _id
            }
        }])


        let data = {
            detail,
            commentDetail,
            isFollowing: isFollowing.length,
            isLike: isLike.length,
            isCollect: isCollect.length,
            openId
        }

        return data


    },

    // 将类型转换为关联表的表名：
    changeClassifyToStr(classify) {
        let str = ''
        switch (classify) {
            case 0:
                str = 'legwork'
                break;
            case 1:
                str = 'secondhand'
                break;
            case 2:
                str = 'partTimeJob'
                break;
            case 3:
                str = 'lostAndFound'
                break;
            case 5:
                str = 'lostAndFound'
                break;
            case 4:
                str = 'schoolNews'
                break;
            default:
                break;
        }
        return str
    },

    // 根据openId查询该用户完成了多少类别为classify的帖子
    async completedOrder(openId, classify) {
        let completedOrder
        if (classify == 0) {
            let result = await LegworkContentModel.aggregate([{
                    $match: {
                        $or: [{
                                takerId: openId,
                            },
                            {
                                openId: openId,
                            }
                        ],
                        status: 3
                    }
                },
                {
                    $project: {
                        "_id": 1,

                    }
                }
                // ,
                // {
                //     $sort: {
                //         "createTime": -1
                //     }
                // }
            ])
            completedOrder = result.length
        } else if (classify == 1) {
            let result = await SecondhandContentModel.aggregate([{
                    $match: {
                        $or: [{
                                takerId: openId,
                            },
                            {
                                openId: openId,
                            }
                        ],
                        status: 3
                    }
                },
                {
                    $project: {
                        "_id": 1,

                    }
                }
                // ,
                // {
                //     $sort: {
                //         "createTime": -1
                //     }
                // }
            ])
            completedOrder = result.length
        } else if (classify == 2) {
            let result = await PartTimeJobContentModel.aggregate([{
                    $match: {
                        openId
                    }
                },
                {
                    $project: {
                        "_id": 1,

                    }
                }
            ])
            completedOrder = result.length
        } else if (classify == 3) {
            let result = await InvitationsModel.aggregate([{
                    $match: {
                        openId,
                        classify: 3
                    }
                },
                {
                    $project: {
                        "_id": 1,

                    }
                }
            ])
            completedOrder = result.length
        } else if (classify == 5) {
            let result = await InvitationsModel.aggregate([{
                    $match: {
                        openId,
                        classify: 5
                    }
                },
                {
                    $project: {
                        "_id": 1,

                    }
                }
            ])
            completedOrder = result.length
        }

        return completedOrder


    },

    // 发布评论
    async sendComment(openId, content, iid, replyCommentId, parentCommentId) {
        iid = mongoose.Types.ObjectId(iid)
        replyCommentId = mongoose.Types.ObjectId(replyCommentId)
        parentCommentId = mongoose.Types.ObjectId(parentCommentId)
        let n = new CommentsModel({
            openId,
            content,
            iid,
            replyCommentId,
            parentCommentId,
            createTime: Date.now()
        })
        await n.save()
    },

    // 发布失物招领帖子
    async publishLostAndFound(openId, data) {
        data.pic = JSON.parse(data.pic)
        data.pic = data.pic.map((val, index) => {
            return config.host + '/' + val
        })
        data.classify = +data.classify
        let createTime = Date.now()
        let invitations = new InvitationsModel({
            openId,
            ...data,
            createTime,
            createTime: Date.now()
        })
        let result = await invitations.save()
        let iid = mongoose.Types.ObjectId(result._id)

        let lostAndFoundContent = new LostAndFoundContentModel({
            iid,
            openId,
            ...data,
            createTime: Date.now()
        })
        let result2 = await lostAndFoundContent.save()
    },
    // 发布兼职招聘帖子
    async publishPartTimeJob(openId, data) {
        data.pic = JSON.parse(data.pic)
        data.pic = data.pic.map((val, index) => {
            return config.host + '/' + val
        })
        console.log(data)
        let createTime = Date.now()
        let invitations = new InvitationsModel({
            openId,
            ...data,
            createTime,
        })
        let result = await invitations.save()
        let iid = mongoose.Types.ObjectId(result._id)

        let partTimeJobContent = new PartTimeJobContentModel({
            iid,
            openId,
            ...data,
        })
        await partTimeJobContent.save()
    },
    // 发布跑腿帖子
    async publishLegWork(openId, data) {
        data.pic = JSON.parse(data.pic)
        data.pic = data.pic.map((val, index) => {
            // console.log(val)
            return config.host + '/' + val
        })
        // console.log(data)
        data.addressId = mongoose.Types.ObjectId(data.addressId)
        let createTime = Date.now()
        let invitations = new InvitationsModel({
            openId,
            ...data,
            createTime
        })
        let result = await invitations.save()
        let iid = mongoose.Types.ObjectId(result._id)
        let legworkContent = new LegworkContentModel({
            iid,
            openId,
            ...data
        })
        await legworkContent.save()
    },
    // 发布二手交易帖子
    async publishSecondhand(openId, data) {
        data.pic = JSON.parse(data.pic)
        data.pic = data.pic.map((val, index) => {
            return config.host + '/' + val
        })
        // console.log(data, 'data')

        data.deliveryAddressId = mongoose.Types.ObjectId(data.deliveryAddressId)
        let createTime = Date.now()
        let invitations = new InvitationsModel({
            openId,
            ...data,
            createTime
        })
        let result = await invitations.save()
        let iid = mongoose.Types.ObjectId(result._id)
        if (data.deliveryWay != 2) {
            let secondhandContent = new SecondhandContentModel({
                iid,
                openId,
                ...data,
                buyerAddressId: THE_NULL_OBJECT_ID
            })
            // console.log(secondhandContent, '传了deliveryAddressId')
            await secondhandContent.save()
        } else {
            let secondhandContent = new SecondhandContentModel({
                iid,
                openId,
                ...data,
                deliveryAddressId: THE_NULL_OBJECT_ID,
                buyerAddressId: THE_NULL_OBJECT_ID
            })
            // console.log(secondhandContent, '没传deliveryAddressId')
            await secondhandContent.save()
        }
    },

    // 获取post参数
    async getPostData(ctx) {
        return new Promise((resolve, reject) => {
            try {
                let str = ''
                ctx.req.on('data', (chunk) => {
                    str += chunk
                })
                ctx.req.on('end', (chunk) => {
                    resolve(str)
                })

            } catch (error) {
                reject(err)
            }
        })
    },

    // 读文件
    readFileSync(path) {
        // 读路径
        let data = fs.readFileSync(path, 'utf-8')
        console.log(data)
        console.log('同步方法执行完毕')
    },

    readFile(path, recall) {
        fs.readFile(path, (err, data) => {
            if (err) {
                console.log(err)
            } else {
                console.log(data.toString());
                recall(data)
            }
        })
        console.log('异步方法执行完毕')
    },

    // 读取二进制图片(传入路径)
    readImg(path, res) {
        fs.readFile(path, 'binary', (err, fileData) => {
            if (err) {
                console.log(err)
                return
            } else {
                res.write(fileData, 'binary')
                res.end()
            }
        })
    },

    // 写文件
    writeFile(path, data, recall) {
        fs.writeFile(path, data, (err) => {
            if (err) {
                throw err
            }
            console.log('文件被保存了')
            recall('写文件成功')
        })
    },
    writeFileSync(path, data) {
        fs.writeFileSync(path, data)
        console.log(同步写文件完成)
    },

    // 删除指定文件夹的图片
    deletePic(path) {
        path = __dirname + '/uploads/' + path
        console.log(fs.existsSync(path), path)
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
            return {
                code: 1
            }
            // if (fs.statSync(path).isDirectory()) {
            //     files = fs.readdirSync(path);
            //     files.forEach(function (file, index) {
            //         var curPath = path + "/" + file;
            //         if (fs.statSync(curPath).isDirectory()) {
            //             deleteFolder(curPath);
            //         } else {
            //             fs.unlinkSync(curPath);
            //         }
            //     });
            //     // fs.rmdirSync(path);
            // } else {
            //     fs.unlinkSync(path);
            // }
        } else {
            return {
                code: 0,
                msg: '服务器上没有此图片'
            }
        }
    },


    // 获取我要购买界面需要的数据
    async getBuyData(openId, iid) {
        console.log(iid)
        iid = mongoose.Types.ObjectId(iid)
        let buyData = await InvitationsModel.aggregate([{
                $match: {
                    _id: iid
                }
            },
            {
                $lookup: {
                    from: `secondhand_content`,
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'invitationsDetail'
                }
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'openId',
                    foreignField: 'openId',
                    as: 'userDetail'
                }
            },
            {
                $project: {
                    "_id": 1,
                    "openId": 1,
                    "title": 1,
                    "desc": 1,
                    "pic": 1,
                    "price": 1,
                    "status": 1,
                    "classify": 1,
                    "invitationsDetail": 1,
                    "userDetail.openId": 1,
                    "userDetail.avatar": 1,
                    "userDetail.nickName": 1,
                }
            }
        ])
        buyData = buyData[0]
        buyData.invitationsDetail = buyData.invitationsDetail[0]
        buyData.userDetail = buyData.userDetail[0]
        console.log(buyData)
        if (buyData.invitationsDetail.deliveryWay !== 2) {
            // 需要显示自提点
            // 获取自提点地址addressData
            let deliveryAddressId = buyData.invitationsDetail.deliveryAddressId
            deliveryAddressId = mongoose.Types.ObjectId(deliveryAddressId)
            let addressData = await AddressModel.find({
                _id: deliveryAddressId
            })
            buyData.addressData = addressData[0]
        }



        let data = {
            buyData
        }

        return data
    },
    // 获取我要帮忙界面需要的数据
    async getHelpData(openId, iid) {
        console.log(iid)
        iid = mongoose.Types.ObjectId(iid)
        let helpData = await InvitationsModel.aggregate([{
                $match: {
                    _id: iid
                }
            },
            {
                $lookup: {
                    from: `legwork_content`,
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'invitationsDetail'
                }
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'openId',
                    foreignField: 'openId',
                    as: 'userDetail'
                }
            },
            {
                $project: {
                    "_id": 1,
                    "openId": 1,
                    "title": 1,
                    "desc": 1,
                    "pic": 1,
                    "price": 1,
                    "status": 1,
                    "classify": 1,
                    "invitationsDetail": 1,
                    "userDetail.openId": 1,
                    "userDetail.avatar": 1,
                    "userDetail.nickName": 1,
                }
            }
        ])
        helpData = helpData[0]
        helpData.invitationsDetail = helpData.invitationsDetail[0]
        helpData.userDetail = helpData.userDetail[0]

        // 获取送货地址addressData
        let addressId = helpData.invitationsDetail.addressId
        addressId = mongoose.Types.ObjectId(addressId)
        let addressData = await AddressModel.find({
            _id: addressId
        })
        helpData.addressData = addressData[0]

        let data = {
            helpData
        }

        return data
    },

    // 确认我要帮忙，
    // TODO:生成核销二维码
    async submitHelp(openId, takerContact, iid) {
        console.log(openId, takerContact, iid)

        let code = 0

        iid = mongoose.Types.ObjectId(iid)
        let result = await LegworkContentModel.find({
            iid
        })
        let status = result[0].status
        console.log(+status, 'result')
        if (+status === 0) {
            code = 1

            let r1 = await InvitationsModel.updateOne({
                _id: iid
            }, {
                status: 1
            })
            let r2 = await LegworkContentModel.updateOne({
                iid
            }, {
                takerId: openId,
                takerContact,
                status: 1,
                verify: '123456'
            })

            console.log(r1, r2)
        } else {
            code = 1 // 已经被承接了
        }


        let data = {
            code
        }

        return data
    },
    // 确认我要购买，
    // TODO:生成核销二维码
    async submitBuy(openId, buyerAddressId, iid) {
        console.log(openId, buyerAddressId, iid)

        let code = 0

        iid = mongoose.Types.ObjectId(iid)
        buyerAddressId = mongoose.Types.ObjectId(buyerAddressId)
        let result = await SecondhandContentModel.find({
            iid
        })
        let status = result[0].status
        console.log(+status, 'result')
        if (+status === 0) {
            code = 1

            let r1 = await InvitationsModel.updateOne({
                _id: iid
            }, {
                status: 1
            })
            let r2 = await SecondhandContentModel.updateOne({
                iid
            }, {
                takerId: openId,
                buyerAddressId,
                status: 1,
                verify: '123456'
            })

            console.log(r1, r2)
        } else {
            code = 2 // 已经被承接了
        }


        let data = {
            code
        }

        return data
    },
    async getMyReleaseLegwork(openId) {

    },
    // 根据某用户某类别获取帖子数据(不要详情数据)
    async getMyReleaseByClassAndStatus(openId, classify, statusArr) {
        let classifyArr = []
        if (classify == 3) {
            classifyArr = [3, 5]
        } else {
            classifyArr = [classify]
        }
        let data = await InvitationsModel.aggregate([{
                $match: {
                    openId,
                    classify: {
                        $in: classifyArr
                    },
                    status: {
                        $in: statusArr
                    }
                }
            }, {
                $lookup: {
                    from: 'invitations_collect',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'collect'
                }
            },
            {
                $lookup: {
                    from: 'invitations_like',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'like'
                }
            },
            {
                $lookup: {
                    from: 'invitations_watch',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'watch'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'iid',
                    as: 'comments'
                }
            },
            {
                $project: {
                    "_id": 1,
                    "openId": 1,
                    "title": 1,
                    "desc": 1,
                    "pic": 1,
                    "status": 1,
                    "price": 1,
                    "classify": 1,
                    "createTime": 1,
                    "collect": 1,
                    "like": 1,
                    "watch": 1,
                    "comments": 1
                }
            },
            {
                $sort: {
                    "createTime": -1
                }
            }
        ])

        data = data.map((val, index) => {
            val.like = val.like.length
            val.collect = val.collect.length
            val.watch = val.watch.length
            val.comments = val.comments.length
            return val
        })

        return data
    },
}

module.exports = dbOperate