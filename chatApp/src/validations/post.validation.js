const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const post = {
        body: Joi.object().keys({
        caption: Joi.string().required(),
        location: Joi.string().required(),
        createdBy: Joi.string().custom(objectId),
        // path: Joi.file().required()
    }),
};
const getPosts = {
        query: Joi.object().keys({
        // name: Joi.string(),
        // role: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const commentPost={
     query: Joi.object().keys({
    //  comment: Joi.string().required()
    })
};

const replyPost = {
    query: Joi.object().keys({
        //  reply: Joi.string().required()
    })
};

const likeComment = {

    query: Joi.object().keys({
      //  reply: Joi.string().required()
    })

}

module.exports = {
    post,
    commentPost, 
    getPosts,
    replyPost,
    likeComment
    
};