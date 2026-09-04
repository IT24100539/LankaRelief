require('dotenv').config();

const mongoose = require('mongoose');
const ResourceOffer = require('../models/ResourceOffer');

const SAMPLES = [
  {
    volunteerName: 'Galle Red Cross Youth',
    contact: '0778899002',
    district: 'Galle',
    resourceType: 'Drinking water',
    quantity: 240,
    notes:
      'Sealed 1-litre bottles at the Galle bus stand for Unawatuna beach-road families at the school shelter.',
    availabilityStatus: 'Available',
  },
  {
    volunteerName: 'Matara Mosque Relief Desk',
    contact: '071 888 2211',
    district: 'Matara',
    resourceType: 'Dry rations',
    quantity: 40,
    notes: 'Rice, dhal, and tea packs for families in Weligama.',
    availabilityStatus: 'Available',
  },
  {
    volunteerName: 'Kamal Fernando Transport',
    contact: '+94772345678',
    district: 'Kalutara',
    resourceType: 'Transport',
    quantity: 12,
    notes: 'Van seats for clinic runs between Aluthgama and Kalutara hospital.',
    availabilityStatus: 'Reserved',
  },
  {
    volunteerName: 'Eravur Hospital Volunteer Desk',
    contact: '0773342211',
    district: 'Batticaloa',
    resourceType: 'Medicine',
    quantity: 15,
    notes: 'First-aid kits and fever medicine for the Eravur school shelter.',
    availabilityStatus: 'Available',
  },
  {
    volunteerName: 'Amma’s Kitchen — Kandy',
    contact: '0753344556',
    district: 'Kandy',
    resourceType: 'Cooked meals',
    quantity: 80,
    notes:
      'Lunch packets prepared at the temple kitchen for families at Ampitiya Community Hall.',
    availabilityStatus: 'Used',
  },
  {
    volunteerName: 'Colombo Rotary Club 3',
    contact: '+94761239876',
    district: 'Colombo',
    resourceType: 'Drinking water',
    quantity: 120,
    notes: 'Bottled water that can be delivered to Wellampitiya this evening.',
    availabilityStatus: 'Available',
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is missing. Copy server/.env.example to server/.env');
  }

  await mongoose.connect(uri);
  await ResourceOffer.deleteMany({});
  await ResourceOffer.insertMany(SAMPLES);
  console.log(`Seeded ${SAMPLES.length} resource offers`);
}

seed()
  .catch((err) => {
    console.error('Failed to seed resource offers:', err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
