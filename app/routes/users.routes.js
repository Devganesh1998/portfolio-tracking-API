const router = require("express").Router();
const { body } = require("express-validator");

const userController = require("../controllers/user.controller");

router.post(
  "/register",
  [
    body("email").exists().bail().isEmail().bail().trim(),
    body("name").exists().bail().trim(),
    body("password").exists().bail().trim(),
  ],
  userController.register
);

router.post(
  "/login",
  [
    body("email").exists().bail().isEmail().bail().trim(),
    body("password").exists().bail().trim(),
  ],
  userController.login
);

module.exports = router;
