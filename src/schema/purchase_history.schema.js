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
  purchase_id: {
    required: true,
    type: String,
    unique: true
  },
  total_bill_discount: { type: Number, required: false, default: 0 },
  sale_info: [{
    unit_price: { required: true, type: Number },
    title: { required: false, type: String },
    authors: { required: false, type: [String] },
    book_id: { type: String, default: null},
    discount: { type: mongoose.Types.Decimal128, required: false, default: 0 },
    quantity: { required: true, type: Number },
    total_price_without_discount: { required: true, type: Number },
    total_price_with_discount: { required: true, type: Number }
  }],
  book_id: [{
    type: String,
    default: null
  }],
  user_id: {
    default: null,
      ref: user_model,
      type: mongoose.Schema.Types.ObjectId,
  },
  purchase_date: {
    default: Date.now,
    required: true,
    type: Date
  },
  total_bill_without_discount: {
    required: true, type: Number
  },
  total_bill_with_discount: {
    required: true, 
    type: mongoose.Types.Decimal128
  },
  is_send_email_notification: {
    type: Boolean,
    required: true,
    default: false
  }
});

const purchase_history_model = mongoose.model('purchase_histories', schema);

module.exports = purchase_history_model;