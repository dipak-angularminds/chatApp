const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { private, paginate, softDelete } = require('./plugins');
const { roles } = require('../config/roles');

const postSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        caption: {
            type: String,
            max: 500,
        },
        location:{
            type: String,
            max: 500,
        },
        img: {
            type: Array,
            default: []
        },
        likes: {
            type: Array,
            default: [],
        },
        savedBy: {
            type: Array,
            default: [],
        },
        comments: [
            {
                comment: {
                    type: String
                },
                commentBy:
                {
                    type: mongoose.Types.ObjectId,
                    ref: "User",                 
                },
               likes:{
                   type: Array,
                   default: [],
                }, 
                
                time: { type: Date, default: Date.now },
                 reply: [
                    {
                        reply: {
                            type: String
                        },
                        replyBy:
                        {
                            type: mongoose.Types.ObjectId,
                            ref: "User",
                        },
                        likes: {
                             type: Array,
                             default: [],
                         },

                        time: { type: Date, default: Date.now }
                    }]
            }]
        // 
    },
    { timestamps: true }
);


postSchema.plugin(softDelete);
postSchema.plugin(private);
postSchema.plugin(paginate);

module.exports = mongoose.model("Post", postSchema);
