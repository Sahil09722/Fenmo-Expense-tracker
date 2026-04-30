import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { useMemo } from 'react';

/**
 * Calculate total expenses by category
 */
const calculateCategoryTotals = (expenses) => {
    return expenses.reduce((acc, expense) => {
        if (!acc[expense.category]) {
            acc[expense.category] = 0;
        }
        acc[expense.category] += expense.amount;
        return acc;
    }, {});
};

/**
 * Format amount as Indian Rupees
 */
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
};

/**
 * Expense Summary Component
 */
export function ExpenseSummary({ expenses }) {
    const categoryTotals = calculateCategoryTotals(expenses);

    const sortedCategories = Object.entries(categoryTotals).sort(
        ([, a], [, b]) => b - a
    );

    if (sortedCategories.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No data available for summary
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {sortedCategories.map(([category, total], index) => (
                <div
                    key={category}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                    <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-700">{category}</span>
                        {index === 0 ? (
                            <FiTrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                            <FiTrendingDown className="w-4 h-4 text-gray-400" />
                        )}
                    </div>
                    <span className="font-semibold text-gray-900">
                        {formatCurrency(total)}
                    </span>
                </div>
            ))}
        </div>
    );
}
