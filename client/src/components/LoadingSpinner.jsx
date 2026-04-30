import { FiLoader } from 'react-icons/fi';

/**
 * Loading spinner component
 * Used during API calls and data fetching
 */
export function LoadingSpinner({ size = 'md', className = '' }) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    return (
        <FiLoader
            className={`animate-spin text-primary-600 ${sizeClasses[size]} ${className}`}
        />
    );
}

/**
 * Full page loading state
 */
export function LoadingOverlay({ message = 'Loading...' }) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-500">{message}</p>
        </div>
    );
}
