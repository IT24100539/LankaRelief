const HelpRequest = require('../models/HelpRequest');
const { REQUEST_STATUSES } = require('../utils/enums');
const {
  friendlyValidationMessage,
  missingRequiredMessage,
} = require('../utils/formErrors');
const { isValidId } = require('../utils/ids');

const FILTERS = ['district', 'category', 'urgency', 'status'];

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
    const missing = missingRequiredMessage(req.body, REQUIRED_FIELDS);
    if (missing) {
      return res.status(400).json({ message: missing });
    }

    const created = await HelpRequest.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    const message = friendlyValidationMessage(err, FIELD_MESSAGES);
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
    if (!REQUEST_STATUSES.includes(status)) {
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
    const message = friendlyValidationMessage(err, FIELD_MESSAGES);
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
