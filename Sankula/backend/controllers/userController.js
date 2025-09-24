import User from '../models/userModel.js';
import Unit from '../models/unitModel.js';

// GET /api/users
export const listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('unit', 'unitNumber block');
    res.json(users);
  } catch (err) {
    console.error('listUsers error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/users/:id
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('unit', 'unitNumber block');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('getUser error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/users
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, unit } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    if (unit) {
      const unitDoc = await Unit.findById(unit);
      if (!unitDoc) return res.status(400).json({ message: 'Invalid unit' });
    }

    const user = await User.create({ name, email, password, role, unit });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error('createUser error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/users/:id
export const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.password; // do not allow password change here

    if (updates.unit) {
      const unitDoc = await Unit.findById(updates.unit);
      if (!unitDoc) return res.status(400).json({ message: 'Invalid unit' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('updateUser error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('deleteUser error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
