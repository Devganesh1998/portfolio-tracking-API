const router = require("express").Router();

const portfolioController = require("../controllers/portfolio.controller");
const protectEndpoint = require("../middlewares/protectEndpoint");

router.get(
  "/",
  protectEndpoint,
  portfolioController.fetchPortfolio
);

router.get(
  "/holdings",
  protectEndpoint,
  portfolioController.fetchHoldings
);

router.get(
  "/returns",
  protectEndpoint,
  portfolioController.fetchReturns
);

module.exports = router;
