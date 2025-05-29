const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  verifyOTP
} = require('../controllers/userController');
const { authorize } = require('../middleware/auth');
const router = express.Router();
  

router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', authorize({ isPasswordReset: true }), resetPassword);

// // Trong routes
// const { authenticate, authorizeAdmin, authorizeUser } = require('../middleware/auth');

// router.get('/users', authenticate, authorizeAdmin, userController.getAllUsers);
// router.put('/users/:id', authenticate, authorizeUser, userController.updateUser);

module.exports = router;