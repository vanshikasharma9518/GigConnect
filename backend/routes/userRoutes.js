const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  rateUser,
  convertRatingsToCoins,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Auth routes
router.post('/', registerUser);
router.post('/login', loginUser);

// Profile routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Rating routes
router.post('/:id/rate', protect, rateUser);

// Coin conversion route
router.post('/convert-ratings', protect, convertRatingsToCoins);

// TEST ONLY: Add a test rating to yourself (should be removed in production)
router.post('/add-test-rating', protect, async (req, res) => {
  try {
    const user = await require('../models/userModel').findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Add a random rating between 4 and 5
    const rating = 4 + Math.random();
    user.ratings.push(rating);
    await user.save();
    
    res.status(200).json({ 
      message: 'Test rating added successfully',
      rating,
      averageRating: user.averageRating,
      ratings: user.ratings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
