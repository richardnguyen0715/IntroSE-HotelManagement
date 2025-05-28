const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword
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
router.post('/reset-password', resetPassword);

// // Trong routes
// const { authenticate, authorizeAdmin, authorizeUser } = require('../middleware/auth');

// router.get('/users', authenticate, authorizeAdmin, userController.getAllUsers);
// router.put('/users/:id', authenticate, authorizeUser, userController.updateUser);

module.exports = router;