import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { expenseAPI } from '../services/api';

/**
 * Custom hook for expense operations
 *
 * Features:
 * - Centralized state management for expenses
 * - Idempotency key generation for safe retries
 * - Loading and error states
 * - Filter and sort state management
 */
export function useExpenses() {
    const [expenses, setExpenses] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);

    // Filter and sort state
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortOrder, setSortOrder] = useState('date_desc');

    /**
     * Fetch expenses with current filters
     */
    const fetchExpenses = useCallback(
        async (params = {}) => {
            setLoading(true);
            setError(null);

            try {
                const queryParams = {
                    ...(params.category || selectedCategory
                        ? { category: params.category || selectedCategory }
                        : {}),
                    sort: params.sort || sortOrder,
                };

                const data = await expenseAPI.getExpenses(queryParams);
                setExpenses(data.expenses);
                setTotal(data.total);
            } catch (err) {
                console.error('Failed to fetch expenses:', err);
                setError(
                    err.response?.data?.error ||
                    'Failed to load expenses. Please try again.'
                );
            } finally {
                setLoading(false);
            }
        },
        [selectedCategory, sortOrder]
    );

    /**
     * Fetch available categories
     */
    const fetchCategories = useCallback(async () => {
        try {
            const data = await expenseAPI.getCategories();
            setCategories(data.categories);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    }, []);

    /**
     * Create a new expense with idempotency key
     */
    const createExpense = useCallback(
        async (expenseData, idempotencyKey) => {
            setLoading(true);
            setError(null);

            try {
                const key = idempotencyKey || uuidv4();

                const data = await expenseAPI.createExpense({
                    ...expenseData,
                    idempotencyKey: key,
                });

                await fetchExpenses();

                return { success: true, data, idempotencyKey: key };
            } catch (err) {
                console.error('Failed to create expense:', err);

                const errorMessage = err.response?.data?.details
                    ? err.response.data.details.join(', ')
                    : err.response?.data?.error ||
                    'Failed to create expense. Please try again.';

                setError(errorMessage);
                return { success: false, error: errorMessage };
            } finally {
                setLoading(false);
            }
        },
        [fetchExpenses]
    );

    /**
     * Update category filter and refetch
     */
    const filterByCategory = useCallback(
        async (category) => {
            setSelectedCategory(category);
            await fetchExpenses({ category });
        },
        [fetchExpenses]
    );

    /**
     * Update sort order and refetch
     */
    const changeSortOrder = useCallback(
        async (sort) => {
            setSortOrder(sort);
            await fetchExpenses({ sort });
        },
        [fetchExpenses]
    );

    /**
     * Clear any errors
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        // State
        expenses,
        total,
        loading,
        error,
        categories,
        selectedCategory,
        sortOrder,

        // Actions
        fetchExpenses,
        fetchCategories,
        createExpense,
        filterByCategory,
        changeSortOrder,
        clearError,
    };
}