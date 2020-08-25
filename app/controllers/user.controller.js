const { validationResult } = require("express-validator");
let jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userService = require("../services/user.service");
const redis = require("../../redisInstance");

const expirationSeconds = 60 * 60 * 3;

const setCookieJWT = async (res, payload) => {
  const auth_token = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: expirationSeconds,
  });
  const auth_hash = await bcrypt.hash(payload.email, 1);
  res.cookie("smallcaseSessionId", auth_hash, {
    maxAge: expirationSeconds * 1000,
    httpOnly: true,
    // secure: true,
    // domain: "devganesh.tech",
    // sameSite: true,
  });
  return { auth_hash: auth_hash, auth_token: auth_token };
};

exports.register = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      errormsg: "Please send required Details",
      "Required fields": ["email", "password", "name"],
      "sample Format": {
        email: "TestEmail@mail.com",
        password: "testPassword",
        name: "testName",
      },
    });
  }

  const resData = {};
  userService
    .createUser(name, email, password)
    .then((user) => {
      const payload = {
        email: email,
        name: name,
      };
      resData.user = user;
      return setCookieJWT(res, payload);
    })
    .then((result) => {
      const { auth_hash, auth_token } = result;
      redis.client.setex(
        auth_hash,
        expirationSeconds,
        auth_token,
        (err, reply) => {
          if (err) {
            console.log(err);
            res.status(200).json({
              errorMsg: "Session not being maintained, Please Login again",
              isRegisterSuccess: true,
              user: resData.user,
            });
          } else {
            res.send({ isRegisterSuccess: true, user: resData.user });
          }
        }
      );
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "email_already_taken") {
        res.status(400).json({
          errMsg: "Given Mail is already Taken by another user",
          isRegisterSuccess: false,
        });
      } else {
        res
          .status(500)
          .json({ errMsg: "Internal Server errror", isRegisterSuccess: false });
      }
    });
};

exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      errormsg: "Please send required Details",
      "Required fields": ["email", "password"],
      "sample Format": {
        email: "TestEmail@mail.com",
        password: "testPassword",
      },
    });
  }

  userService
    .validateUser(email, password)
    .then((result) => {
      const payload = {
        email: email,
      };
      console.log(result);
      if (!result) {
        throw new Error("login_failed");
      }
      return setCookieJWT(res, payload);
    })
    .then((result) => {
      const { auth_hash, auth_token } = result;
      redis.client.setex(
        auth_hash,
        expirationSeconds,
        auth_token,
        (err, reply) => {
          if (err) {
            console.log(err);
            res.status(200).json({
              errorMsg: "Session not being maintained, Please Login again",
              isLoginSuccess: true,
            });
          } else {
            res.send({ isLoginSuccess: true });
          }
        }
      );
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "login_failed") {
        res
          .status(400)
          .json({ isLoginSuccess: false, errMsg: "Invalid email or password" });
      } else {
        res.status(500).json({ errMsg: "Internal Server errror" });
      }
    });
};

exports.logout = async (req, res) => {
  try {
    const smallcaseSessionId = req.cookies.smallcaseSessionId;

    if (smallcaseSessionId === null || smallcaseSessionId === undefined) {
      res.send({
        msg: "Session already Expired",
        isLogoutSuccess: true,
      });
    } else {
      res.cookie("smallcaseSessionId", "", {
        maxAge: 0,
        httpOnly: true,
        // secure: true,
        // domain: "devganesh.tech",
        // sameSite: true,
      });

      const temp = await redis.delWithPromise(smallcaseSessionId);
      res.send({
        isLogoutSuccess: true,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errMsg: "Internal Server errror" });
    res.send();
  }
};
