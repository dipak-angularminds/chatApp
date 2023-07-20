const httpStatus = require("http-status");
const { Post } = require("../models");
const { User, Organization } = require("../models");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");

/**
 * Create an organization
 * @param {Object} orgBody
 * @returns {Promise<User>}
 */
const createOrg = async (orgBody) => {
  if (await Organization.isEmailTaken(orgBody.email)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Organization already exists with this email"
    );
  }
  return Organization.create({ ...orgBody, name: orgBody.company });
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User already exists with this email"
    );
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};
const getPostById = async (id) => {
  return Post.findById(id);
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({
    email,
  });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User already exists with this email"
    );
  }
  console.log(updateBody);
  Object.assign(user, updateBody);
  await user.save();
  return user;
};
const updateProfileById = async (userId, updateBody) => {
  console.log(userId);
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  console.log(updateBody);
  Object.assign(user, { profilePicture: updateBody });
  await user.save();
  return user;
};

/**
 * Update organization by id
 * @param {ObjectId} orgId
 * @param {Object} updateBody
 * @returns {Promise<Organization>}
 */
const updateOrgById = async (orgId, updateBody) => {
  const org = await Organization.findById(orgId);
  if (!org) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Organization not found");
  }
  if (
    updateBody.email &&
    (await Organization.isEmailTaken(updateBody.email, orgId))
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Organization already exists with this email"
    );
  }
  Object.assign(org, updateBody);
  await org.save();
  return org;
};
const savePost = async (updateBody, userId) => {
  const user = await getUserById(userId);
  // const post1 = await Post.findById(updateBody.postId)

  // const post=await Post.findByIdAndUpdate(updateBody.postId, { $set:{saved: !post1.saved }})
  // const post2 = await Post.findById(updateBody.postId)

  // // await post.save()
  //  return post2
  // console.log(post);
  const post = await getPostById(updateBody.postId);
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "post not found");
  }
  console.log(
    post.savedBy.filter((e) => e.userId == updateBody.userId.toString())
      .length > 0
  );
  if (
    !post.savedBy.filter((e) => e.userId == updateBody.userId.toString())
      .length > 0
  ) {
    Object.assign(post, {
      savedBy: [...post.savedBy, { userId: updateBody.userId }],
    });
    await post.save();
    //  return post;
  } else {
    await post.updateOne({ $pull: { savedBy: { userId: updateBody.userId } } });
    const post1 = await Post.findById(updateBody.postId);
    // Object.assign(post, { likes: [...post.likes, updateBody] });
    await post.save();
    //  return post1;
  }

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  if (
    !user.bookmark.filter((e) => e.postId == updateBody.postId.toString())
      .length > 0
  ) {
    Object.assign(user, {
      bookmark: [...user.bookmark, { postId: updateBody.postId }],
    });
    await user.save();
    return user;
  } else {
    await user.updateOne({
      $pull: { bookmark: { postId: updateBody.postId } },
    });
    const user1 = await User.findById(userId);
    // Object.assign(post, { likes: [...post.likes, updateBody] });
    // await post.save();
    return user1;
  }
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  await user.delete();
  return user;
};
const changePassword = async (updateBody, userId) => {
  const oldData = await User.findById({ _id: userId });

  if (!oldData) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  const validPassword = await bcrypt.compare(
    updateBody.oldPassword,
    oldData.password
  );
  if (validPassword) {
    const salt = await bcrypt.genSalt(12);
    const password = await bcrypt.hash(updateBody.password, salt);

    const user = await User.findByIdAndUpdate(userId, {
      password: password,
    });
    return user;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "old password does not match");
  }

  // const user1 = await User.findById(req.params.id);
};

module.exports = {
  createUser,
  createOrg,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  updateOrgById,
  deleteUserById,
  updateProfileById,
  savePost,
  changePassword,
};
