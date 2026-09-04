const mongoose = require('mongoose');
const { DISTRICTS } = require('../utils/districts');
const {
  REQUEST_CATEGORIES,
  REQUEST_STATUSES,
  URGENCY_LEVELS,
} = require('../utils/enums');
const { sriLankanContact } = require('../utils/validators');

const helpRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: {
    type: String,
    required: true,
    validate: sriLankanContact,
  },
  district: { type: String, required: true, enum: DISTRICTS },
  location: { type: String },
  category: { type: String, required: true, enum: REQUEST_CATEGORIES },
  description: { type: String, required: true },
  urgency: { type: String, required: true, enum: URGENCY_LEVELS },
  status: { type: String, default: 'Open', enum: REQUEST_STATUSES },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('HelpRequest', helpRequestSchema);
