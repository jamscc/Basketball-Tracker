const userRt = require('./userRoutes');
const router = require('express').Router();

router.use('/users', userRt);

module.exports = router;