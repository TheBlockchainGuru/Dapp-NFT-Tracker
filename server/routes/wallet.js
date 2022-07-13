const express = require('express');
const router = express.Router();
const { create, wallets } = require('../controllers/wallet');

router.post('/create', create);
router.post('/wallets', wallets);
module.exports = router;