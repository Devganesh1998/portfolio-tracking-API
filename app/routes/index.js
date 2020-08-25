const router = require('express').Router();

router.use('/trades', require('./trades.routes'));
router.use('/users', require('./users.routes'));
router.use('/portfolio', require('./portfolio.routes'));

module.exports = router;