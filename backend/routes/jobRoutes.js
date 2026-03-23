// Job routes

const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getUserJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyForJob,
  updateApplicantStatus,
  getAppliedJobs,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getJobs);
router.get('/:id', getJobById);

// Protected routes
router.post('/', protect, createJob);
router.get('/user/jobs', protect, getUserJobs);
router.get('/user/applied', protect, getAppliedJobs);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);
router.post('/:id/apply', protect, applyForJob);
router.put('/:id/applicants/:userId', protect, updateApplicantStatus);

module.exports = router;
