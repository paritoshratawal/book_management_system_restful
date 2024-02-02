const user_router = require('./user.router');
const book_router = require('./book.router');

module.exports = { array : [
    user_router, 
    book_router
] };