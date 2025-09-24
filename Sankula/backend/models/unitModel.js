import mongoose from 'mongoose';

const unitSchema = new mongoose.Schema({
  unitNumber: {
    type: String,
    required: true,
  },
  block: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tenants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  // Add other unit-related fields here, e.g., size, type, asset details
}, { timestamps: true });

// Ensure a unit is unique per block
unitSchema.index({ unitNumber: 1, block: 1 }, { unique: true });

const Unit = mongoose.model('Unit', unitSchema);

export default Unit;
