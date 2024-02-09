const express = require('express');
const router = express.Router();
const middleware = require('../utils/middlewares');
const book_controller = require('../controllers/books.controller');
const purchase_history_controller = require('../controllers/purchase_history.controller');

router.post('/book/add', middleware.authentication, book_controller.add_books);
router.put('/book/update', middleware.authentication, book_controller.update_book);
router.post('/book/get', middleware.authentication, book_controller.get_books_list);
router.delete('/book/delete', middleware.authentication, book_controller.delete_book);

router.post('/book/purchase', middleware.authentication, book_controller.purchase_book);
// router.post('book/return', middleware.authentication, purchase_history_controller.return_books);
router.get('/book/purchase_history', middleware.authentication, purchase_history_controller.get_purchase_history_data);


module.exports = router;