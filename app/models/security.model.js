const mongoose = require("mongoose");

const securitySchema = mongoose.Schema(
  {
    ticker_symbol: {
      type: String,
      required: true,
      index: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    current_price: {
      type: Number,
      default: 100,
    }
  },
  {
    timestamps: true,
  }
);

const Security = mongoose.model("Security", securitySchema);

module.exports = Security;
