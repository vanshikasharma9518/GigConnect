const asyncHandler = require('express-async-handler');
const Transaction = require('../models/transactionModel');

// @desc    Get user's transaction history
// @route   GET /api/transactions
// @access  Private
const getUserTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('course', 'title thumbnailUrl');

  res.json(transactions);
});

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate('course', 'title description thumbnailUrl cost')
    .populate('user', 'name email');

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  // Check if the transaction belongs to the logged-in user
  if (transaction.user._id.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to access this transaction');
  }

  res.json(transaction);
});

module.exports = {
  getUserTransactions,
  getTransactionById,
}; 