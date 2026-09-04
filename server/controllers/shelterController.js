const mongoose = require('mongoose');
const Shelter = require('../models/Shelter');

const FILTERS = ['district', 'status'];
const UPDATABLE = [
  'name',
  'district',
  'address',
  'totalCapacity',
  'availableSpaces',
  'facilities',
  'contact',
];

const FIELD_MESSAGES = {
  name: 'Please enter the shelter name',
  district: 'Please select a district',
  address: 'Please enter an address',
  totalCapacity: 'Please enter a total capacity of at least 1',
  availableSpaces: 'Available spaces cannot be negative',
};

const REQUIRED_FIELDS = [
  ['name', 'Please enter the shelter name'],
  ['district', 'Please select a district'],
  ['address', 'Please enter an address'],
];

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function missingRequiredMessage(body = {}) {
  for (const [field, message] of REQUIRED_FIELDS) {
    if (!String(body[field] ?? '').trim()) return message;
  }

  if (
    body.totalCapacity === undefined ||
    body.totalCapacity === null ||
    body.totalCapacity === ''
  ) {
    return 'Please enter a total capacity';
  }

  if (
    body.availableSpaces === undefined ||
    body.availableSpaces === null ||
    body.availableSpaces === ''
  ) {
    return 'Please enter available spaces';
  }

  return capacityIssue(body.totalCapacity, body.availableSpaces);
}

function capacityIssue(totalCapacity, availableSpaces) {
  const total = Number(totalCapacity);
  const available = Number(availableSpaces);

  if (!Number.isFinite(total) || total < 1) {
    return 'Please enter a total capacity of at least 1';
  }

  if (!Number.isFinite(available)) {
    return 'Please enter available spaces';
  }

  if (available < 0) {
    return 'Available spaces cannot be negative';
  }

  if (available > total) {
    return 'Available spaces cannot exceed total capacity';
  }

  return null;
}

function friendlyValidationMessage(err) {
  if (err.name === 'CastError') {
    if (err.path === 'availableSpaces') {
      return 'Available spaces cannot be negative';
    }
    if (err.path === 'totalCapacity') {
      return 'Please enter a total capacity of at least 1';
    }
    return 'Please check your details';
  }

  if (err.name !== 'ValidationError') return null;

  const first = Object.values(err.errors)[0];
  if (!first) return 'Please check your details';

  if (first.message) return first.message;

  if (first.kind === 'required') {
    return FIELD_MESSAGES[first.path] || `Please provide ${first.path}`;
  }

  return FIELD_MESSAGES[first.path] || 'Please check your details';
}

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function listShelters(req, res) {
  try {
    const filter = {};
    for (const key of FILTERS) {
      if (req.query[key]) filter[key] = req.query[key];
    }

    const search = String(req.query.search || '').trim();
    if (search) {
      const pattern = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ name: pattern }, { address: pattern }];
    }

    const shelters = await Shelter.find(filter).sort({ name: 1 });
    res.json(shelters);
  } catch (err) {
    res.status(500).json({ message: 'Unable to load shelters' });
  }
}

async function createShelter(req, res) {
  try {
    const missing = missingRequiredMessage(req.body);
    if (missing) {
      return res.status(400).json({ message: missing });
    }

    const created = await Shelter.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    const message = friendlyValidationMessage(err);
    if (message) {
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: 'Unable to create shelter' });
  }
}

async function updateShelter(req, res) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    const current = await Shelter.findById(req.params.id);
    if (!current) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    const patch = {};
    for (const key of UPDATABLE) {
      if (req.body[key] !== undefined) patch[key] = req.body[key];
    }

    const issue = capacityIssue(
      patch.totalCapacity ?? current.totalCapacity,
      patch.availableSpaces ?? current.availableSpaces,
    );
    if (issue) {
      return res.status(400).json({ message: issue });
    }

    const updated = await Shelter.findByIdAndUpdate(req.params.id, patch, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    res.json(updated);
  } catch (err) {
    const message = friendlyValidationMessage(err);
    if (message) {
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: 'Unable to update shelter' });
  }
}

async function deleteShelter(req, res) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    const deleted = await Shelter.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    res.json({ message: 'Shelter deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Unable to delete shelter' });
  }
}

module.exports = {
  listShelters,
  createShelter,
  updateShelter,
  deleteShelter,
};
