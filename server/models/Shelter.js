const mongoose = require('mongoose');
const { DISTRICTS } = require('../utils/districts');
const { SHELTER_STATUSES } = require('../utils/enums');
const { occupancyStatus } = require('../utils/occupancy');

function capacityValidationError(message) {
  const err = new mongoose.Error.ValidationError();
  err.addError(
    'availableSpaces',
    new mongoose.Error.ValidatorError({
      message,
      path: 'availableSpaces',
    }),
  );
  return err;
}

const shelterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  district: { type: String, required: true, enum: DISTRICTS },
  address: { type: String, required: true },
  totalCapacity: { type: Number, required: true, min: 1 },
  availableSpaces: {
    type: Number,
    required: true,
    min: [0, 'Available spaces cannot be negative'],
  },
  facilities: { type: String },
  contact: { type: String },
  status: {
    type: String,
    default: 'Available',
    enum: SHELTER_STATUSES,
  },
});

shelterSchema.pre('validate', function applyCapacityRules() {
  const availableSpaces = Number(this.availableSpaces);
  const totalCapacity = Number(this.totalCapacity);

  if (!Number.isFinite(availableSpaces) || availableSpaces < 0) {
    this.invalidate('availableSpaces', 'Available spaces cannot be negative');
    return;
  }

  if (!Number.isFinite(totalCapacity) || availableSpaces > totalCapacity) {
    this.invalidate(
      'availableSpaces',
      'Available spaces cannot exceed total capacity',
    );
    return;
  }

  this.status = occupancyStatus(availableSpaces, totalCapacity);
});

shelterSchema.pre('findOneAndUpdate', async function applyCapacityOnUpdate() {
  const update = this.getUpdate() || {};
  const patch = { ...(update.$set || update) };
  const current = await this.model.findOne(this.getQuery()).lean();
  if (!current) return;

  const totalCapacity = Number(patch.totalCapacity ?? current.totalCapacity);
  const availableSpaces = Number(patch.availableSpaces ?? current.availableSpaces);

  if (!Number.isFinite(availableSpaces) || availableSpaces < 0) {
    throw capacityValidationError('Available spaces cannot be negative');
  }

  if (!Number.isFinite(totalCapacity) || availableSpaces > totalCapacity) {
    throw capacityValidationError('Available spaces cannot exceed total capacity');
  }

  patch.status = occupancyStatus(availableSpaces, totalCapacity);

  if (update.$set) {
    this.setUpdate({ ...update, $set: { ...update.$set, status: patch.status } });
  } else {
    this.setUpdate({ ...update, status: patch.status });
  }
});

module.exports = mongoose.model('Shelter', shelterSchema);
