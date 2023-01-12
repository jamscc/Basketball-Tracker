const homeRt = require('./homeRoutes.js');
const apiRt = require('./api');
const router = require('express').Router();

router.use('/', homeRt);
router.use('/api', apiRt);

module.exports = router;