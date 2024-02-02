const express = require('express');
const router = express.Router();
const middleware = require('../utils/middlewares');
const book_controller = require('../controllers/books.controller');

// console.log('book_controller',book_controller);
router.post('/book/add_bulk', middleware.authentication, book_controller.add_books);
// router.post('/book/add_single', middlewares.authentication, user_conroller.registration);
// router.post('/book/update_label', middlewares.authentication, user_conroller.login);

module.exports = router;