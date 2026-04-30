const Expense = require('../models/Expense');
const {asyncHandler} = require('../middleware/errorHandler');
const {SORT_OPTIONS, EXPENSE_CATEGORIES} = require('../utils/constants');

/**
 * @desc    Create a new expense
 * @route   POST /expenses
 *
 * Handles idempotency: If an expense with the same idempotencyKey exists,
 * returns the existing expense instead of creating a duplicate.
 * This ensures safe retries from the client.
 */
const createExpense = asyncHandler(async (req, res) => {
    const {amount, category, description, date, idempotencyKey} =
        req.validatedExpense;

    // Check if expense with this idempotency key already exists
    const existingExpense = await Expense.findOne({idempotencyKey}).lean();

    if (existingExpense) {
        // Return existing expense with 200 to indicate idempotent success
        return res.status(200).json({
            message: 'Expense already recorded',
            expense: {
                ...existingExpense,
                id: existingExpense._id.toString(),
                amount: parseFloat(existingExpense.amount.toString())
            },
            isDuplicate: true,
        });
    }

    const expense = await Expense.create({
        amount,
        category,
        description,
        date,
        idempotencyKey,
    });

    const expenseObj = expense.toObject();

    res.status(201).json({
        message: 'Expense created successfully',
        expense: {
            ...expenseObj,
            id: expenseObj._id.toString(),
            amount: parseFloat(expenseObj.amount.toString())
        },
    });
});

/**
 * @desc    Get all expenses with optional filtering and sorting
 * @route   GET /expenses
 *
 * Query params:
 * - category: Filter by category (exact match)
 * - sort: Sort order (date_desc for newest first)
 */
const getExpenses = asyncHandler(async (req, res) => {
    const {category, sort} = req.query;

    const filter = {};
    if (category && category.trim() !== '') {
        filter.category = category.trim();
    }

    let sortOptions = {createdAt: -1};

    if (sort === SORT_OPTIONS.DATE_DESC) {
        sortOptions = {date: -1};
    } else if (sort === SORT_OPTIONS.DATE_ASC) {
        sortOptions = {date: 1};
    }

    const expenses = await Expense.find(filter)
        .sort(sortOptions)
        .lean();

    // Convert Decimal128 to number for each expense
    const formattedExpenses = expenses.map(expense => ({
        ...expense,
        id: expense._id.toString(),
        amount: parseFloat(expense.amount.toString())
    }));

    const total = formattedExpenses.reduce((sum, expense) => {
        return sum + expense.amount;
    }, 0);

    res.status(200).json({
        count: formattedExpenses.length,
        total: Math.round(total * 100) / 100,
        expenses: formattedExpenses,
    });
});

/**
 * @desc    Get expense categories (for frontend dropdown)
 * @route   GET /expenses/categories
 */
const getCategories = asyncHandler(async (req, res) => {
    res.status(200).json({
        categories: EXPENSE_CATEGORIES,
    });
});

module.exports = {
    createExpense,
    getExpenses,
    getCategories,
};