const asyncHandler = require('express-async-handler');
const Course = require('../models/courseModel');
const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = asyncHandler(async (req, res) => {
  const { title, description, cost, content, category, thumbnailUrl } = req.body;

  if (!title || !description || !cost || !content || !category) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  // Validate cost range
  if (cost < 150 || cost > 300) {
    res.status(400);
    throw new Error('Course cost must be between 150 and 300 coins');
  }

  const course = await Course.create({
    title,
    description,
    cost,
    content,
    category,
    thumbnailUrl: thumbnailUrl || 'default-course.jpg',
  });

  res.status(201).json(course);
});

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({}).sort({ createdAt: -1 });
  res.status(200).json(courses);
});

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    res.status(200).json(course);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (req.body.cost && (req.body.cost < 150 || req.body.cost > 300)) {
    res.status(400);
    throw new Error('Course cost must be between 150 and 300 coins');
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedCourse);
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  await course.deleteOne();

  res.status(200).json({ id: req.params.id, message: 'Course deleted successfully' });
});

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
const enrollInCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const user = await User.findById(req.user._id);

  // Check if user has already enrolled
  const alreadyEnrolled = user.redeemedCourses.find(
    (courseId) => courseId.toString() === course._id.toString()
  );

  if (alreadyEnrolled) {
    res.status(400);
    throw new Error('You are already enrolled in this course');
  }

  // Check if user has enough coins
  if (user.coins < course.cost) {
    res.status(400);
    throw new Error(`Not enough coins. You need ${course.cost} coins but have ${user.coins}`);
  }

  // Deduct coins from user
  user.coins -= course.cost;

  // Add course to user's redeemed courses
  user.redeemedCourses.push(course._id);

  // Add user to course's enrolled users
  course.enrolledUsers.push(user._id);

  // Create transaction record
  await Transaction.create({
    user: user._id,
    type: 'course_redemption',
    amount: -course.cost,
    description: `Enrolled in course: ${course.title}`,
    course: course._id,
    balance: user.coins
  });

  // Save user and course
  await user.save();
  await course.save();

  res.status(200).json({
    message: `Successfully enrolled in ${course.title}`,
    remainingCoins: user.coins,
    course,
  });
});

// @desc    Get user's enrolled courses
// @route   GET /api/courses/enrolled
// @access  Private
const getEnrolledCourses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('redeemedCourses');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json(user.redeemedCourses);
});

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getEnrolledCourses,
}; 