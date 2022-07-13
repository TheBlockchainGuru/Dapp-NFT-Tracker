const express = require('express');
const router = express.Router();
const { signup, signin, isAuth } = require('../controllers/auth');
const { verifyJWT } = require('../utils/auth');
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/isAuth', verifyJWT, isAuth);
module.exports = router;