const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tradeTypes = require("../config/tradeTypes");

const tradeSchema = mongoose.Schema(
  {
    portfolio: { type: Schema.Types.ObjectId, ref: "Portfolio" },
    ticker_symbol: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      required: true,
      enum: tradeTypes.inList,
    },
    price: {
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

tradeSchema.index({ portfolio: 1 });

const Trade = mongoose.model("Trade", tradeSchema);

module.exports = Trade;
