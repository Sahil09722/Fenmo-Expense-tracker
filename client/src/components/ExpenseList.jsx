import { FiCalendar, FiTag, FiDollarSign } from 'react-icons/fi';

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
 * Format date for display
 */
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

/**
 * Get category color
 */
const getCategoryColor = (category) => {
    const colors = {
        'Food & Dining': 'bg-orange-100 text-orange-700',
        'Transportation': 'bg-blue-100 text-blue-700',
        'Shopping': 'bg-pink-100 text-pink-700',
        'Entertainment': 'bg-purple-100 text-purple-700',
        'Bills & Utilities': 'bg-yellow-100 text-yellow-700',
        'Healthcare': 'bg-red-100 text-red-700',
        'Education': 'bg-indigo-100 text-indigo-700',
        'Travel': 'bg-teal-100 text-teal-700',
        'Personal Care': 'bg-cyan-100 text-cyan-700',
        'Other': 'bg-gray-100 text-gray-700'
    };

    return colors[category] || 'bg-gray-100 text-gray-700';
};

/**
 * Expense List Component
 */
export function ExpenseList({ expenses }) {
    console.log(expenses)
    if (expenses.length === 0) {
        return (
            <div className="text-center py-12">
                <FiDollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No expenses found</p>
                <p className="text-gray-400 text-sm mt-1">Add your first expense above</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {expenses.map((expense) => (
                <div
                    key={expense.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                    {/* Left side: Description and Category */}
                    <div className="flex-1 mb-2 sm:mb-0">
                        <p className="font-medium text-gray-900">{expense.description}</p>
                        <div className="flex items-center gap-3 mt-1">
              <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                      expense.category
                  )}`}
              >
                <FiTag className="w-3 h-3" />
                  {expense.category}
              </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                <FiCalendar className="w-3 h-3" />
                                {formatDate(expense.date)}
              </span>
                        </div>
                    </div>

                    {/* Right side: Amount */}
                    <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(expense.amount)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * Total Display Component
 */
export function ExpenseTotal({ total, count }) {
    return (
        <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg border border-primary-100">
            <div>
                <p className="text-sm text-primary-600 font-medium">
                    Total ({count} expense{count !== 1 ? 's' : ''})
                </p>
            </div>
            <p className="text-2xl font-bold text-primary-700">
                {formatCurrency(total)}
            </p>
        </div>
    );
}
