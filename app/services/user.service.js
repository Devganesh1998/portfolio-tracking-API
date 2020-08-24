const User = require("../models/user.model");
const bcrypt = require("bcrypt");

exports.createUser = async (name, email, password) => {
  if (await User.isEmailTaken(email)) {
    throw new Error("email_already_taken");
  }
  let user;  
  bcrypt.hash(password, 10, function (err, hash) {
    if (err) {
        console.error(err);
        throw new Error("Hashing failed")
    }
    user = await User.create({ name, email, hash });
  });
  return user;
};

exports.validateUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    return user.isPasswordMatch(password);
  } catch (error) {
    console.error(error);
  }
};
