const mongoose = require('mongoose');
const book_model = require('./book.schema');
const user_model = require('./user.schema');
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
  purchase_id: [{
    required: true,
    type: String
  }],
  book_id: {
    default: null,
      ref: book_model,
      type: mongoose.Schema.Types.ObjectId,
  },
  user_id: {
    default: null,
      ref: user_model,
      type: mongoose.Schema.Types.ObjectId,
  },
  purchase_date: {
    required: true,
    type: Date
  }, 
  price: {
    required: true,
    type: Number
  },
  quantity: {
    required: true,
    type: Number
  }
});

const purchase_history_model = mongoose.model('purchase_histories', schema);

module.exports = purchase_history_model;