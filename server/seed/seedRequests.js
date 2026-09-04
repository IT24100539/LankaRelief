require('dotenv').config();

const mongoose = require('mongoose');
const HelpRequest = require('../models/HelpRequest');

const SAMPLES = [
  {
    name: 'Nimal Perera',
    contact: '0771234567',
    district: 'Ratnapura',
    location: 'Pelmadulla town',
    category: 'Drinking water',
    description:
      'Floodwater has cut the main line. Forty families need clean drinking water today.',
    urgency: 'High',
    status: 'Open',
  },
  {
    name: 'Fathima Rizwan',
    contact: '071 234 5678',
    district: 'Galle',
    location: 'Unawatuna',
    category: 'Dry rations',
    description:
      'Need rice, dhal, and milk powder for 25 households staying at the temple.',
    urgency: 'Medium',
    status: 'Open',
  },
  {
    name: 'Kamal Fernando',
    contact: '+94772345678',
    district: 'Kalutara',
    location: 'Aluthgama bridge approach',
    category: 'Transport',
    description:
      'Elderly residents need a boat or van to reach the Kalutara hospital clinic.',
    urgency: 'High',
    status: 'In progress',
  },
  {
    name: 'S. Rajendran',
    contact: '0765432109',
    district: 'Batticaloa',
    location: 'Eravur',
    category: 'Medicine',
    description:
      'Requesting first-aid kits and fever medicine for families at the Eravur school shelter.',
    urgency: 'Medium',
    status: 'Open',
  },
  {
    name: 'Anusha Jayasuriya',
    contact: '0751122334',
    district: 'Matara',
    location: 'Weligama fishing harbour',
    category: 'Cooked meals',
    description:
      'Harbour workers and displaced families need lunch packets for about 60 people.',
    urgency: 'Low',
    status: 'Resolved',
  },
  {
    name: 'Mohamed Irfan',
    contact: '+94769876543',
    district: 'Colombo',
    location: 'Wellampitiya',
    category: 'Temporary shelter',
    description:
      'Two families are sleeping in a shopfront after the canal overflowed last night.',
    urgency: 'High',
    status: 'Open',
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is missing. Copy server/.env.example to server/.env');
  }

  await mongoose.connect(uri);
  await HelpRequest.deleteMany({});
  await HelpRequest.insertMany(SAMPLES);
  console.log(`Seeded ${SAMPLES.length} help requests`);
}

seed()
  .catch((err) => {
    console.error('Failed to seed help requests:', err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
