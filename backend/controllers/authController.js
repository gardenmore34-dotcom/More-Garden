import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import mongoose from 'mongoose';

export const registerUser = async (req, res) => {
  console.log("Incoming body:", req.body);

  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Registration failed", details: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        address: user.address,
        pincode: user.pincode,
      },
    });
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
};

export const logoutUser = async (req, res) => {
  res.status(200).json({ msg: "Logout successful" });
};

export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, address, pincode } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId, { name, address, pincode }, { new: true }
    );

    res.status(200).json({
      msg: "Profile updated",
      user: {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        address: user.address,
        pincode: user.pincode,
      },
    });
  } catch {
    res.status(500).json({ error: "Profile update failed" });
  }
};

export const resetPassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect current password" });

    const hashedNew = await bcrypt.hash(newPassword, 10);
    user.password = hashedNew;
    await user.save();

    res.status(200).json({ msg: "Password updated" });
  } catch {
    res.status(500).json({ error: "Password reset failed" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Email not registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendEmail(email, "Password Reset OTP", `Your OTP is ${otp}`);
    res.status(200).json({ msg: "OTP sent" });
  } catch {
    res.status(500).json({ error: "OTP send failed" });
  }
};

export const verifyOtpAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = "";
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ msg: "Password reset successful" });
  } catch {
    res.status(500).json({ error: "Reset failed" });
  }
};

export const updateUserRole = async (req, res) => {
  const { role } = req.body; // 'admin' or 'user'

  try {
    // Ensure the user exists
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Check if the logged-in user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'You do not have permission to change roles' });
    }

    // Update the role of the user
    user.role = role;
    await user.save();
    res.json({ msg: 'User role updated successfully', user });
  } catch (err) {
    res.status(500).json({ msg: 'Error updating user role', error: err.message });
  }
};


export const getUserInfo = async (req, res) => {
  const { id } = req.params;
 

  if (!mongoose.Types.ObjectId.isValid(id)) {
    
    return res.status(400).json({ message: 'Invalid user ID format' });
  }

  try {
    const user = await User.findById(id).select('-password');
    
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user);
  } catch (err) {
    console.error('Error fetching user info:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all addresses
export const getUserAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('addresses');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add or update address
export const updateUserAddresses = async (req, res) => {
  const { id } = req.params;
  const { addresses } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { addresses },
      { new: true }
    ).select('addresses');
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update address' });
  }
};
