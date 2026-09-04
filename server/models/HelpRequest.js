const mongoose = require('mongoose');

const DISTRICTS = [
  'Colombo',
  'Kandy',
  'Galle',
  'Ratnapura',
  'Kalutara',
  'Matara',
  'Gampaha',
  'Kurunegala',
  'Jaffna',
  'Batticaloa',
];

const CATEGORIES = [
  'Drinking water',
  'Dry rations',
  'Cooked meals',
  'Medicine',
  'Temporary shelter',
  'Transport',
];

function isSriLankanMobile(value) {
  const normalized = String(value).replace(/\s+/g, '');
  return /^(07\d{8}|\+947\d{8})$/.test(normalized);
}

const helpRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: {
    type: String,
    required: true,
    validate: {
      validator: isSriLankanMobile,
      message: 'Please enter a valid Sri Lankan contact number',
    },
  },
  district: { type: String, required: true, enum: DISTRICTS },
  location: { type: String },
  category: { type: String, required: true, enum: CATEGORIES },
  description: { type: String, required: true },
  urgency: { type: String, required: true, enum: ['High', 'Medium', 'Low'] },
  status: { type: String, default: 'Open', enum: ['Open', 'In progress', 'Resolved'] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('HelpRequest', helpRequestSchema);
