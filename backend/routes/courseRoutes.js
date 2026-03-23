// Course routes

const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getEnrolledCourses,
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Protected routes
router.post('/', protect, createCourse); // In a real app, this would be admin-protected
router.put('/:id', protect, updateCourse); // In a real app, this would be admin-protected
router.delete('/:id', protect, deleteCourse); // In a real app, this would be admin-protected
router.post('/:id/enroll', protect, enrollInCourse);
router.get('/user/enrolled', protect, getEnrolledCourses);

module.exports = router;
