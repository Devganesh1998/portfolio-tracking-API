const router = require("express").Router();
const { body } = require("express-validator");

const tradeTypeValidator = require("../customValidators/tradeType.validator");
const tradesController = require("../controllers/trades.controller");
const protectEndpoint = require("../middlewares/protectEndpoint");

router.post(
  "/",
  [
    body("ticker_symbol").exists().bail().trim(),
    body("shares").exists(),
    body("price").exists(),
    body("tradeType").exists().bail().trim().custom(tradeTypeValidator),
  ],
  protectEndpoint,
  tradesController.addTrade
);

router.put(
  "/:trade_id",
  [body("shares").exists().bail().trim()],
  protectEndpoint,
  tradesController.updateTrade
);

router.delete("/:trade_id", protectEndpoint, tradesController.deleteTrade);

module.exports = router;
