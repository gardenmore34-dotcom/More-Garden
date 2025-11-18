import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import mongoose from 'mongoose';
import { OAuth2Client } from 'google-auth-library';

export const googleAuth = async (req, res) => {
  console.log("🔍 Google auth attempt:", { email: req.body.email, name: req.body.name });
  
  const { email, name, picture, googleId, credential } = req.body; // Add credential to destructure
  
  try {
    // Optional: Verify the Google token for extra security
    if (process.env.GOOGLE_CLIENT_SECRET && credential) {
      console.log("🔐 Verifying Google token...");
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_SECRET);
      
      try {
        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID, // You'll need this in your .env
        });
        const payload = ticket.getPayload();
        console.log("✅ Google token verified for:", payload.email);
        
        // Additional verification: ensure the token data matches request data
        if (payload.email !== email || payload.sub !== googleId) {
          console.log("❌ Token data mismatch:", { 
            tokenEmail: payload.email, 
            requestEmail: email,
            tokenId: payload.sub,
            requestId: googleId
          });
          return res.status(400).json({ msg: 'Invalid Google token data' });
        }
      } catch (verifyError) {
        console.error("❌ Google token verification failed:", verifyError);
        return res.status(401).json({ msg: 'Invalid Google token' });
      }
    } else {
      console.log("⚠️ Skipping Google token verification (no client secret or credential)");
    }

    // Check if user already exists with this email
    let user = await User.findOne({ email });
    console.log("🔍 Existing user check:", { found: !!user, hasGoogleId: user?.googleId });

    if (user) {
      // User exists with this email
      if (user.googleId && user.googleId !== googleId) {
        console.log("❌ Google ID mismatch:", { 
          existingGoogleId: user.googleId, 
          newGoogleId: googleId 
        });
        return res.status(400).json({ msg: 'Email is associated with a different Google account' });
      }

      // Update user with Google data if not already set
      if (!user.googleId) {
        console.log("🔄 Linking existing account to Google:", user.email);
        user.googleId = googleId;
        user.profilePicture = picture || '';
        user.authProvider = 'google';
        user.isVerified = true;
        await user.save();
        console.log("✅ Account linked successfully");
      } else {
        console.log("✅ Google user login - existing account");
      }
    } else {
      // Create new user with Google data
      console.log("🆕 Creating new Google user:", email);
      user = new User({
        name,
        email,
        googleId,
        profilePicture: picture || '',
        authProvider: 'google',
        isVerified: true,
        addresses: [],
      });
      await user.save();
      console.log("✅ New Google user created:", user._id);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.role === 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log("🔑 JWT token generated for Google user:", user._id);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.role === 'admin',
        addresses: user.addresses,
        profilePicture: user.profilePicture || '',
        authProvider: user.authProvider || 'google',
        isVerified: user.isVerified || false,
      },
    });
  } catch (error) {
    console.error('💥 Google auth error:', error);
    console.error('💥 Stack trace:', error.stack);
    
    if (error.code === 11000) {
      console.log("❌ Duplicate key error in Google auth:", error.keyPattern);
      return res.status(400).json({ msg: 'An account with this email already exists' });
    }

    res.status(500).json({ error: 'Google authentication failed', details: error.message });
  }
};


export const registerUser = async (req, res) => {
  console.log("Incoming body:", req.body);

  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("❌ Email already exists during registration:", email);
      return res.status(400).json({ msg: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      authProvider: 'local',
      addresses: [],
    });

    console.log("✅ New local user created:", newUser._id);

    const token = jwt.sign(
      { id: newUser._id, isAdmin: newUser.role === 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.role === 'admin',
        addresses: newUser.addresses,
        authProvider: newUser.authProvider || 'local',
      },
    });
  } catch (error) {
    console.error("💥 Registration Error:", error);
    res.status(500).json({ error: "Registration failed", details: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("🔍 Login attempt:", { email });
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found for email:", email);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    console.log("🔍 User found:", { 
      id: user._id, 
      authProvider: user.authProvider, 
      hasPassword: !!user.password,
      hasGoogleId: !!user.googleId 
    });

    // Check if user registered with Google only
    if (user.authProvider === 'google' && !user.password) {
      console.log("⚠️ Google-only user attempting email login:", email);
      return res.status(400).json({ 
        msg: "Please sign in with Google",
        googleUser: true 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch for user:", user._id);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.role === 'admin' }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );
    console.log("✅ Login successful for user:", user._id);

    res.status(200).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        isAdmin: user.role === 'admin',
        addresses: user.addresses,
        profilePicture: user.profilePicture || '',
        authProvider: user.authProvider || 'local',
        // Keep backward compatibility for existing frontend
        address: user.addresses?.[0]?.line1 || '',
        pincode: user.addresses?.[0]?.zip || '',
      },
    });
  } catch (error) {
    console.error('💥 Login error:', error);
    res.status(500).json({ error: "Login failed" });
  }
};

