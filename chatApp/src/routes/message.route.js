const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const userValidation = require("../validations/user.validation");
const userController = require("../controllers/user.controller");
const { messageController } = require("../controllers");

const router = express.Router();

// Token authentication for all routes defined in this file
router.use(auth());

// Routes: get users, create user
router.route("/:_forUserId").post(messageController.createMessage);
// .get(messageController.getMessage);
router.route("/:_forUserId").get(messageController.getMessage);

module.exports = router;
