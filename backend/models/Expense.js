const mongoose = require('mongoose');

/**
 * Expense Schema
 *
 * Key design decisions:
 * - amount: Using Decimal128 for precise money handling (avoids floating-point errors)
 * - idempotencyKey: Unique key to prevent duplicate expenses on client retries
 * - Indexes on date, category, and idempotencyKey for query performance
 */

const expenseSchema = new mongoose.Schema(
    {
        amount: {
            type: mongoose.Schema.Types.Decimal128,
            required: [true, 'Amount is required'],
            validate: {
                validator: function (value) {
                    return parseFloat(value.toString()) > 0;
                },
                message: 'Amount must be a positive number',
            },
        },

        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
            maxlength: [50, 'Category cannot exceed 50 characters'],
        },

        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },

        date: {
            type: Date,
            required: [true, 'Date is required'],
            validate: {
                validator: function (value) {
                    return value <= new Date();
                },
                message: 'Date cannot be in the future',
            },
        },
        idempotencyKey: {
            type: String,
            required: [true, 'Idempotency key is required'],
            unique: true,
            index: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                ret.amount = parseFloat(ret.amount.toString());
                return ret;
            },
        },
        toObject: {
            transform: function (doc, ret) {
                ret.amount = parseFloat(ret.amount.toString());
                return ret;
            },
        },
    }
);

expenseSchema.index({date: -1});
expenseSchema.index({category: 1});
expenseSchema.index({category: 1, date: -1});

module.exports = mongoose.model('Expense', expenseSchema);