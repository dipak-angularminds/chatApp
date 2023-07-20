const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const Post = require('../models/post.model');
const catchAsync = require('../utils/catchAsync');
const {
    postService
} = require('../services');

const createPost = catchAsync(async (req, res) => {
console.log(req.file,'hhbh')
    const post = await postService.createPost({
        caption: req.body.caption,
        location: req.body.location,
        createdBy: req.user._id,
        img: req.files.map((item)=>
           ( {fileName: item.fileName, path: item.path})
        )
    });

    res.status(httpStatus.CREATED).send(post);
});
const getPosts = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['createdAt', 'path']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);

    const result = await postService.queryPost(filter, {
        ...options,
        // options: { sort: { time: -1 } },

        populate: [{
            path: "createdBy",
            select: "_id firstname email profilePicture",

        },
        {
            path: "comments.commentBy",
            select: "_id firstname lastname profilePicture time",
            // options: { sort: { time: -1 } }

            
        },
            {
                path: "comments.reply.replyBy",
                select: "_id firstname lastname profilePicture time",
                // options: { sort: { time: -1 } }

            }
    
    ]
    });
    res.send(result);
});
const commentPost = catchAsync(async (req, res) => {
    const result = await (await postService.commentPost({
        comment: req.body.comment,
        commentBy: req.user._id
    }, req.params.postId)).populate('comments.commentBy', '_id firstname lastname profilePicture ')
       console.log(result)
       res.send(result)
})  

const likeComment = catchAsync(async (req, res) => {

    const result = await (await postService.likeComment({
        userId: req.user._id,
        commentId:req.body.commentId

    }, req.params.postId))

    console.log(result)
    res.send(result)

  

})
const replyComment = catchAsync(async (req, res) => {
    //  console.log(req);
    const result = await (await postService.replyPost({
        reply: req.body.reply,
        commentId:req.body.commentId,
        replyBy: req.user._id
    }, req.params.postId)).populate('comments.reply.replyBy', '_id firstname lastname profilePicture ')
    // console.log(result)
    res.send(result)

})

const likeReply = catchAsync(async (req, res) => {
    const result = await (await postService.likeReply({
        replyId: req.body.replyId,
        commentId: req.body.commentId,
        userId: req.user._id
    }, req.params.postId))
    // console.log(result)
    res.send(result)

})

const likePost = catchAsync(async (req, res) => {

    const result = await (await postService.likePost({
        userId:req.user._id
       
    },req.params.postId))

    console.log(result)
    res.send(result)

})
module.exports = {
    createPost,
    getPosts,
    commentPost,
    likePost,
    replyComment,
    likeComment,
    likeReply
};