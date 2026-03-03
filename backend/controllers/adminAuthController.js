import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

const generateToken = (adminId) => {
  return jwt.sign({ adminId, isAdmin: true }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email }).select('+password');
    console.log(`[Diagnostic] Found admin document: ${!!admin}`);

    if (!admin) {
      console.log(`[Diagnostic] REJECTED 401: No document for email '${email}'`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordMatch = await admin.comparePassword(password);
    console.log(`[Diagnostic] Password Match Result for '${password}': ${isPasswordMatch}`);

    if (!isPasswordMatch) {
      console.log(`[Diagnostic] REJECTED 401: Password '${password}' failed bcrypt comparison.`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = await Admin.create({
      email,
      password,
      role: 'admin',
    });

    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
