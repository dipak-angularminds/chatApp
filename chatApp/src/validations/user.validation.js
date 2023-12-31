const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    // lastname: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};
const changePassword = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    oldPassword: Joi.string().required().custom(password)

  })
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
      dob:Joi.string(),
      gender:Joi.string(),
      // lastname: Joi.string(),
      bio:Joi.string(),
      path: Joi.string(),
      mobNo: Joi.string()
    }).min(1),    
};
const updateOrg = {
  params: Joi.object().keys({
    orgId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      name: Joi.string(),
    })
    .min(1),
};
const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};
const bookmarkPost={
  // params: Joi.object().keys({
  //   userId: Joi.string().custom(objectId),
  // }),
  body: Joi.object()
    .keys({      
      postId: Joi.string().required()
    })
}

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateOrg,
  deleteUser,
  bookmarkPost,
  changePassword
};