export const logoutUser = async (req, res) => {
  console.log("🔄 Logout request for user:", req.user?.id);
  res.status(200).json({ msg: "Logout successful" });
};

export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, address, pincode, profilePicture } = req.body;
  console.log("🔄 Profile update attempt:", { userId, hasAddress: !!address, hasPincode: !!pincode });

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log("❌ User not found for profile update:", userId);
      return res.status(404).json({ msg: "User not found" });
    }

    console.log("🔍 Current user addresses count:", user.addresses?.length || 0);

    // Update basic fields
    if (name) user.name = name;
    if (profilePicture) user.profilePicture = profilePicture;

    // Handle address update - maintain backward compatibility
    if (address || pincode) {
      console.log("🔄 Updating address data");
      
      if (user.addresses && user.addresses.length > 0) {
        console.log("📍 Updating existing address");
        if (address) user.addresses[0].line1 = address;
        if (pincode) user.addresses[0].zip = pincode;
      } else {
        console.log("📍 Creating new address entry");
        user.addresses = [{
          label: 'Home',
          name: user.name,
          phone: '',
          line1: address || '',
          city: '',
          state: '',
          zip: pincode || ''
        }];
      }
    }

    await user.save();
    console.log("✅ Profile updated successfully for user:", userId);

    res.status(200).json({
      msg: "Profile updated",
      user: {
        name: user.name,
        email: user.email,
        isAdmin: user.role === 'admin',
        addresses: user.addresses,
        profilePicture: user.profilePicture || '',
        // Keep backward compatibility
        address: user.addresses?.[0]?.line1 || '',
        pincode: user.addresses?.[0]?.zip || '',
      },
    });
  } catch (error) {
    console.error('💥 Profile update error:', error);
    res.status(500).json({ error: "Profile update failed" });
  }
};

