const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { messageService } = require("../services");
const io = require("../socket");
const createMessage = catchAsync(async (req, res) => {
  const message = await messageService.createMessageService(
    {
      _org: req.user._org,
      _byUserId: req.user._id,
      ...req.body,
    },
    req
  );
  io.getIO().emit("message", {
    action: "create",
    message: message,
  });
  res.status(httpStatus.CREATED).send(message);
});

const getMessage = catchAsync(async (req, res) => {
  console.log(req.user._id);
  console.log(req.params._forUserId);
  const result = await messageService.queryMessageService(req);
  res.send(result);
});

module.exports = {
  createMessage,
  getMessage,
};
