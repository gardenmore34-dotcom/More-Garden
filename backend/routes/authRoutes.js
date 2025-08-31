import express from 'express';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  updateProfile, 
  resetPassword, 
  forgotPassword, 
  verifyOtpAndResetPassword,
  updateUserRole,
  getUserAddresses,
  updateUserAddresses,
  getUserInfo,
} from '../controllers/authController.js';
import { isAdmin } from '../middleware/roleMiddleware.js';
import verifyToken from '../middleware/authMiddleware.js';
import { validate } from '../utils/validate.js';
import { loginValidationRules , registerValidationRules } from '../validators/userValidator.js';

const router = express.Router();

router.post("/register",registerValidationRules,validate, registerUser);
router.post("/login",loginValidationRules,validate, loginUser);
router.post("/logout", logoutUser);
router.get('/info/:id', getUserInfo);
router.put('/:id/role', isAdmin, updateUserRole);
router.put("/update", verifyToken, updateProfile);
router.put("/reset-password", verifyToken, resetPassword);
router.get('/:id/addresses', getUserAddresses);
router.put('/:id/addresses', updateUserAddresses);
router.post("/forgot-password", forgotPassword);
router.get('/test-auth', (req, res) => {
  res.send("Auth route test working");
});

router.post("/verify-otp", verifyOtpAndResetPassword);

export default router;
