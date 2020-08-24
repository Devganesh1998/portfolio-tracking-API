const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const portfolioUnitSchema = mongoose.Schema(
  {
    portfolio: { type: Schema.Types.ObjectId, ref: "Portfolio" },
    ticker_symbol: {
        type: String,
        required: true,
        index: true,
        trim: true,
        uppercase: true,
    },
    average_buy_price: {
      type: Number,
      required: true,
    },
    shares: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const PortfolioUnit = mongoose.model("PortfolioUnit", portfolioUnitSchema);

module.exports = PortfolioUnit;
