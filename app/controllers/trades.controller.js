const { validationResult } = require("express-validator");

const TradeService = require("../services/trade.service");
const UserService = require("../services/user.service");
const TradeTypes = require("../config/tradeTypes");

exports.addTrade = (req, res) => {
  const email = req.body.email;
  const ticker_symbol = req.body.ticker_symbol;
  const shares = req.body.shares;
  const tradeType = req.body.tradeType;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      errormsg: "Please send required Details",
      "Required fields": ["email", "ticker_symbol", "shares", "tradeType"],
      "sample Format": {
        email: "TestEmail@mail.com",
        ticker_symbol: "testTicketSymbol",
        shares: 12,
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
        Number(shares),
        tradeType
      );
    })
    .then((result) => {
      let msg = result ? "Trade Added Successfully" : "Please try again, later";
      res.send({ isAdded: result, msg: msg });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Not_enough_shares") {
        res
          .status(400)
          .json({ errMsg: "Not Enough share in portfolio to sell" });
      } else if (err.message === "portfolioUnit_not_found") {
        res
          .status(400)
          .json({ errMsg: "Please send the Correct details of ticker_symbol" });
      } else if (err.message === "no_user_found_with_given_mail") {
        res.status(400).json({ errMsg: "No user data found for the given mailId" });
      } else {
        res.status(500).json({ errMsg: "Internal Server errror" });
      }
    });
};

exports.updateTrade = (req, res) => {
  const ticker_symbol = req.params.ticker_symbol;
  const shares = req.body.shares;
  const email = req.body.email;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      errormsg: "Please send required Details",
      "Required fields": ["shares"],
      "sample Format": {
        shares: "12",
      },
    });
  }
};

exports.deleteTrade = (req, res) => {
  const ticker_symbol = req.params.ticker_symbol;
};
