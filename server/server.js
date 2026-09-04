require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/requests', require('./routes/requests'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/shelters', require('./routes/shelters'));

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

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

if (!uri) {
  console.warn('MongoDB skipped: MONGODB_URI is missing. Copy server/.env.example to server/.env');
} else {
  mongoose
    .connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
      console.warn('MongoDB not connected:', err.message);
    });
}
