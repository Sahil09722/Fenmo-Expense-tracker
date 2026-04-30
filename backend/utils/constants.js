/**
 * Predefined expense categories
 * Using a fixed set ensures consistency in filtering and reporting
 */
const EXPENSE_CATEGORIES = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Personal Care',
    'Other'
];

/**
 * Validation constants
 */
const VALIDATION = {
    MIN_AMOUNT: 0.01,
    MAX_AMOUNT: 10000000,
    MAX_DESCRIPTION_LENGTH: 500,
    MAX_CATEGORY_LENGTH: 50
};

/**
 * Sort options for GET /expenses
 */
const SORT_OPTIONS = {
    DATE_DESC: 'date_desc',
    DATE_ASC: 'date_asc'
};

module.exports = {
    EXPENSE_CATEGORIES,
    VALIDATION,
    SORT_OPTIONS
};