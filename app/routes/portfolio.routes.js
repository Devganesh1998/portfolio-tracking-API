const router = require("express").Router();
const { body } = require("express-validator");

const portfolioController = require("../controllers/portfolio.controller");

router.post(
  "/get",
  [
    body("email").exists().bail().isEmail().bail().trim(),
  ],
  portfolioController.fetchPortfolio
);

router.post(
  "/gethol",
  [
    body("email").exists().bail().isEmail().bail().trim(),
  ],
  portfolioController.fetchHoldings
);

router.post(
  "/getre",
  [
    body("email").exists().bail().isEmail().bail().trim(),
  ],
  portfolioController.fetchReturns
);

module.exports = router;
