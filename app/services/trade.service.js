const Portfolio = require("../models/portfolio.model");
const PortfolioUnit = require("../models/portfolioUnit.model");
const Trade = require("../models/trades.model");

const tradeTypes = require("../config/tradeTypes");

const updatePortfolioForBoughtSharesDeletion = async (trade, changeInShare) => {
  const portfolioUnit = await PortfolioUnit.findById(trade.portfolioUnit);
  const new_avg_buy_price =
    (portfolioUnit.average_buy_price * portfolioUnit.shares -
      trade.price * changeInShare) /
    (portfolioUnit.shares - changeInShare);
  await PortfolioUnit.findByIdAndUpdate(portfolioUnit._id, {
    $set: {
      average_buy_price: new_avg_buy_price,
      shares: portfolioUnit.shares - changeInShare,
    },
  });
};

const updatePortfolioForSoldSharesDeletion = async (trade, changeInShare) => {
  const portfolioUnit = await PortfolioUnit.findById(trade.portfolioUnit);
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
  portfolioUnit,
  price,
  shares_bought
) => {
  try {
    price = Number(price);
    shares_bought = Number(shares_bought);
    const new_avg_buy_price =
      (portfolioUnit.average_buy_price * portfolioUnit.shares +
        price * shares_bought) /
      (shares_bought + portfolioUnit.shares);
    console.log(portfolioUnit, shares_bought);
    await PortfolioUnit.findByIdAndUpdate(portfolioUnit._id, {
      $set: {
        average_buy_price: new_avg_buy_price,
        shares: shares_bought + portfolioUnit.shares,
      },
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// Updating the portfolio when trades are sold
const updatePortfolioForSharesSold = async (portfolioUnit, shares_sold) => {
  if (portfolioUnit) {
    await PortfolioUnit.findByIdAndUpdate(portfolioUnit._id, {
      $set: {
        shares: portfolioUnit.shares - shares_sold,
      },
    });
  } else {
    throw new Error("portfolioUnit_not_found");
  }
  return true;
};

const getTradeByIdWithValidation = async (trade_id) => {
  if (trade_id.length != 24) {
    throw new Error("Insufficient_id_length");
  }
  const trade = await Trade.findById(trade_id);
  if (trade === null) {
    throw new Error("Invalid_trade_id");
  }
  return trade;
};

exports.addTrade = async (
  portfolio_id,
  ticker_symbol,
  shares,
  price,
  tradeType
) => {
  const portfolioUnit = await PortfolioUnit.findOne({
    portfolio: portfolio_id,
    ticker_symbol: ticker_symbol,
  });

  if (portfolioUnit) {
    // checking if available Shares is less than requested trade-shares to sell
    if (tradeType === tradeTypes.enum.SELL) {
      if (portfolioUnit.shares < shares) {
        throw new Error("Not_enough_shares");
      }
    }
    const trade = await Trade.create({
      portfolio: portfolio_id,
      portfolioUnit: portfolioUnit._id,
      ticker_symbol: ticker_symbol,
      price: price,
      shares: shares,
      type: tradeType,
    });
    if (tradeType === tradeTypes.enum.BUY) {
      await updatePortfolioForSharesBought(portfolioUnit, price, shares);
    } else if (tradeType === tradeTypes.enum.SELL) {
      await updatePortfolioForSharesSold(portfolioUnit, shares);
    }
    return trade;
  } else {
    if (tradeType === tradeTypes.enum.SELL) {
      throw new Error("Not_enough_shares");
    }
    const portfolioUnit = await PortfolioUnit.create({
      portfolio: portfolio_id,
      ticker_symbol: ticker_symbol,
      average_buy_price: price,
      shares: shares,
      type: tradeType,
    });
    const trade = await Trade.create({
      portfolio: portfolio_id,
      portfolioUnit: portfolioUnit._id,
      ticker_symbol: ticker_symbol,
      price: price,
      shares: shares,
      type: tradeType,
    });
    return trade;
  }
};

exports.updateTrade = async (trade_id, newShares) => {
  const trade = await getTradeByIdWithValidation(trade_id);
  let changeInShare = newShares - trade.shares;
  if (trade.type === tradeTypes.enum.BUY) {
    if (changeInShare > 0) {
      // when the updated share is greater than previous it is similar to placing trades
      const portfolioUnit = await PortfolioUnit.findById(trade.portfolioUnit);
      await updatePortfolioForSharesBought(
        portfolioUnit,
        trade.price,
        changeInShare
      );
    } else if (changeInShare < 0) {
      changeInShare = Math.abs(changeInShare);
      // when the updated share is smaller than previous it reduces the average buy price
      await updatePortfolioForBoughtSharesDeletion(trade, changeInShare);
    }
    await Trade.findByIdAndUpdate(trade._id, {
      $set: { shares: newShares },
    });
  } else if (trade.type === tradeTypes.enum.SELL) {
    //using change in share to update the total share of ticker for user, because unchanged shares are already Sold.
    await updatePortfolioForSoldSharesDeletion(trade, changeInShare);
    await Trade.findByIdAndUpdate(trade._id, {
      $set: { shares: newShares },
    });
  }
  return true;
};

exports.deleteTrade = async (trade_id) => {
  const trade = await getTradeByIdWithValidation(trade_id);
  if (trade.type === tradeTypes.enum.BUY) {
    await updatePortfolioForBoughtSharesDeletion(trade, trade.shares);
  } else if (trade.type === tradeTypes.enum.SELL) {
    await updatePortfolioForSoldSharesDeletion(trade, trade.shares);
  }
  await Trade.findByIdAndRemove(trade._id);
  return true;
};
