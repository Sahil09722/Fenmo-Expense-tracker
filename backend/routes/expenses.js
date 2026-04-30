const express = require('express');
const router = express.Router();

const {
    createExpense,
    getExpenses,
    getCategories,
} = require('../controllers/expenseController');

const validateExpense = require('../middleware/validateExpense');

/**
 * @route   GET /expenses/categories
 * @desc    Get list of valid expense categories
 */
router.get('/categories', getCategories);

/**
 * @route   GET /expenses
 * @desc    Get all expenses with optional filtering and sorting
 * @query   category - Filter by category
 * @query   sort - Sort order (date_desc for newest first)
 */
router.get('/', getExpenses);

/**
 * @route   POST /expenses
 * @desc    Create a new expense
 * @body    amount, category, description, date, idempotencyKey
 */
router.post('/', validateExpense, createExpense);

module.exports = router;