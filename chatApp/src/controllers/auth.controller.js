const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  authService,
  userService,
  tokenService,
  emailService,
} = require("../services");

const register = catchAsync(async (req, res) => {
  // const org = await userService.createOrg(req.body);
  let user;
  try {
    user = await userService.createUser({...req.body,
      role: "Administrator",
    });
  } catch (e) {
    // await org.remove();
    throw e;
  }
  user = await user.populate("_org", "name");
  const { token, expires } = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({
    user,
    token,
    expires,
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const { token, expires } = await tokenService.generateAuthTokens(user);
  res.send({
    user,
    token,
    expires,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user
  );
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const self = catchAsync(async (req, res) => {
  res.send(req.user);
});

const google_Login = async (req, res) => {
  const response = await authService.google_Login(req);
  res.send(response);
};
// router.post("/google_Login", async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     console.log(user);
//     if (user) {
//       const accessToken = generateAccessToken(user);
//       res.status(200).json({
//         user: user,
//         accessToken,
//         message: "login  successfully",
//       });

//     } else {
//       res.json({ status: false, error: "user not found" });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// });

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  self,
  google_Login,
};
