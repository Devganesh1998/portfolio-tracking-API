const Portfolio = require("../models/portfolio.model");
const PortfolioUnit = require("../models/portfolioUnit.model");
const Trade = require("../models/trades.model");

exports.createPortfolio = async (name) => {
  return await Portfolio.create({ name });
};

exports.fetchPortfolio = async (portfolio_id) => {
  try {
    const [portfolio, portfolioUnits, trades] = await Promise.all([
      Portfolio.findById(portfolio_id),
      PortfolioUnit.find({ portfolio: portfolio_id }),
      Trade.find({ portfolio: portfolio_id }),
    ]);
    const resData = { portfolio: portfolio };
    resData.portfolioUnits = portfolioUnits;
    resData.trades = trades;
    return resData;
  } catch (error) {
    console.error(error);
    return false;
  }
};

exports.fetchHoldings = async (portfolio_id) => {
  try {
    let [portfolio, portfolioUnits] = await Promise.all([
      Portfolio.findById(portfolio_id),
      PortfolioUnit.aggregate([
        { $match: { portfolio: portfolio_id } },
        {
          $group: {
            _id: null,
            total_amount_invested: {
              $sum: { $multiply: ["$average_buy_price", "$shares"] },
            },
            total_shares: { $sum: "$shares" },
          },
        },
      ]),
    ]);
    const resData = { portfolio: portfolio };
    portfolioUnits = portfolioUnits[0];
    resData.portfolioUnits = portfolioUnits;
    resData.portfolioUnits.total_avg_buy_price =
      portfolioUnits.total_amount_invested / portfolioUnits.total_shares;
    return resData;
  } catch (error) {
    console.error(error);
    return false;
  }
};

exports.fetchReturns = async (portfolio_id) => {
  try {
    const [portfolio, portfolioUnits] = await Promise.all([
      Portfolio.findById(portfolio_id),
      PortfolioUnit.aggregate([
        { $match: { portfolio: portfolio_id } },
        {
          $group: {
            _id: null,
            total_return: {
              $sum: {
                $multiply: [
                  { $subtract: [100, "$average_buy_price"] },
                  "$shares",
                ],
              },
            },
          },
        },
      ]),
    ]);
    const resData = { portfolio: portfolio };
    resData.portfolioUnits = portfolioUnits;
    return resData;
  } catch (error) {
    console.error(error);
    return false;
  }
};
