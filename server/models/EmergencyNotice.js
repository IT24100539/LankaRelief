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

const emergencyNoticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  district: { type: String, required: true, enum: DISTRICTS },
  category: {
    type: String,
    required: true,
    enum: ['Flood', 'Landslide', 'Severe weather', 'General'],
  },
  message: { type: String, required: true },
  severity: { type: String, required: true, enum: ['High', 'Medium', 'Low'] },
  status: { type: String, default: 'Active', enum: ['Active', 'Closed'] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('EmergencyNotice', emergencyNoticeSchema);
