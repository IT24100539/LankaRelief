const mongoose = require('mongoose');
const { DISTRICTS } = require('../utils/districts');
const {
  NOTICE_CATEGORIES,
  NOTICE_STATUSES,
  URGENCY_LEVELS,
} = require('../utils/enums');

const emergencyNoticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  district: { type: String, required: true, enum: DISTRICTS },
  category: {
    type: String,
    required: true,
    enum: NOTICE_CATEGORIES,
  },
  message: { type: String, required: true },
  severity: { type: String, required: true, enum: URGENCY_LEVELS },
  status: { type: String, default: 'Active', enum: NOTICE_STATUSES },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('EmergencyNotice', emergencyNoticeSchema);
