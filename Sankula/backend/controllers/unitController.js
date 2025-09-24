import Unit from '../models/unitModel.js';
import User from '../models/userModel.js';

// Helper to validate user ids exist
async function ensureUsersExist(ids = []) {
  if (!ids.length) return true;
  const count = await User.countDocuments({ _id: { $in: ids } });
  return count === ids.length;
}

// GET /api/units
export const listUnits = async (req, res) => {
  try {
    const units = await Unit.find()
      .populate('owner', 'name email role')
      .populate('tenants', 'name email role');
    res.json(units);
  } catch (err) {
    console.error('listUnits error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/units/:id
export const getUnit = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id)
      .populate('owner', 'name email role')
      .populate('tenants', 'name email role');
    if (!unit) return res.status(404).json({ message: 'Unit not found' });
    res.json(unit);
  } catch (err) {
    console.error('getUnit error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/units
export const createUnit = async (req, res) => {
  try {
    const { unitNumber, block, owner, tenants = [] } = req.body;

    if (owner) {
      const ownerDoc = await User.findById(owner);
      if (!ownerDoc) return res.status(400).json({ message: 'Invalid owner' });
    }

    if (!(await ensureUsersExist(tenants))) {
      return res.status(400).json({ message: 'One or more tenants are invalid' });
    }

    const unit = await Unit.create({ unitNumber, block, owner, tenants });
    res.status(201).json(unit);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Unit already exists for this block' });
    }
    console.error('createUnit error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/units/:id
export const updateUnit = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.owner) {
      const ownerDoc = await User.findById(updates.owner);
      if (!ownerDoc) return res.status(400).json({ message: 'Invalid owner' });
    }

    if (updates.tenants && !(await ensureUsersExist(updates.tenants))) {
      return res.status(400).json({ message: 'One or more tenants are invalid' });
    }

    const unit = await Unit.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate('owner', 'name email role')
      .populate('tenants', 'name email role');

    if (!unit) return res.status(404).json({ message: 'Unit not found' });
    res.json(unit);
  } catch (err) {
    console.error('updateUnit error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/units/:id
export const deleteUnit = async (req, res) => {
  try {
    const unit = await Unit.findByIdAndDelete(req.params.id);
    if (!unit) return res.status(404).json({ message: 'Unit not found' });
    res.json({ message: 'Unit deleted' });
  } catch (err) {
    console.error('deleteUnit error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
