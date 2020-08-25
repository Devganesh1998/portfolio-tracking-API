const router = require("express").Router();
const { body } = require("express-validator");

const tradeTypeValidator = require("../customValidators/tradeType.validator");
const tradesController = require("../controllers/trades.controller");

router.post(
  "/",
  [
    body("email").exists().bail().isEmail().bail().trim(),
    body("ticker_symbol").exists().bail().trim(),
    body("shares").exists(),
    body("price").exists(),
    body("tradeType").exists().bail().trim().custom(tradeTypeValidator),
  ],
  tradesController.addTrade
);

router.put(
  "/:trade_id",
  [
    body("email").exists().bail().isEmail().bail().trim(),
    body("shares").exists().bail().trim(),
  ],
  tradesController.updateTrade
);

router.delete("/:trade_id", tradesController.deleteTrade);

module.exports = router;
