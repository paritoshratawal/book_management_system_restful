const express = require('express');
const router = express.Router();
const middleware = require('../utils/middlewares');
const user_conroller = require('../controllers/user.controller');

router.post('/user/login', user_conroller.login);
router.post('/user/registration', user_conroller.registration);
router.get('/user/all', middleware.authentication, user_conroller.get_users);
router.post('/user/add', middleware.authentication, user_conroller.registration);
router.delete('/user/delete', middleware.authentication, user_conroller.delete_user);

module.exports = router;