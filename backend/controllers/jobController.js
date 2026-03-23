const asyncHandler = require('express-async-handler');
const Job = require('../models/jobModel');
const User = require('../models/userModel');

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private
const createJob = asyncHandler(async (req, res) => {
  const { title, description, location, salary, deadline } = req.body;

  if (!title || !description || !location) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  const job = await Job.create({
    title,
    description,
    location,
    salary,
    deadline,
    posterId: req.user._id,
  });

  res.status(201).json(job);
});

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({})
    .populate('posterId', 'name email profilePic averageRating')
    .sort({ createdAt: -1 });

  res.status(200).json(jobs);
});

// @desc    Get user jobs
// @route   GET /api/jobs/user
// @access  Private
const getUserJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ posterId: req.user._id })
    .populate('posterId', 'name email profilePic averageRating')
    .sort({ createdAt: -1 });

  res.status(200).json(jobs);
});

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate('posterId', 'name email profilePic averageRating')
    .populate('applicants.user', 'name email profilePic averageRating');

  if (job) {
    res.status(200).json(job);
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check if user is job poster
  if (job.posterId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized to update this job');
  }

  const updatedJob = await Job.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
    .populate('posterId', 'name email profilePic averageRating')
    .populate('applicants.user', 'name email profilePic averageRating');

  res.status(200).json(updatedJob);
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check if user is job poster
  if (job.posterId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized to delete this job');
  }

  await job.deleteOne();

  res.status(200).json({ id: req.params.id, message: 'Job deleted successfully' });
});

// @desc    Apply for job
// @route   POST /api/jobs/:id/apply
// @access  Private
const applyForJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check if user is trying to apply to their own job
  if (job.posterId.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot apply to your own job');
  }

  // Check if user has already applied
  const alreadyApplied = job.applicants.find(
    (applicant) => applicant.user.toString() === req.user._id.toString()
  );

  if (alreadyApplied) {
    res.status(400);
    throw new Error('You have already applied to this job');
  }

  // Add user to applicants array
  job.applicants.push({
    user: req.user._id,
    status: 'pending',
    appliedAt: Date.now(),
  });

  await job.save();

  // Return the updated job
  const updatedJob = await Job.findById(req.params.id)
    .populate('posterId', 'name email profilePic averageRating')
    .populate('applicants.user', 'name email profilePic averageRating');

  res.status(200).json(updatedJob);
});

// @desc    Update applicant status
// @route   PUT /api/jobs/:id/applicants/:userId
// @access  Private
const updateApplicantStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status || !['pending', 'accepted', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Please provide a valid status');
  }

  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check if user is job poster
  if (job.posterId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized to update applicant status');
  }

  // Find applicant in job's applicants array
  const applicantIndex = job.applicants.findIndex(
    (applicant) => applicant.user.toString() === req.params.userId
  );

  if (applicantIndex === -1) {
    res.status(404);
    throw new Error('Applicant not found');
  }

  // Update applicant status
  job.applicants[applicantIndex].status = status;

  await job.save();

  // Return the updated job
  const updatedJob = await Job.findById(req.params.id)
    .populate('posterId', 'name email profilePic averageRating')
    .populate('applicants.user', 'name email profilePic averageRating');

  res.status(200).json(updatedJob);
});

// @desc    Get user's applied jobs
// @route   GET /api/jobs/applied
// @access  Private
const getAppliedJobs = asyncHandler(async (req, res) => {
  const appliedJobs = await Job.find({
    'applicants.user': req.user._id,
  })
    .populate('posterId', 'name email profilePic averageRating')
    .sort({ createdAt: -1 });

  res.status(200).json(appliedJobs);
});

module.exports = {
  createJob,
  getJobs,
  getUserJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyForJob,
  updateApplicantStatus,
  getAppliedJobs,
}; 