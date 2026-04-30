// ======================= ExpenseFilters.jsx =======================
import { FiFilter, FiArrowDown, FiArrowUp } from 'react-icons/fi';

export function ExpenseFilters({
                                   categories,
                                   selectedCategory,
                                   onCategoryChange,
                                   sortOrder,
                                   onSortChange,
                               }) {
    return (
        <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
            <div className="relative group w-full sm:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <FiFilter className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="select-field pl-9 py-2 text-sm w-full sm:w-44 bg-gray-50 border-gray-200 hover:border-gray-300 focus:bg-white font-medium text-gray-700 cursor-pointer appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <button
                onClick={() =>
                    onSortChange(sortOrder === 'date_desc' ? 'date_asc' : 'date_desc')
                }
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 active:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all w-full sm:w-auto"
            >
                {sortOrder === 'date_desc' ? (
                    <>
                        <FiArrowDown className="w-4 h-4 text-primary-500" />
                        <span>Newest</span>
                    </>
                ) : (
                    <>
                        <FiArrowUp className="w-4 h-4 text-primary-500" />
                        <span>Oldest</span>
                    </>
                )}
            </button>
        </div>
    );
}