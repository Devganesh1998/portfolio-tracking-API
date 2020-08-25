const { validationResult } = require("express-validator");

const TradeService = require("../services/trade.service");
const UserService = require("../services/user.service");
const TradeTypes = require("../config/tradeTypes");

exports.addTrade = (req, res) => {
  const email = req.user.email;
  const ticker_symbol = req.body.ticker_symbol;
  const shares = req.body.shares;
  const price = req.body.price;
  const tradeType = req.body.tradeType;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      errormsg: "Please send required Details",
      "Required fields": ["ticker_symbol", "shares", "price", "tradeType"],
      "sample Format": {
        ticker_symbol: "testTicketSymbol",
        shares: 12,
        price: 200,
        tradeType: "buy",
      },
      TradeTypes: TradeTypes.inList,
    });
  }

  let resData = {};
  UserService.getUserByEmail(email)
    .then((user) => {
      if (user === null || user === undefined) {
        throw new Error("no_user_found_with_given_mail");
      }
      resData.user = user;
      return TradeService.addTrade(
        user.portfolio,
        ticker_symbol,
        shares,
        price,
        tradeType
      );
    })
    .then((result) => {
      let msg = result ? "Trade Added Successfully" : "Please try again, later";
      res.send({ isAdded: result != null, trade: result, msg: msg });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Not_enough_shares") {
        res.status(400).json({
          isAdded: false,
          errMsg: "Not Enough share in portfolio to sell",
        });
      } else if (err.message === "portfolioUnit_not_found") {
        res.status(400).json({
          isAdded: false,
          errMsg: "Please send the Correct details of ticker_symbol",
        });
      } else if (err.message === "no_user_found_with_given_mail") {
        res.status(400).json({
          isAdded: false,
          errMsg: "No user data found for the given mailId",
        });
      } else {
        res
          .status(500)
          .json({ isAdded: false, errMsg: "Internal Server errror" });
      }
    });
};

exports.updateTrade = (req, res) => {
  const email = req.user.email;
  const shares = req.body.shares;
  const trade_id = req.params.trade_id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      errormsg: "Please send required Details",
      "Required fields": ["shares"],
      "sample Format": {
        shares: 12,
      },
    });
  }

  let resData = {};
  UserService.getUserByEmail(email)
    .then((user) => {
      if (user === null || user === undefined) {
        throw new Error("no_user_found_with_given_mail");
      }
      resData.user = user;
      return TradeService.updateTrade(trade_id, shares);
    })
    .then((result) => {
      let msg = result
        ? "Trade updated Successfully"
        : "Please try again, later";
      res.send({ isUpdated: result != null, msg: msg });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Invalid_trade_id") {
        res.status(400).json({ isUpdated: false, errMsg: "Invalid tradeId" });
      } else if (err.message === "Insufficient_id_length") {
        res.status(400).json({
          isUpdated: false,
          errMsg:
            "Trade_id sent must be a single String of 12 bytes or a string of 24 hex characters",
        });
      } else if (err.message === "Not_enough_shares") {
        res.status(400).json({
          isUpdated: false,
          errMsg: "Not Enough share in portfolio to sell",
        });
      } else if (err.message === "no_user_found_with_given_mail") {
        res.status(400).json({
          isUpdated: false,
          errMsg: "No user data found for the given mailId",
        });
      } else {
        res
          .status(500)
          .json({ isUpdated: false, errMsg: "Internal Server errror" });
      }
    });
};

exports.deleteTrade = (req, res) => {
  const trade_id = req.params.trade_id;

  console.log(trade_id.length);
  TradeService.deleteTrade(trade_id)
    .then((result) => {
      let msg = result
        ? "Trade deleted Successfully"
        : "Please try again, later";
      res.send({ isTradeDeleted: result, msg: msg });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Invalid_trade_id") {
        res
          .status(400)
          .json({ isTradeDeleted: false, errMsg: "Invalid tradeId" });
      } else if (err.message === "Insufficient_id_length") {
        res.status(400).json({
          isTradeDeleted: false,
          errMsg:
            "Trade_id sent must be a single String of 12 bytes or a string of 24 hex characters",
        });
      } else {
        res
          .status(500)
          .json({ isTradeDeleted: false, errMsg: "Internal Server errror" });
      }
    });
};
