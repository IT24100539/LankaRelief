const mongoose = require('mongoose');
const EmergencyNotice = require('../models/EmergencyNotice');

const FILTERS = ['district', 'category', 'severity', 'status'];

const FIELD_MESSAGES = {
  title: 'Please enter a title',
  district: 'Please select a district',
  category: 'Please select a category',
  message: 'Please enter a message',
  severity: 'Please select a severity',
  status: 'Please select a valid status',
};

const REQUIRED_FIELDS = [
  ['title', 'Please enter a title'],
  ['district', 'Please select a district'],
  ['category', 'Please select a category'],
  ['severity', 'Please select a severity'],
  ['message', 'Please enter a message'],
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

  if (first.kind === 'enum') {
    return FIELD_MESSAGES[first.path] || 'Please check your details';
  }

  return FIELD_MESSAGES[first.path] || first.message || 'Please check your details';
}

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function listNotices(req, res) {
  try {
    const filter = {};
    for (const key of FILTERS) {
      if (req.query[key]) filter[key] = req.query[key];
    }

    const notices = await EmergencyNotice.find(filter).sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: 'Unable to load emergency notices' });
  }
}

async function createNotice(req, res) {
  try {
    const missing = missingRequiredMessage(req.body);
    if (missing) {
      return res.status(400).json({ message: missing });
    }

    const created = await EmergencyNotice.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    const message = friendlyValidationMessage(err);
    if (message) {
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: 'Unable to create emergency notice' });
  }
}

async function closeNotice(req, res) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: 'Emergency notice not found' });
    }

    const updated = await EmergencyNotice.findByIdAndUpdate(
      req.params.id,
      { status: 'Closed' },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({ message: 'Emergency notice not found' });
    }

    res.json(updated);
  } catch (err) {
    const message = friendlyValidationMessage(err);
    if (message) {
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: 'Unable to update emergency notice' });
  }
}

async function deleteNotice(req, res) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: 'Emergency notice not found' });
    }

    const deleted = await EmergencyNotice.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Emergency notice not found' });
    }

    res.json({ message: 'Emergency notice deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Unable to delete emergency notice' });
  }
}

module.exports = {
  listNotices,
  createNotice,
  closeNotice,
  deleteNotice,
};
