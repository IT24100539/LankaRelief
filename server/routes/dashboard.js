const fs = require('fs');
const path = require('path');
const express = require('express');

const router = express.Router();

function tryLoadModel(fileName) {
  const filePath = path.join(__dirname, '..', 'models', fileName);
  if (!fs.existsSync(filePath)) return null;
  return require(filePath);
}

const HelpRequest = tryLoadModel('HelpRequest.js');
const ResourceOffer = tryLoadModel('ResourceOffer.js');
const Shelter = tryLoadModel('Shelter.js');
const EmergencyNotice = tryLoadModel('EmergencyNotice.js');

async function countOrZero(model, filter) {
  if (!model) return 0;
  try {
    return await model.countDocuments(filter);
  } catch {
    return 0;
  }
}

async function getSummary(req, res) {
  try {
    const [openRequests, availableOffers, shelterSpace, urgentNotices] =
      await Promise.all([
        countOrZero(HelpRequest, { status: 'Open' }),
        countOrZero(ResourceOffer, { availabilityStatus: 'Available' }),
        countOrZero(Shelter, { status: { $in: ['Available', 'Limited'] } }),
        countOrZero(EmergencyNotice, { status: 'Active', severity: 'High' }),
      ]);

    res.json({
      openRequests,
      availableOffers,
      shelterSpace,
      urgentNotices,
    });
  } catch (err) {
    res.status(500).json({ message: 'Unable to load dashboard summary' });
  }
}

router.get('/summary', getSummary);

module.exports = router;
