const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  created: {
    at: {
      default: Date.now,
      required: true,
      type: Date
    },
    by: {
      required: true,
      type: String
    }
  },
  modified: {
    at: {
      default: Date.now,
      required: true,
      type: Date
    },
    by: {
      required: true,
      type: String
    }
  },
  book_id: {
    type: String,
    unique : true,
    required: true,
  },
  authors: [{
    type: String,
    required: true
  }],
  sell_count: {
    required: true,
    type: Number
  },
  title: {
    type: String,
    unique : true,
    required: true
  },
  description: {
    required: true,
    type: String
  }, 
  price: {
    required: true,
    type: Number
  }
});

const book_model = mongoose.model('books', schema);

module.exports = book_model;