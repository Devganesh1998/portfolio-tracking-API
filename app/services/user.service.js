const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const portfolioService = require("./portfolio.service");

exports.createUser = async (name, email, password) => {
  if (await User.isEmailTaken(email)) {
    throw new Error("email_already_taken");
  }

  const [hash, portfolio] = await Promise.all([
    bcrypt.hash(password, 10),
    portfolioService.createPortfolio(name),
  ]);
  const user = await User.create({
    name: name,
    email: email,
    password: hash,
    portfolio: portfolio._id,
  });
  return user;
};

exports.validateUser = async (email, password) => {
  try {
    const user = await User.findOne({ email: email });
    const result = await user.isPasswordMatch(password);
    return result;
  } catch (error) {
    console.error(error);
  }
};

exports.getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    return user;
  } catch (error) {
    console.error(error);
  }
};
