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
    portfolio.units = portfolioUnits;
    portfolio.trades = trades;
    return portfolio;
  } catch (error) {
    console.error(error);
    return false;
  }
};

exports.fetchHoldings = async (portfolio_id) => {
  try {
    const [portfolio, portfolioUnits] = await Promise.all([
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
    portfolio.units.total_avg_buy_price =
      portfolioUnits.total_amount_invested / portfolioUnits.total_shares;
    portfolio.units = portfolioUnits;
    return portfolio;
  } catch (error) {
    console.error(error);
    return false;
  }
};
