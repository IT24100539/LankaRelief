require('dotenv').config();

const mongoose = require('mongoose');
const Shelter = require('../models/Shelter');

const SAMPLES = [
  {
    name: 'Wellampitiya Community Centre',
    district: 'Colombo',
    address: 'Baseline Road, Wellampitiya',
    totalCapacity: 180,
    availableSpaces: 95,
    facilities: 'water, electricity, toilets, cooked meals',
    contact: '011 257 3344',
  },
  {
    name: 'Unawatuna Maha Vidyalaya',
    district: 'Galle',
    address: 'Yaddehimulla Road, Unawatuna',
    totalCapacity: 120,
    availableSpaces: 18,
    facilities: 'water, toilets, first aid',
    contact: '091 222 3344',
  },
  {
    name: 'Pelmadulla Pradeshiya Sabha Hall',
    district: 'Ratnapura',
    address: 'Main Street, Pelmadulla town',
    totalCapacity: 80,
    availableSpaces: 0,
    facilities: 'water, electricity, toilets',
    contact: '045 227 1100',
  },
  {
    name: 'Ampitiya Community Hall',
    district: 'Kandy',
    address: 'Ampitiya Junction, Kandy',
    totalCapacity: 150,
    availableSpaces: 110,
    facilities: 'water, electricity, toilets, bedding',
    contact: '081 223 6677',
  },
  {
    name: 'Aluthgama Muslim Maha Vidyalaya',
    district: 'Kalutara',
    address: 'Galle Road, Aluthgama',
    totalCapacity: 90,
    availableSpaces: 12,
    facilities: 'water, electricity, toilets',
    contact: '034 227 8899',
  },
  {
    name: 'Eravur Urban Council Hall',
    district: 'Batticaloa',
    address: 'Trincomalee Road, Eravur',
    totalCapacity: 60,
    availableSpaces: 0,
    facilities: 'water, toilets',
    contact: '065 224 5566',
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is missing. Copy server/.env.example to server/.env');
  }

  await mongoose.connect(uri);
  await Shelter.deleteMany({});
  await Shelter.create(SAMPLES);
  console.log(`Seeded ${SAMPLES.length} shelters`);
}

seed()
  .catch((err) => {
    console.error('Failed to seed shelters:', err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
