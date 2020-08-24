const { validationResult } = require("express-validator");
const userService = require("../services/user.service");

exports.register = (req, res) => {
  const email = req.body.email;
  const pasword = req.body.pasword;
  const name = req.body.name;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      errormsg: "Please send required Details",
      "Required fields": ["email", "pasword", "name"],
      "sample Format": {
        email: "TestEmail@mail.com",
        pasword: "testPassword",
        name: "testName",
      },
    });
  }

  userService
    .createUser(name, email, pasword)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === "email_already_taken") {
        res
          .status(400)
          .json({ errMsg: "Given Mail is already Taken by another user" });
      } else {
        res.status(500).json({ errMsg: "Internal Server errror" });
      }
    });
};

exports.login = (req, res) => {
  const email = req.body.email;
  const pasword = req.body.pasword;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      errormsg: "Please send required Details",
      "Required fields": ["email", "pasword"],
      "sample Format": {
        email: "TestEmail@mail.com",
        pasword: "testPassword",
      },
    });
  }

  userService
    .validateUser(email, pasword)
    .then((result) => res.send({ isAuthenticated: result }))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ errMsg: "Internal Server errror" });
    });
};
