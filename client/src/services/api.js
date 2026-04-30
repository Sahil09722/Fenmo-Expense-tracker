import axios from 'axios';

/**
 * API Service with retry logic for network resilience
 *
 * Features:
 * - Automatic retries with exponential backoff for network failures
 * - Centralized error handling
 * - Request/response interceptors
 */

const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Retry configuration
 */
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const RETRYABLE_STATUS_CODES = [408, 500, 502, 503, 504];

/**
 * Sleep utility for retry delays
 */
const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Request interceptor for logging (development)
 */
api.interceptors.request.use(
    (config) => {
        if (import.meta.env.DEV) {
            console.log(
                `[API] ${config.method?.toUpperCase()} ${config.url}`
            );
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Response interceptor for error handling + retry
 */
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;

        // Don't retry if no config or retry count exceeded
        if (!config || config._retryCount >= MAX_RETRIES) {
            return Promise.reject(error);
        }

        // Initialize retry count
        config._retryCount = config._retryCount || 0;

        // Check if error is retryable
        const isNetworkError = !error.response;
        const isRetryableStatus =
            error.response &&
            RETRYABLE_STATUS_CODES.includes(error.response.status);

        if (isNetworkError || isRetryableStatus) {
            config._retryCount += 1;

            // Exponential backoff
            const delay =
                RETRY_DELAY_MS * Math.pow(2, config._retryCount - 1);

            console.log(
                `[API] Retry ${config._retryCount}/${MAX_RETRIES} after ${delay}ms`
            );

            await sleep(delay);
            return api(config);
        }

        return Promise.reject(error);
    }
);

/**
 * API Methods
 */
export const expenseAPI = {
    /**
     * Get all expenses with optional filters
     * @param {Object} params - Query parameters (category, sort)
     */
    getExpenses: async (params = {}) => {
        const response = await api.get('/expenses', { params });
        return response.data;
    },

    /**
     * Create a new expense
     * @param {Object} expense - Expense data with idempotencyKey
     */
    createExpense: async (expense) => {
        const response = await api.post('/expenses', expense);
        return response.data;
    },

    /**
     * Get available categories
     */
    getCategories: async () => {
        const response = await api.get('/expenses/categories');
        return response.data;
    },
};

export default api;