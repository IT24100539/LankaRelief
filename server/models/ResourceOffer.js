const mongoose = require('mongoose');
const { DISTRICTS } = require('../utils/districts');
const { OFFER_STATUSES, RESOURCE_TYPES } = require('../utils/enums');
const { sriLankanContact } = require('../utils/validators');

const resourceOfferSchema = new mongoose.Schema({
  volunteerName: { type: String, required: true },
  contact: {
    type: String,
    required: true,
    validate: sriLankanContact,
  },
  district: { type: String, required: true, enum: DISTRICTS },
  resourceType: { type: String, required: true, enum: RESOURCE_TYPES },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be greater than zero'],
  },
  notes: { type: String },
  availabilityStatus: {
    type: String,
    default: 'Available',
    enum: OFFER_STATUSES,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ResourceOffer', resourceOfferSchema);
