const mongoose = require("mongoose");

const { private, paginate, softDelete } = require("./plugins");
const MessageSchema = mongoose.Schema(
  {
    message: {
      type: String,
    },
    _org: {
      type: mongoose.Types.ObjectId,
      ref: "organizations",
    },
    _byUserId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    _forUserId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

MessageSchema.plugin(softDelete);
MessageSchema.plugin(private);
MessageSchema.plugin(paginate);

/**
 * @typedef Message
 */
const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
