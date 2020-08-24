const router = require('express').Router();

router.use('/trades', require('./trades.routes'));

module.exports = router;