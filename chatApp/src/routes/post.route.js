const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const upload = require('../middlewares/upload');

const postValidation = require('../validations/post.validation');
const postController = require('../controllers/post.controller');
const auth = require('../middlewares/auth');

router.use(auth());

router.post('/', upload.array('path', 10), validate(postValidation.post), postController.createPost);

router
    .route('/')
    .post(validate(postValidation.post), postController.createPost)
    .get(validate(postValidation.getPosts), postController.getPosts);

router
    .route('/:postId')
    .patch(validate(postValidation.commentPost), postController.commentPost)
    .put(validate(postValidation.likePost), postController.likePost)

router.route('/likecomment/:postId').patch(validate(postValidation.likeComment), postController.likeComment)  

router.route('/reply/:postId').put(validate(postValidation.replyPost), postController.replyComment)
router.route('/likereply/:postId').patch(validate(postValidation.likeReply), postController.likeReply)

module.exports = router;