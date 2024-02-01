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
  role: {
    required: true,
    type: String
  },
  access: [
    {
      required: true,
      type: String
    }
  ]
});

const role_model = mongoose.model('roles', schema);

module.exports = role_model;