const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth');

router.post('/signup', AuthController.auth_sign_up);
router.post('/signin', AuthController.auth_sign_in);

module.exports = router;