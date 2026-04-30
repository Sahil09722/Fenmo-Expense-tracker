# Expense Tracker

A full-stack personal expense tracking application built with the MERN stack.

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Frontend**: React (Vite), Tailwind CSS, React Icons
- **Database**: MongoDB Atlas

## Key Design Decisions

### Data Integrity & Money Handling

- **Decimal128**: Used MongoDB's `Decimal128` type for storing amounts to avoid floating-point precision errors common with currency calculations
- **Server-side validation**: All inputs validated on server with detailed error messages
- **Client + Server validation**: Duplicate validation ensures data integrity even if client-side is bypassed

### Handling Real-World Scenarios

| Scenario | Solution |
|----------|----------|
| **Double-click submit** | Idempotency key generated per form session + button disabled during submission |
| **Page refresh after submit** | Idempotency key prevents duplicate creation – server returns existing expense |
| **Network failures/retries** | Axios interceptor with exponential backoff (3 retries) |
| **Slow API responses** | Loading states, disabled form inputs during submission |
| **Duplicate expense prevention** | Unique `idempotencyKey` field with DB index – same key = same expense |

## Idempotency Implementation

The critical feature for handling unreliable networks:

1. Client generates a UUID (`idempotencyKey`) when form loads
2. This key is sent with POST request
3. Server checks if expense with this key exists:
    - If exists: Returns existing expense (200 OK)
    - If not: Creates new expense (201 Created)
4. Key regenerates only after successful submission + form reset

This ensures that clicking submit 5 times, or the request retrying 3 times, results in exactly 1 expense.
### API Design

- **GET /expenses**: Supports `?category=X&sort=date_desc` query params
- **GET /expenses/categories**: Returns valid categories for frontend dropdown
- **POST /expenses**: Requires `idempotencyKey` in request body

### Database Indexing

```javascript
expenseSchema.index({ idempotencyKey: 1 }, { unique: true }); // For idempotency checks
expenseSchema.index({ date: -1 }); // For sorting
expenseSchema.index({ category: 1, date: -1 }); // For filtered + sorted queries
```

## Trade-offs Due to Time Constraints

- **No authentication**: Single-user assumption for simplicity
- **No expense deletion/editing**: Focus on create + read operations
- **No pagination**: Suitable for personal use with limited expenses
- **No date range filtering**: Only category filter implemented
- **Basic tests not included**: Focused on production-ready architecture

## What Was NOT Implemented (Intentionally)

- User authentication (out of scope for this exercise)
- Expense deletion (can add duplicate protection would be needed)
- Complex reporting/charts (basic category summary included)
- Offline support/PWA features
- Unit/integration tests (architecture supports testing)

## Environment Variables
### Backend (`server/.env`)

```
MONGODB_URI=mongodb+srv://...
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)

```
VITE_API_URL=http://localhost:5000
```

## Project Structure

```
server/
├── config/db.js              # MongoDB connection with retry logic
├── models/Expense.js         # Mongoose schema with Decimal128
├── controllers/              # Business logic
├── middleware/               # Validation & error handling
├── routes/                   # API routes
├── utils/constants.js        # Categories, validation rules

client/
├── src/
│   ├── components/           # React components
│   ├── hooks/                # Custom hooks (useExpenses)
│   ├── services/api.js       # Axios with retry logic
│   └── ...
└── README.md
```