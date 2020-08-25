const { validationResult } = require("express-validator");

const PortfolioService = require("../services/portfolio.service");
const UserService = require("../services/user.service");

exports.fetchPortfolio = (req, res) => {
  const email = req.body.email;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      errormsg: "Please send required Details",
      "Required fields": ["email"],
      "sample Format": {
        email: "TestEmail@mail.com",
      },
    });
  }

  const resData = {};
  UserService.getUserByEmail(email)
    .then((user) => {
      resData.user = user;
      return PortfolioService.fetchPortfolio(user.portfolio);
    })
    .then((portfolio) => {
      resData = {
        ...resData,
        ...portfolio,
      };
      res.send(resData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ errMsg: "Internal Server errror" });
    });
};

exports.fetchHoldings = (req, res) => {
  const email = req.body.email;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      errormsg: "Please send required Details",
      "Required fields": ["email"],
      "sample Format": {
        email: "TestEmail@mail.com",
      },
    });
  }

  const resData = {};
  UserService.getUserByEmail(email)
    .then((user) => {
      resData.user = user;
      return PortfolioService.fetchHoldings(user.portfolio);
    })
    .then((holdings) => {
      resData.holdings = holdings;
      res.send(resData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ errMsg: "Internal Server errror" });
    });
};

exports.fetchReturns = (req, res) => {
  const email = req.body.email;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      errormsg: "Please send required Details",
      "Required fields": ["email"],
      "sample Format": {
        email: "TestEmail@mail.com",
      },
    });
  }

  const resData = {};
  UserService.getUserByEmail(email)
    .then((user) => {
      resData.user = user;
      return PortfolioService.fetchReturns(user.portfolio);
    })
    .then((returns) => {
      resData.returns = returns;
      res.send(resData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ errMsg: "Internal Server errror" });
    });
};
