// ======================= ErrorAlert.jsx =======================
import { FiAlertCircle, FiX } from 'react-icons/fi';

export function ErrorAlert({ message, onDismiss }) {
    if (!message) return null;

    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
                <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <p className="text-red-700 text-sm">{message}</p>
                </div>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="text-red-400 hover:text-red-600 transition-colors"
                        aria-label="Dismiss error"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}

// ======================= SuccessAlert.jsx =======================
export function SuccessAlert({ message, onDismiss }) {
    if (!message) return null;

    return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"></div>
                <div className="flex-1">
                    <p className="text-green-700 text-sm">{message}</p>
                </div>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="text-green-400 hover:text-green-600 transition-colors"
                        aria-label="Dismiss"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}