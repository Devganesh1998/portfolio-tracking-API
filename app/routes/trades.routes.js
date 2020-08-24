const router = require("express").Router();
const { body } = require("express-validator");

const tradesController = require("../controllers/trades.controller");

router.post(
  "/",
  [
    body("email").exists().bail().isEmail().bail().trim(),
    body("ticker_symbol").exists().bail().trim(),
    body("shares").exists().bail().trim(),
  ],
  tradesController.addTrade
);

router.put(
  "/:ticker_symbol",
  [body("shares").exists().bail().trim()],
  tradesController.updateTrade
);

router.delete("/:ticker_symbol", tradesController.deleteTrade);

module.exports = router;
