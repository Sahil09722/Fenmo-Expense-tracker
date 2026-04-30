import {useState, useEffect} from 'react';
import {FiDollarSign, FiPieChart, FiList} from 'react-icons/fi';
import {useExpenses} from './hooks/useExpenses';
import {ExpenseForm} from './components/ExpenseForm';
import {ExpenseFilters} from './components/ExpenseFilters';
import {ExpenseList, ExpenseTotal} from './components/ExpenseList';
import {ExpenseSummary} from './components/ExpenseSummary';
import {LoadingOverlay} from './components/LoadingSpinner';
import {ErrorAlert} from './components/ErrorAlert';

function App() {
    const {
        expenses,
        total,
        loading,
        error,
        categories,
        selectedCategory,
        sortOrder,
        fetchExpenses,
        fetchCategories,
        createExpense,
        filterByCategory,
        changeSortOrder,
        clearError
    } = useExpenses();

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchExpenses();
    }, []);

    const handleCreateExpense = async (expenseData, idempotencyKey) => {
        setIsSubmitting(true);
        const result = await createExpense(expenseData, idempotencyKey);
        setIsSubmitting(false);
        return result;
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 font-sans selection:bg-primary-200">
            {/* Elegant Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-xl shadow-sm text-white">
                            <FiDollarSign className="w-6 h-6 stroke-[2.5]"/>
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Fenmo Tracker</h1>
                            <p className="text-xs text-gray-500 font-medium">Smart expense management</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                <ErrorAlert message={error} onDismiss={clearError}/>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Form & Summary */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Expense Form Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary-600"></div>
                            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                                Add New Expense
                            </h2>
                            <ExpenseForm
                                categories={categories}
                                onSubmit={handleCreateExpense}
                                isSubmitting={isSubmitting}
                            />
                        </div>

                        {/* Category Summary */}
                        {!loading && expenses.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                                    <FiPieChart className="text-primary-500" /> Spending Overview
                                </h2>
                                <ExpenseSummary expenses={expenses}/>
                            </div>
                        )}
                    </div>

                    {/* Right Column: List & Filters */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Total Status Card */}
                        {!loading && expenses.length > 0 && (
                            <ExpenseTotal total={total} count={expenses.length}/>
                        )}

                        {/* List Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[500px] flex flex-col">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <FiList className="text-primary-500 shrink-0" /> Recent Transactions
                                </h2>
                                <ExpenseFilters
                                    categories={categories}
                                    selectedCategory={selectedCategory}
                                    onCategoryChange={filterByCategory}
                                    sortOrder={sortOrder}
                                    onSortChange={changeSortOrder}
                                />
                            </div>

                            <div className="flex-1 relative">
                                {loading ? (
                                    <div className="absolute inset-0 flex mt-10 justify-center">
                                        <LoadingOverlay message="Fetching your latest expenses..."/>
                                    </div>
                                ) : (
                                    <ExpenseList expenses={expenses}/>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;