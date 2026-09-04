const EmergencyNotice = require('../models/EmergencyNotice');
const {
  friendlyValidationMessage,
  missingRequiredMessage,
} = require('../utils/formErrors');
const { isValidId } = require('../utils/ids');

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
    const missing = missingRequiredMessage(req.body, REQUIRED_FIELDS);
    if (missing) {
      return res.status(400).json({ message: missing });
    }

    const created = await EmergencyNotice.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    const message = friendlyValidationMessage(err, FIELD_MESSAGES);
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
    const message = friendlyValidationMessage(err, FIELD_MESSAGES);
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
