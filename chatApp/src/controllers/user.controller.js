const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose')
const {
  userService
} = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser({
    _org: req.user._org,
    ...req.body
  });
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, {
    ...options,
    populate: [{
      path: "_org",
      select: "_id name email"
    }]
  });
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await (await userService.getUserById(req.params.userId))
    .populate("_org", "_id name email");
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(req.user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.user._id, req.body) 
  res.send(user);
});

const updateOrg = catchAsync(async (req, res) => {
  const org = await userService.updateOrgById(req.params.orgId, req.body);
  res.send(org);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});
const updateProfile = catchAsync(async (req, res) => {
  const user = await userService.updateProfileById(req.user._id, req.file?req.file.path:"")
  // console.log(user)
  res.send(user);
});

const bookmarkPost=catchAsync(async (req, res) => {
  const result =  await userService.savePost({
    userId: req.user._id,
    postId: req.body.postId
    
  }, req.user._id)
  console.log(result)
  res.send(result)
})
const changePassword = catchAsync(async (req, res) => {
  const result = await userService.changePassword({
    password: req.body.password,
    oldPassword: req.body.oldPassword,
  }, req.user._id)
  console.log(result)
  res.send(result)
})
module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateOrg,
  updateProfile,
  bookmarkPost,
  changePassword
};

