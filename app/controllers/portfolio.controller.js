const PortfolioService = require("../services/portfolio.service");
const UserService = require("../services/user.service");

exports.fetchPortfolio = (req, res) => {
  const email = req.user.email;

  let resData = {};
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
  const email = req.user.email;

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
  const email = req.user.email;

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
