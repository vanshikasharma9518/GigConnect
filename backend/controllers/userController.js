const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, age, skills, location } = req.body;

  if (!name || !email || !password || !phone || !age || !skills || !location) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
    age,
    skills,
    location,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      age: user.age,
      profilePic: user.profilePic,
      skills: user.skills,
      location: user.location,
      ratings: user.ratings,
      averageRating: user.averageRating,
      coins: user.coins,
      level: user.level,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      age: user.age,
      profilePic: user.profilePic,
      skills: user.skills,
      location: user.location,
      ratings: user.ratings,
      averageRating: user.averageRating,
      coins: user.coins,
      level: user.level,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('redeemedCourses');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      age: user.age,
      profilePic: user.profilePic,
      skills: user.skills,
      location: user.location,
      ratings: user.ratings,
      averageRating: user.averageRating,
      coins: user.coins,
      level: user.level,
      redeemedCourses: user.redeemedCourses,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.age = req.body.age || user.age;
    user.skills = req.body.skills || user.skills;
    
    if (req.body.location) {
      user.location = {
        country: req.body.location.country || user.location.country,
        state: req.body.location.state || user.location.state,
        city: req.body.location.city || user.location.city,
      };
    }
    
    if (req.body.profilePic) {
      user.profilePic = req.body.profilePic;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      age: updatedUser.age,
      profilePic: updatedUser.profilePic,
      skills: updatedUser.skills,
      location: updatedUser.location,
      ratings: updatedUser.ratings,
      averageRating: updatedUser.averageRating,
      coins: updatedUser.coins,
      level: updatedUser.level,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Rate a user
// @route   POST /api/users/:id/rate
// @access  Private
const rateUser = asyncHandler(async (req, res) => {
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Please provide a valid rating between 1 and 5');
  }

  const userToRate = await User.findById(req.params.id);

  if (!userToRate) {
    res.status(404);
    throw new Error('User not found');
  }

  // Add rating to user's ratings array
  userToRate.ratings.push(rating);
  
  // Save user to trigger pre-save hooks that calculate average
  await userToRate.save();

  res.status(200).json({
    message: 'Rating added successfully',
    averageRating: userToRate.averageRating,
  });
});

// @desc    Convert ratings to coins
// @route   POST /api/users/convert-ratings
// @access  Private
const convertRatingsToCoins = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Allow conversion if averageRating > 0
  const averageRating = user.averageRating;
  if (!averageRating || averageRating <= 0) {
    res.status(400);
    throw new Error('Your average rating must be above 0 to convert to coins');
  }

  const coinsToAdd = Math.round(averageRating * 100);
  const previousCoins = user.coins;

  // Add coins to user
  user.coins += coinsToAdd;

  // Create transaction record
  await Transaction.create({
    user: user._id,
    type: 'rating_conversion',
    amount: coinsToAdd,
    description: `Converted average rating of ${averageRating.toFixed(1)} to ${coinsToAdd} coins`,
    balance: user.coins
  });

  // Reset ratings and set averageRating back to default (3)
  user.ratings = [];
  user.averageRating = 3;
  
  await user.save();
  
  // Force update if needed - sometimes the model middleware might recalculate
  if (user.averageRating !== 3) {
    await User.updateOne(
      { _id: user._id },
      { $set: { averageRating: 3 } }
    );
  }

  res.status(200).json({
    success: true,
    previousCoins,
    newCoinBalance: user.coins,
    coinsAdded: coinsToAdd,
    newAverageRating: 3,
    message: `Successfully converted average rating of ${averageRating.toFixed(1)} to ${coinsToAdd} coins.`
  });
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  rateUser,
  convertRatingsToCoins,
}; 