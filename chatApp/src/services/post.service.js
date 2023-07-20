const httpStatus = require('http-status');
const mongoose = require('mongoose');
const {
    Post,

} = require('../models');
const ApiError = require('../utils/ApiError');

const createPost = async (userBody) => {
    return Post.create(userBody);
};
const queryPost = async (filter, options) => {
    console.log(options)
    const posts = await Post.paginate(filter, options);
    return posts;
};
const getPostById = async (id) => {
    return Post.findById(id);
};
const getUserById = async (id) => {
    return User.findById(id);
};
const commentPost = async (updateBody, postId) => {
    const post = await getPostById(postId);
    if (!post) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'post not found');
    }
    console.log(updateBody);
    Object.assign(post, { comments: [...post.comments, updateBody] });
    console.log(post);
    await post.save();
    return post;
};

const likeComment = async (updateBody, postId) => {
    const post = await getPostById(postId);
    if (!post) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'post not found');
    }
    const singlecomment = post.comments.filter((comment) => {
        if (comment._id == updateBody.commentId.toString()) {
            return comment
        }
    })
    if (!singlecomment[0].likes.filter((e) => e.userId == updateBody.userId.toString()).length > 0) {
        const comment = post.comments.map((comment) => {
            if (comment._id == updateBody.commentId) {
                console.log(comment);
                return { ...comment, likes: [...comment.likes, { userId: updateBody.userId }] }
            }
            else {
                return comment
            }
        })
        Object.assign(post, { comments: comment });
        await post.save();
        return post;
    } else {
        console.log('else');
        const comment = post.comments.map((comment) => {
            if (comment._id == updateBody.commentId) {
                console.log(comment);
                const likeArr = comment.likes.filter((like, index, arr) => {
                    if (like.userId != updateBody.userId.toString()) {
                        return like
                    }
                })
                console.log(likeArr);
                return { ...comment, likes: likeArr }
            }
            else {
                return comment
            }
        })
        Object.assign(post, { comments: comment });
        await post.save();
        return post;
    }
};
const likeReply = async (updateBody, postId) => {
    const post = await getPostById(postId);
    if (!post) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'post not found');
    }
    const elementsIndex = post.comments.findIndex(element => element._id == updateBody.commentId)
    const replyEleIndex = post.comments[elementsIndex].reply.findIndex(element => element._id == updateBody.replyId)
    const singleReply = post.comments[elementsIndex].reply[replyEleIndex];
    if (singleReply.likes.findIndex(element => element.userId == updateBody.userId.toString()) < 0) {
        singleReply.likes.push({userId:updateBody.userId})
        await post.save()
        return post
    } else {
       const likeArr= post.comments[elementsIndex].reply[replyEleIndex].likes.filter((like)=>{
           if (like.userId!=updateBody.userId.toString()){
               return like
           }
        })
        console.log(likeArr);
        post.comments[elementsIndex].reply[replyEleIndex].likes=likeArr
        console.log(post.comments[elementsIndex].reply[replyEleIndex]);
        await post.save()
        return post
    }
}
const replyPost = async (updateBody, postId) => {
    
    const post = await getPostById(postId);
    let comment = post.comments.map((comment) => {
        if (comment._id == updateBody.commentId) {
            return { ...comment, reply: [...comment.reply, updateBody] }
        }
        else {
            return comment
        }
    })
    console.log(comment);
   
    if (!post) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'post not found');
    }
    // console.log(updateBody);
    Object.assign(post, { comments: comment });
  
    await post.save();
    return post;

};
const likePost = async (updateBody, postId) => {
    const post = await getPostById(postId);
    if (!post) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'post not found');
    }
    console.log(post.likes.filter((e) => e.userId == updateBody.userId.toString()).length > 0)
    if (!post.likes.filter((e) => e.userId == updateBody.userId.toString()).length > 0) {
        Object.assign(post, { likes: [...post.likes, updateBody] });
        await post.save();
        return post;
    } else {
        await post.updateOne({ $pull: { likes: updateBody } });
        const post1 = await Post.findById(postId)
        // Object.assign(post, { likes: [...post.likes, updateBody] });
        // await post.save();
        return post1;
    }

};

module.exports = {
    createPost,
    queryPost,
    commentPost,
    likePost,
    replyPost,
    likeComment,
    likeReply,
};