import { useState, useEffect, useRef } from 'react';
import { FiPlus, FiCalendar } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * Expense Form Component
 *
 * Handles:
 * - Client-side validation
 * - Idempotency key generation (prevents duplicate submissions)
 * - Double-click prevention (disabled state during submission)
 * - Form reset on successful submission
 */
export function ExpenseForm({ categories, onSubmit, isSubmitting }) {
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    const [errors, setErrors] = useState({});
    const [idempotencyKey, setIdempotencyKey] = useState(uuidv4());

    // Ref to track if form is submitting to prevent double submissions
    const isSubmittingRef = useRef(false);

    /**
     * Generate new idempotency key when form is reset
     */
    const resetForm = () => {
        setFormData({
            amount: '',
            category: '',
            description: '',
            date: new Date().toISOString().split('T')[0]
        });
        setErrors({});
        setIdempotencyKey(uuidv4()); // New key for next submission
    };

    /**
     * Client-side validation
     */
    const validateForm = () => {
        const newErrors = {};

        // Amount validation
        if (!formData.amount) {
            newErrors.amount = 'Amount is required';
        } else {
            const numAmount = parseFloat(formData.amount);
            if (isNaN(numAmount) || numAmount <= 0) {
                newErrors.amount = 'Amount must be a positive number';
            } else if (numAmount > 10000000) {
                newErrors.amount = 'Amount cannot exceed ₹1,00,00,000';
            }
        }

        // Category validation
        if (!formData.category) {
            newErrors.category = 'Please select a category';
        }

        // Description validation
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length > 500) {
            newErrors.description = 'Description cannot exceed 500 characters';
        }

        // Date validation
        if (!formData.date) {
            newErrors.date = 'Date is required';
        } else {
            const selectedDate = new Date(formData.date);
            const today = new Date();
            today.setHours(23, 59, 59, 999);

            if (selectedDate > today) {
                newErrors.date = 'Date cannot be in the future';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent double submission
        if (isSubmittingRef.current || isSubmitting) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        isSubmittingRef.current = true;

        const result = await onSubmit(
            {
                ...formData,
                amount: parseFloat(formData.amount)
            },
            idempotencyKey
        );

        isSubmittingRef.current = false;

        if (result.success) {
            resetForm();
        }
    };

    /**
     * Handle input changes
     */
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Amount */}
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (₹)
                    </label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        step="0.01"
                        min="0.01"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="0.00"
                        className={`input-field ${errors.amount ? 'border-red-500 focus:ring-red-500' : ''}`}
                        disabled={isSubmitting}
                    />
                    {errors.amount && (
                        <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
                    )}
                </div>

                {/* Category */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`select-field ${errors.category ? 'border-red-500 focus:ring-red-500' : ''}`}
                        disabled={isSubmitting}
                    >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    {errors.category && (
                        <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                    )}
                </div>

                {/* Date */}
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            max={new Date().toISOString().split('T')[0]}
                            className={`input-field ${errors.date ? 'border-red-500 focus:ring-red-500' : ''}`}
                            disabled={isSubmitting}
                        />
                    </div>
                    {errors.date && (
                        <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="What did you spend on?"
                        maxLength={500}
                        className={`input-field ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                        disabled={isSubmitting}
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                    )}
                </div>

            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <LoadingSpinner size="sm" className="text-white" />
                            Adding...
                        </>
                    ) : (
                        <>
                            <FiPlus className="w-4 h-4" />
                            Add Expense
                        </>
                    )}
                </button>
            </div>

        </form>
    );
}
