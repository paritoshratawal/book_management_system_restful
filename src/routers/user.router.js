const express = require('express');
const router = express.Router();
const user_conroller = require('../controllers/user.controller');


router.post('/user/registration', user_conroller.registration);
router.post('/user/login', user_conroller.login);

module.exports = { user_router: router }