const Portfolio = require("../models/portfolio.model");
const PortfolioUnit = require("../models/portfolioUnit.model");
const Trade = require("../models/trades.model");

const tradeTypes = require("../config/tradeTypes");

const updatePortfolioForBoughtSharesDeletion = async (trade, changeInShare) => {
  const portfolioUnit = await PortfolioUnit.find({
    portfolio: trade.portfolio,
    ticker_symbol: trade.ticker_symbol,
  });
  const new_avg_buy_price =
    (portfolioUnit.average_buy_price * portfolioUnit.shares -
      100 * changeInShare) /
      portfolioUnit.shares -
    changeInShare;
  await PortfolioUnit.findByIdAndUpdate(portfolioUnit._id, {
    $set: {
      average_buy_price: new_avg_buy_price,
      shares: portfolioUnit.shares - changeInShare,
    },
  });
};

const updatePortfolioForSoldSharesDeletion = async (trade, changeInShare) => {
  const portfolioUnit = await PortfolioUnit.find({
    portfolio: trade.portfolio,
    ticker_symbol: trade.ticker_symbol,
  });
  // when tries to sell more than shares User has
  if (portfolioUnit.shares < changeInShare) {
    throw new Error("Not_enough_shares");
  }
  await PortfolioUnit.findByIdAndUpdate(portfolioUnit._id, {
    $set: {
      shares: portfolioUnit.shares - changeInShare,
    },
  });
};

// Updating the portfolio when new trades are bought
const updatePortfolioForSharesBought = async (
  portfolio_id,
  ticker_symbol,
  shares_bought
) => {
  try {
    const portfolioUnit = await PortfolioUnit.find({
      portfolio: portfolio_id,
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
        portfolio: portfolio_id,
        ticker_symbol: ticker_symbol,
        shares: shares_bought,
        average_buy_price: 100,
      });
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// Updating the portfolio when trades are sold
const updatePortfolioForSharesSold = async (
  portfolio_id,
  ticker_symbol,
  shares_sold
) => {
  try {
    const portfolioUnit = await PortfolioUnit.find({
      portfolio: portfolio_id,
      ticker_symbol: ticker_symbol,
    });
    if (!portfolioUnit.length) {
      await PortfolioUnit.findByIdAndUpdate(portfolioUnit._id, {
        $set: {
          shares: portfolioUnit.shares - shares_sold,
        },
      });
    } else {
      throw new Error("portfolioUnit_not_found");
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

exports.addTrade = async (portfolio_id, ticker_symbol, shares, tradeType) => {
  try {
    // checking if available Shares is less than requested trade-shares to sell
    if (tradeType === tradeTypes.enum.SELL) {
      const portfolioUnit = await PortfolioUnit.find({
        portfolio: portfolio_id,
        ticker_symbol: ticker_symbol,
      });
      if (portfolioUnit.shares < shares) {
        throw new Error("Not_enough_shares");
      }
    }
    const trade = await Trade.create({
      portfolio: portfolio_id,
      ticker_symbol: ticker_symbol,
      price: 100,
      shares: shares,
      type: tradeType,
    });
    if (tradeType === tradeTypes.enum.BUY) {
      await updatePortfolioForSharesBought(portfolio_id, ticker_symbol, shares);
    } else if (tradeType === tradeTypes.enum.SELL) {
      await updatePortfolioForSharesSold(portfolio_id, ticker_symbol, shares);
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

exports.updateTrade = async (trade, newShares) => {
  try {
    const changeInShare = newShares - trade.shares;
    if (trade.type === tradeTypes.enum.BUY) {
      const resultTrade = await Trade.findByIdAndUpdate(trade._id, {
        $set: { shares: newShares },
      });
      if (changeInShare > 0) {
        // when the updated share is greater than previous it is similar to placing trades
        await updatePortfolioForSharesBought(
          trade.portfolio,
          trade.ticker_symbol,
          newShares
        );
      } else if (changeInShare < 0) {
        // when the updated share is smaller than previous it reduces the average buy price
        await updatePortfolioForBoughtSharesDeletion(trade, changeInShare);
      }
    } else if (trade.type === tradeTypes.enum.SELL) {
      //using change in share to update the total share of ticker for user, because unchanged shares are already Sold.
      await updatePortfolioForSoldSharesDeletion(trade, changeInShare);
      await Trade.findByIdAndUpdate(trade._id, {
        $set: { shares: newShares },
      });
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

exports.deleteTrade = async (trade) => {
  try {
    if (trade.type === tradeTypes.enum.BUY) {
      await updatePortfolioForBoughtSharesDeletion(trade, trade.shares);
    } else if (trade.type === tradeTypes.enum.SELL) {
      await updatePortfolioForSoldSharesDeletion(trade, trade.shares);
    }
    await Trade.findByIdAndRemove(trade._id);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
