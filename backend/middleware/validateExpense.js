const {EXPENSE_CATEGORIES, VALIDATION} = require('../utils/constants');

/**
 * Validation middleware for expense creation
 * Performs comprehensive validation before hitting the database
 */
const validateExpense = (req, res, next) => {
    const errors = [];
    const {amount, category, description, date, idempotencyKey} = req.body;

    // Amount validation
    if (amount === undefined || amount === null || amount === '') {
        errors.push('Amount is required');
    } else {
        const numAmount = parseFloat(amount);

        if (isNaN(numAmount)) {
            errors.push('Amount must be a valid number');
        } else if (numAmount < VALIDATION.MIN_AMOUNT) {
            errors.push(`Amount must be at least ${VALIDATION.MIN_AMOUNT}`);
        } else if (numAmount > VALIDATION.MAX_AMOUNT) {
            errors.push(`Amount cannot exceed ${VALIDATION.MAX_AMOUNT.toLocaleString()}`);
        }

        // Check for too many decimal places (money should have max 2 decimals)
        const decimalParts = amount.toString().split('.');
        if (decimalParts[1] && decimalParts[1].length > 2) {
            errors.push('Amount can have maximum 2 decimal places');
        }
    }

    // Category validation
    if (!category || typeof category !== 'string' || category.trim() === '') {
        errors.push('Category is required');
    } else if (category.length > VALIDATION.MAX_CATEGORY_LENGTH) {
        errors.push(`Category cannot exceed ${VALIDATION.MAX_CATEGORY_LENGTH} characters`);
    } else if (!EXPENSE_CATEGORIES.includes(category.trim())) {
        errors.push(`Invalid category. Must be one of: ${EXPENSE_CATEGORIES.join(', ')}`);
    }

    // Description validation
    if (!description || typeof description !== 'string' || description.trim() === '') {
        errors.push('Description is required');
    } else if (description.length > VALIDATION.MAX_DESCRIPTION_LENGTH) {
        errors.push(`Description cannot exceed ${VALIDATION.MAX_DESCRIPTION_LENGTH} characters`);
    }

    // Date validation
    if (!date) {
        errors.push('Date is required');
    } else {
        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            errors.push('Invalid date format');
        } else {
            const today = new Date();
            today.setHours(23, 59, 59, 999);

            if (parsedDate > today) {
                errors.push('Date cannot be in the future');
            }
        }
    }

    // Idempotency key validation
    if (!idempotencyKey || typeof idempotencyKey !== 'string' || idempotencyKey.trim() === '') {
        errors.push('Idempotency key is required for duplicate prevention');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            error: 'Validation failed', details: errors,
        });
    }

    // Sanitize and attach validated data to request
    req.validatedExpense = {
        amount: parseFloat(amount),
        category: category.trim(),
        description: description.trim(),
        date: new Date(date),
        idempotencyKey: idempotencyKey.trim(),
    };

    next();
};

module.exports = validateExpense;