# 💰 Expense Tracker

A personal expense tracking application built with **Next.js, MongoDB, and Tailwind CSS**. Track daily expenses, manage monthly budgets, monitor savings, and understand your spending through category-wise summaries.

## 🚀 Features

- **User Authentication** – Signup, login, logout, and JWT-based authentication.
- **Expense Management** – Add and track expenses with categories, dates, and amounts.
- **Monthly Summary** – View total monthly expenses and category-wise spending.
- **Daily Expense Tracking** – Calculate expenses for a selected date.
- **Budget Management** – Manage monthly budgets and savings.
- **Available Budget** – Automatically calculate remaining budget after expenses.
- **Savings Tracking** – Display available savings.
- **Category Summary** – View spending distribution by category and percentage.
- **Recent Expenses** – View recently added expenses.
- **Protected Routes** – Restrict dashboard access to authenticated users.


## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Frontend and backend APIs |
| React | UI components and state management |
| MongoDB | Database |
| Mongoose | Database modeling and queries |
| Tailwind CSS | Styling |
| bcryptjs | Password hashing |
| jose | JWT authentication |
| lucide-react | Icons |


expense-tracker/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/
│   │   │   ├── signin/
│   │   │   ├── logout/
│   │   │   └── me/
│   │   └── expense/
│   │       ├── route.js
│   │       └── current/
│   │           └── route.js
│   ├── (auth)/
│   │   ├── signin/
│   │   └── signup/
│   └── (home)/
│       ├── layout.jsx
│       └── dashboard/
├── components/
├── lib/
│   ├── auth.js
│   ├── password.js
│   └── mongo.js
├── models/
│   ├── User.js
│   ├── Expense.js
│   ├── Category.js
│   └── Budget.js
├── public/
├── .env.local
├── package.json
└── README.md
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd expense-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Generate a secure JWT secret:

```bash
openssl rand -base64 32
```

### 4. Run the development server

```bash
npm run dev
```

Open:

http://localhost:3000

## 🔐 Authentication

The application uses JWT authentication with HTTP-only cookies.

- Passwords are hashed using bcryptjs.
- JWT tokens are signed using jose.
- Authentication cookies are HTTP-only.
- Protected pages verify the authenticated user.
- Expense records are associated with individual users.

## 📊 Expense Summary

The application calculates:

- Total expenses
- Category-wise expenses
- Category spending percentages
- Monthly budget
- Remaining budget
- Budget utilization percentage

Example API response:

```json
{
  "success": true,
  "year": 2026,
  "month": 11,
  "totalExpense": 150,
  "categorySummary": [
    {
      "name": "Food",
      "price": 150,
      "percentage": 100
    }
  ],
  "monthlyBudget": 10000,
  "budgetRemaining": 9850,
  "budgetUsedPercentage": 2
}
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/signin` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get authenticated user |

### Expenses

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/expense` | Add expense |
| GET | `/api/expense` | Fetch expenses |
| GET | `/api/expense/current?type=daily&date=YYYY-MM-DD` | Daily expense summary |
| GET | `/api/expense/current?type=monthly&month=November&year=2026` | Monthly expense summary |

## 🔒 Security

- Passwords are never stored as plain text.
- JWT secrets are stored in environment variables.
- Authentication uses HTTP-only cookies.
- Expense queries are filtered by authenticated user ID.
- Protected APIs validate authentication before accessing user data.

## 📌 Future Improvements

- Interactive charts and spending analytics.
- Expense editing and deletion.
- Export expenses to CSV or PDF.
- Notifications for budget limits.
- Recurring expense support.
- Improved dashboard analytics.

## 👩‍💻 Author

Developed as a personal finance management project using Next.js and MongoDB.
