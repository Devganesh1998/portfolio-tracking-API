const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    portfolio: {
      type: Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// To Check if email is taken
userSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email });
  return !!user;
};

// To validate the hased password
userSchema.methods.isPasswordMatch = async function (password) {
  try {
    const user = this;
    result = await bcrypt.compare(password, user.password);
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
