require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

if (!PORT) {
  console.error('PORT is missing. Copy server/.env.example to server/.env');
  process.exit(1);
}

function originFromEnv(value) {
  return String(value || '').trim().replace(/\/$/, '')
}

const allowedOrigins = [
  ...new Set(
    [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:4173',
      'http://127.0.0.1:4173',
      'https://lanka-relief-eight.vercel.app',
      originFromEnv(process.env.FRONTEND_URL),
    ].filter(Boolean),
  ),
]

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
  }),
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/requests', require('./routes/requests'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/shelters', require('./routes/shelters'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/dashboard', require('./routes/dashboard'));

mongoose.connection.on('error', (err) => {
  console.warn('MongoDB error:', err.message);
});

const server = app.listen(PORT, () => {
  console.log(`LankaRelief server listening on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Failed to start server:', err.message);
  process.exitCode = 1;
});

if (!MONGODB_URI) {
  console.warn(
    'MongoDB skipped: MONGODB_URI is missing. Copy server/.env.example to server/.env',
  );
} else {
  mongoose
    .connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
      console.warn('MongoDB not connected:', err.message);
    });
}
