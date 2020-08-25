exports.inList = ["buy", "sell"];

const tradeTypes = {
  BUY: "buy",
  SELL: "sell"
};

Object.freeze(tradeTypes);

exports.enum = tradeTypes;
