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

var StudentModel = require('./model/student')
let mongoose = require('mongoose')

const CLASS_TO_NAME = ['legwork_content', 'secondhand_content', 'partTimeJob_content', 'lostAndFound_content']
let THE_COMMENTS_ID = '5e73a4fc3793ae3a44a97e52'






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
            ...data
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
            if (val.replyCommentId.toString() === THE_COMMENTS_ID && val.parentCommentId.toString() === THE_COMMENTS_ID) { // 直接对文章发表评论
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
            postOpenId
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

    // 取消我收藏的某个帖子
    async cancelCollectPost(openId, cancelInvitationsId) {
        let _iid = mongoose.Types.ObjectId(cancelInvitationsId)
        let result = await InvitationsCollectModel.remove({
            openId,
            iid: _iid
        })
    },

    // 根据某用户某类别获取帖子数据(不要详情数据)
    async getMyInvitationsByClass(openId, classify) {
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

    // 获取我发布的所有帖子
    async getAllPublish(openId) {
        let legWork = await this.getMyInvitationsByClass(openId, 0)
        let secondHand = await this.getMyInvitationsByClass(openId, 1)
        let partTimeJob = await this.getMyInvitationsByClass(openId, 2)
        let lostAndFound = await this.getMyInvitationsByClass(openId, 3)

        let data = {
            legWork,
            secondHand,
            partTimeJob,
            lostAndFound
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
        let n = new AddressModel({
            openId,
            ...newAddress
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
            return val
        })

        return data
    },


    // 根据某用户某类别获取帖子数据(不要详情数据)
    async getInvitationsByClass(classify) {
        let data = await InvitationsModel.aggregate([{
                $match: {
                    classify
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
        let legWork = await this.getInvitationsByClass(0)
        let secondHand = await this.getInvitationsByClass(1)
        let partTimeJob = await this.getInvitationsByClass(2)
        let lost = await this.getInvitationsByClass(3)
        let found = await this.getInvitationsByClass(5)
        let data = {
            legWork,
            secondHand,
            partTimeJob,
            lost,
            found
        }
        return data
    },
    // 查询帖子
    async searchInIndexPage(searchStr, classify) {
        // 注意类型，classify传进来是string类型的
        // console.log(searchStr, classify)
        let data = InvitationsModel.aggregate([{
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
                    classify: +classify,
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
                $sort: {
                    "createTime": -1
                }
            }
        ])


        // data = data.map((val, index) => {

        //     // val.like = val.like.length
        //     // val.collect = val.collect.length
        //     // val.watch = val.watch.length
        //     // val.comments = val.comments.length
        //     // val.userDetail = val.userDetail[0]
        //     return val
        // })

        // let data = {
        //     result,
        //     classify: str
        // }

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
                postOpenId: detail.openId
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


        let data = {
            detail,
            commentDetail,
            isFollowing: isFollowing.length,
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
        }

        return completedOrder


    },

    async sendComment(openId, content, iid, replyCommentId, parentCommentId) {
        iid = mongoose.Types.ObjectId(iid)
        replyCommentId = mongoose.Types.ObjectId(replyCommentId)
        parentCommentId = mongoose.Types.ObjectId(parentCommentId)
        let n = new CommentsModel({
            openId,
            content,
            iid,
            replyCommentId,
            parentCommentId
        })
        let result = await n.save()
        console.log(result)
    }



}

module.exports = dbOperate