export const resetPassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;
  console.log("🔄 Password reset attempt for user:", userId);

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log("❌ User not found for password reset:", userId);
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if user is Google-only user
    if (user.authProvider === 'google' && !user.password) {
      console.log("⚠️ Google-only user attempting password reset:", userId);
      return res.status(400).json({ msg: "Cannot reset password for Google users" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      console.log("❌ Current password mismatch for user:", userId);
      return res.status(400).json({ msg: "Incorrect current password" });
    }

    const hashedNew = await bcrypt.hash(newPassword, 10);
    user.password = hashedNew;
    await user.save();

    console.log("✅ Password reset completed for user:", userId);
    res.status(200).json({ msg: "Password updated" });
  } catch (error) {
    console.error('💥 Reset password error:', error);
    res.status(500).json({ error: "Password reset failed" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log("🔄 Forgot password attempt for email:", email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ Email not registered for forgot password:", email);
      return res.status(400).json({ msg: "Email not registered" });
    }

    // Check if user is Google-only user
    if (user.authProvider === 'google' && !user.password) {
      console.log("⚠️ Google-only user attempting forgot password:", email);
      return res.status(400).json({ 
        msg: "This account uses Google sign-in. Please use Google to login.",
        googleUser: true 
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendEmail(email, "Password Reset OTP", `Your OTP is ${otp}`);
    console.log("✅ OTP sent for forgot password:", email);
    res.status(200).json({ msg: "OTP sent" });
  } catch (error) {
    console.error('💥 Forgot password error:', error);
    res.status(500).json({ error: "OTP send failed" });
  }
};

export const verifyOtpAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  console.log("🔄 OTP verification attempt for email:", email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found for OTP verification:", email);
      return res.status(400).json({ msg: "User not found" });
    }

    if (user.otp !== otp || Date.now() > user.otpExpires) {
      console.log("❌ Invalid or expired OTP for user:", email);
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = "";
    user.otpExpires = null;
    await user.save();

    console.log("✅ Password reset successful via OTP for user:", email);
    res.status(200).json({ msg: "Password reset successful" });
  } catch (error) {
    console.error('💥 Verify OTP error:', error);
    res.status(500).json({ error: "Reset failed" });
  }
};

export const updateUserRole = async (req, res) => {
  const { role } = req.body; // 'admin' or 'user'
  console.log("🔄 Role update attempt:", { targetUserId: req.params.id, newRole: role, adminId: req.user.id });

  try {
    // Ensure the user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      console.log("❌ Target user not found for role update:", req.params.id);
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if the logged-in user is admin
    if (req.user.role !== 'admin') {
      console.log("❌ Non-admin attempting role change:", req.user.id);
      return res.status(403).json({ msg: 'You do not have permission to change roles' });
    }

    // Update the role of the user
    user.role = role;
    await user.save();
    console.log("✅ User role updated successfully:", { userId: user._id, newRole: role });
    res.json({ msg: 'User role updated successfully', user });
  } catch (err) {
    console.error('💥 Update user role error:', err);
    res.status(500).json({ msg: 'Error updating user role', error: err.message });
  }
};

export const getUserInfo = async (req, res) => {
  const { id } = req.params;
  console.log("🔍 Get user info request for ID:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("❌ Invalid user ID format:", id);
    return res.status(400).json({ message: 'Invalid user ID format' });
  }

  try {
    const user = await User.findById(id).select('-password -otp -otpExpires');
    
    if (!user) {
      console.log("❌ User not found:", id);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log("✅ User info retrieved:", { 
      id: user._id, 
      authProvider: user.authProvider,
      addressCount: user.addresses?.length || 0 
    });

    // Return user with both new and old format for compatibility
    const responseUser = {
      ...user.toObject(),
      isAdmin: user.role === 'admin',
      // Backward compatibility
      address: user.addresses?.[0]?.line1 || '',
      pincode: user.addresses?.[0]?.zip || '',
    };
    
    res.json(responseUser);
  } catch (err) {
    console.error('💥 Error fetching user info:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all addresses
export const getUserAddresses = async (req, res) => {
  console.log("🔍 Get addresses request for user:", req.params.id);
  
  try {
    const user = await User.findById(req.params.id).select('addresses');
    if (!user) {
      console.log("❌ User not found for addresses:", req.params.id);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log("✅ Addresses retrieved:", { userId: req.params.id, count: user.addresses?.length || 0 });
    res.json(user.addresses);
  } catch (err) {
    console.error('💥 Get user addresses error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add or update address
export const updateUserAddresses = async (req, res) => {
  const { id } = req.params;
  const { addresses } = req.body;
  console.log("🔄 Update addresses request:", { userId: id, addressCount: addresses?.length || 0 });

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { addresses },
      { new: true }
    ).select('addresses');
    
    if (!user) {
      console.log("❌ User not found for address update:", id);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log("✅ Addresses updated successfully:", { userId: id, newCount: user.addresses?.length || 0 });
    res.json(user.addresses);
  } catch (err) {
    console.error('💥 Update user addresses error:', err);
    res.status(500).json({ message: 'Failed to update address' });
  }
};

// Get current user profile (for authenticated user)
export const getCurrentUser = async (req, res) => {
  const userId = req.user.id;
  console.log("🔍 Get current user profile request:", userId);
  
  try {
    const user = await User.findById(userId).select('-password -otp -otpExpires');
    
    if (!user) {
      console.log("❌ Current user not found:", userId);
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log("✅ Current user profile retrieved:", { 
      id: user._id, 
      authProvider: user.authProvider,
      addressCount: user.addresses?.length || 0 
    });

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.role === 'admin',
        addresses: user.addresses,
        profilePicture: user.profilePicture || '',
        authProvider: user.authProvider || 'local',
        isVerified: user.isVerified || false,
        // Backward compatibility
        address: user.addresses?.[0]?.line1 || '',
        pincode: user.addresses?.[0]?.zip || '',
      },
    });
  } catch (error) {
    console.error('💥 Get current user error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};
