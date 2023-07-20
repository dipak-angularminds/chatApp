const httpStatus = require("http-status");
const { Message } = require("../models");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createMessageService = async (userBody, req) => {
  const chat = await Message.create(userBody);
  try {
    const messages = await Message.find({
      $or: [
        { _byUserId: chat._byUserId },
        { _forUserId: req.params._forUserId },
      ],
    });

    return messages;
  } catch (err) {
    console.error("Error fetching messages:", err);
    return [];
  }
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
const queryMessageService = async (req) => {
  try {
    const messages = await Message.find({
      $and: [
        {
          $or: [
            { _byUserId: req.user._id },
            { _forUserId: req.params._forUserId },
          ],
        },
        {
          $or: [
            { _byUserId: req.params._forUserId },
            { _forUserId: req.user._id },
          ],
        },
      ],
    });

    return messages;
  } catch (err) {
    console.error("Error fetching messages:", err);
    return [];
  }
};

module.exports = {
  createMessageService,
  queryMessageService,
};
