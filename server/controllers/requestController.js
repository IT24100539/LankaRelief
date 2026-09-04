const mongoose = require('mongoose');
const HelpRequest = require('../models/HelpRequest');

const FILTERS = ['district', 'category', 'urgency', 'status'];
const STATUSES = ['Open', 'In progress', 'Resolved'];

const FIELD_MESSAGES = {
  name: 'Please enter your name',
  contact: 'Please enter a valid Sri Lankan contact number',
  district: 'Please select a district',
  category: 'Please select a category',
  description: 'Please enter a description',
  urgency: 'Please select an urgency level',
  status: 'Please select a valid status',
};

const REQUIRED_FIELDS = [
  ['name', 'Please enter your name'],
  ['contact', 'Please enter a contact number'],
  ['district', 'Please select a district'],
  ['category', 'Please select a category'],
  ['urgency', 'Please select an urgency level'],
  ['description', 'Please enter a description'],
];

function missingRequiredMessage(body = {}) {
  for (const [field, message] of REQUIRED_FIELDS) {
    if (!String(body[field] ?? '').trim()) return message;
  }
  return null;
}

function friendlyValidationMessage(err) {
  if (err.name !== 'ValidationError') return null;

  const first = Object.values(err.errors)[0];
  if (!first) return 'Please check your details';

  if (first.kind === 'required') {
    return FIELD_MESSAGES[first.path] || `Please provide ${first.path}`;
  }

  if (first.kind === 'user defined' && first.message) {
    return first.message;
  }

  return FIELD_MESSAGES[first.path] || first.message || 'Please check your details';
}

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function listRequests(req, res) {
  try {
    const filter = {};
    for (const key of FILTERS) {
      if (req.query[key]) filter[key] = req.query[key];
    }

    const requests = await HelpRequest.find(filter).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Unable to load help requests' });
  }
}

async function createRequest(req, res) {
  try {
    const missing = missingRequiredMessage(req.body);
    if (missing) {
      return res.status(400).json({ message: missing });
    }

    const created = await HelpRequest.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    const message = friendlyValidationMessage(err);
    if (message) {
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: 'Unable to create help request' });
  }
}

async function updateRequestStatus(req, res) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: 'Help request not found' });
    }

    const { status } = req.body;
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Please select a valid status' });
    }

    const updated = await HelpRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({ message: 'Help request not found' });
    }

    res.json(updated);
  } catch (err) {
    const message = friendlyValidationMessage(err);
    if (message) {
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: 'Unable to update help request' });
  }
}

async function deleteRequest(req, res) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: 'Help request not found' });
    }

    const deleted = await HelpRequest.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Help request not found' });
    }

    res.json({ message: 'Help request deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Unable to delete help request' });
  }
}

module.exports = {
  listRequests,
  createRequest,
  updateRequestStatus,
  deleteRequest,
};
