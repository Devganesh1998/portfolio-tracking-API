const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const portfolioUnitSchema = mongoose.Schema(
  {
    portfolio: {
      type: Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
    },
    ticker_symbol: {
      type: String,
      required: true,
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
    },
  },
  {
    timestamps: true,
  }
);

portfolioUnitSchema.index({ portfolio: 1 });

const PortfolioUnit = mongoose.model("PortfolioUnit", portfolioUnitSchema);

module.exports = PortfolioUnit;
