const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const portfolioService = require("./portfolio.service");

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
    const portfolio = await portfolioService.createPortfolio(name);
    user = await User.create({ name: name, email: email, password: hash, portfolio: portfolio._id });
  });
  return user;
};

exports.validateUser = async (email, password) => {
  try {
    const user = await User.findOne({ email: email });
    return user.isPasswordMatch(password);
  } catch (error) {
    console.error(error);
  }
};

exports.getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({email: email});
    return user;
  } catch (error) {
    console.error(error);
  }
}