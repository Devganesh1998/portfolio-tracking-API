const Portfolio = require("../models/portfolio.model");
const PortfolioUnit = require("../models/portfolioUnit.model");
const Trade = require("../models/trades.model");

exports.createPortfolio = async (name) => {
  return await Portfolio.create({ name });
};

exports.addTrade = async (portfolio, ticker_symbol, shares_bought) => {
  try {
    const trade = await Trade.create({
      portfolio: portfolio._id,
      ticker_symbol: ticker_symbol,
      purchase_price: 100,
      shares_bought: shares_bought,
    });
    await this.updatePortfolioForNewTrades(portfolio, ticker_symbol, shares_bought);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

exports.updateTrade = async (trade, newShares) => {
  try {
    const resultTrade = await Trade.findByIdAndUpdate(trade._id, {
      $set: { shares_bought: newShares },
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

exports.updatePortfolioForNewTrades = async (portfolio, ticker_symbol, shares_bought) => {
  try {
    const portfolioUnit = await PortfolioUnit.find({
      portfolio: portfolio._id,
      ticker_symbol: ticker_symbol,
    });
    if (!portfolioUnit.length) {
      const new_avg_buy_price =
        (portfolioUnit.average_buy_price * portfolioUnit.shares +
          100 * shares_bought) /
          shares_bought +
        portfolioUnit.shares;
      await PortfolioUnit.findByIdAndUpdate(portfolioUnit._id, {
        $set: {
          average_buy_price: new_avg_buy_price,
          shares: shares_bought + portfolioUnit.shares,
        },
      });
    } else {
      await PortfolioUnit.create({
        portfolio: portfolio._id,
        ticker_symbol: ticker_symbol,
        shares: shares_bought,
        average_buy_price: 100,
      });
    }
  } catch (error) {}
};
