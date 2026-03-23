const express = require('express');
const router = express.Router();
const { getUserTransactions, getTransactionById } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

// Route: /api/transactions
router.route('/').get(protect, getUserTransactions);

// Route: /api/transactions/:id
router.route('/:id').get(protect, getTransactionById);

module.exports = router; 