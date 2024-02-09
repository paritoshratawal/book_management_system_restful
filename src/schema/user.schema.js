const mongoose = require('mongoose');
const role_model = require('./role.schema');

const schema = new mongoose.Schema({
    created: {
      at: {
        default: Date.now,
        required: true,
        type: Date,
      },
      by: {
        required: true,
        type: String,
      },
    },
    email: {
      match: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
    firstName: {
      trim: true,
      type: String,
    },
    lastName: {
      trim: true,
      type: String,
    },
    modified: {
      at: {
        type: Date,
      },
      by: {
        type: String,
      },
    },
    password: {
      trim: true,
      type: String,
    },
    // TODO: can we think of some other structure where role is not present in user table?
    userRole: {
      default: null,
      ref: role_model,
      type: mongoose.Schema.Types.ObjectId,
    },
    delete: {
      type: Boolean,
      required: false
    }
  });

const user_model = mongoose.model('users', schema);

module.exports = user_model;