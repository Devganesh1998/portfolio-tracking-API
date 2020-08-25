const TradeTypes = require("../config/tradeTypes");

module.exports = function (value) {
  if (TradeTypes.inList.indexOf(value) === -1) {
    throw new Error("Trade types does not match with given options");
  }
  return true;
};
