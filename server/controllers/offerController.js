const ResourceOffer = require('../models/ResourceOffer');
const { OFFER_STATUSES } = require('../utils/enums');
const {
  friendlyValidationMessage,
  missingRequiredMessage,
} = require('../utils/formErrors');
const { isValidId } = require('../utils/ids');

const FILTERS = ['district', 'resourceType', 'availabilityStatus'];

const FIELD_MESSAGES = {
  volunteerName: 'Please enter the volunteer name',
  contact: 'Please enter a valid Sri Lankan contact number',
  district: 'Please select a district',
  resourceType: 'Please select a resource type',
  quantity: 'Quantity must be greater than zero',
  availabilityStatus: 'Please select a valid availability status',
};

const REQUIRED_FIELDS = [
  ['volunteerName', 'Please enter the volunteer name'],
  ['contact', 'Please enter a contact number'],
  ['district', 'Please select a district'],
  ['resourceType', 'Please select a resource type'],
];

function quantityMessage(body = {}) {
  const missing = missingRequiredMessage(body, REQUIRED_FIELDS);
  if (missing) return missing;

  if (body.quantity === undefined || body.quantity === null || body.quantity === '') {
    return 'Please enter a quantity';
  }

  if (!Number.isFinite(Number(body.quantity)) || Number(body.quantity) <= 0) {
    return 'Quantity must be greater than zero';
  }

  return null;
}

async function listOffers(req, res) {
  try {
    const filter = {};
    for (const key of FILTERS) {
      if (req.query[key]) filter[key] = req.query[key];
    }

    const offers = await ResourceOffer.find(filter).sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: 'Unable to load resource offers' });
  }
}

async function createOffer(req, res) {
  try {
    const missing = quantityMessage(req.body);
    if (missing) {
      return res.status(400).json({ message: missing });
    }

    const created = await ResourceOffer.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    const message = friendlyValidationMessage(err, FIELD_MESSAGES);
    if (message) {
      return res.status(400).json({ message: message });
    }
    res.status(500).json({ message: 'Unable to create resource offer' });
  }
}

async function updateOfferStatus(req, res) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: 'Resource offer not found' });
    }

    const { availabilityStatus } = req.body;
    if (!OFFER_STATUSES.includes(availabilityStatus)) {
      return res.status(400).json({ message: 'Please select a valid availability status' });
    }

    const updated = await ResourceOffer.findByIdAndUpdate(
      req.params.id,
      { availabilityStatus },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({ message: 'Resource offer not found' });
    }

    res.json(updated);
  } catch (err) {
    const message = friendlyValidationMessage(err, FIELD_MESSAGES);
    if (message) {
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: 'Unable to update resource offer' });
  }
}

async function deleteOffer(req, res) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: 'Resource offer not found' });
    }

    const deleted = await ResourceOffer.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Resource offer not found' });
    }

    res.json({ message: 'Resource offer deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Unable to delete resource offer' });
  }
}

module.exports = {
  listOffers,
  createOffer,
  updateOfferStatus,
  deleteOffer,
};
