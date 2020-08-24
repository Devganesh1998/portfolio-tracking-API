const { validationResult } = require("express-validator");

exports.addTrade = (req, res) => {
  const email = req.body.email;
  const ticker_symbol = req.body.ticker_symbol;
  const shares = req.body.shares;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      errormsg: "Please send required Details",
      "Required fields": ["email", "ticker_symbol", "shares"],
      "sample Format": {
        email: "TestEmail@mail.com",
        ticker_symbol: "testTicketSymbol",
        shares: "12",
      },
    });
  }
};

exports.updateTrade = (req, res) => {
  const ticker_symbol = req.params.ticker_symbol;
  const shares = req.body.shares;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      errormsg: "Please send required Details",
      "Required fields": ["shares"],
      "sample Format": {
        shares: "12",
      },
    });
  }
};

exports.deleteTrade = (req, res) => {
  const ticker_symbol = req.params.ticker_symbol;
};
