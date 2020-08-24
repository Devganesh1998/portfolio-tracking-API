const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tradeSchema = mongoose.Schema(
  {
    portfolio: { type: Schema.Types.ObjectId, ref: "Portfolio" },
    ticker_symbol: {
        type: String,
        required: true,
        index: true,
        trim: true,
        uppercase: true,
    },
    purchase_price: {
      type: Number,
      required: true,
    },
    shares_bought: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Trade = mongoose.model("Trade", tradeSchema);

module.exports = Trade;
