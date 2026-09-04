require('dotenv').config();

const mongoose = require('mongoose');
const EmergencyNotice = require('../models/EmergencyNotice');

const SAMPLES = [
  {
    title: 'Kalu Ganga overflow — Pelmadulla cut off',
    district: 'Ratnapura',
    category: 'Flood',
    message:
      'The Kalu Ganga has overtopped the Pelmadulla town bund. Families along Main Street should move to the Pradeshiya Sabha Hall. Boats are operating from the temple junction until 6pm.',
    severity: 'High',
    status: 'Active',
  },
  {
    title: 'Slope failure above Ampitiya road',
    district: 'Kandy',
    category: 'Landslide',
    message:
      'A debris slide has blocked the Ampitiya–Kandy road. Do not use the lower hairpin. The Ampitiya Community Hall is open for residents from the affected stretch.',
    severity: 'High',
    status: 'Active',
  },
  {
    title: 'High seas and gale warning for Unawatuna',
    district: 'Galle',
    category: 'Severe weather',
    message:
      'Strong winds and high swell are expected through tonight. Fishing craft should stay in harbour. The Unawatuna school shelter remains open for families from the beach road.',
    severity: 'Medium',
    status: 'Active',
  },
  {
    title: 'Canal overflow eased in Wellampitiya',
    district: 'Colombo',
    category: 'Flood',
    message:
      'Water on Baseline Road has receded. The Wellampitiya Community Centre is still taking overnight stays for two households whose homes are not yet dry.',
    severity: 'Low',
    status: 'Closed',
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is missing. Copy server/.env.example to server/.env');
  }

  await mongoose.connect(uri);
  await EmergencyNotice.deleteMany({});
  await EmergencyNotice.create(SAMPLES);
  console.log(`Seeded ${SAMPLES.length} emergency notices`);
}

seed()
  .catch((err) => {
    console.error('Failed to seed emergency notices:', err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
