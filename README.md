# Expense Tracker - Full Stack MERN Application

A modern Expense Tracker Web Application built with MongoDB, Express.js, React.js, and Node.js.

## 🎯 Features

- **Authentication**: User registration and login with JWT
- **Category Management**: Create, edit, and delete income/expense categories
- **Transaction Management**: Add, edit, delete transactions with filters
- **Dashboard Analytics**: 
  - Total income, expenses, and balance
  - Pie charts for expense/income breakdown by category
  - Bar chart for monthly income vs expense comparison
  - Line chart for balance trend over time
- **Responsive Design**: Mobile and desktop friendly UI

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React.js with Vite
- React Router
- Tailwind CSS
- Recharts for data visualization
- Lucide React for icons
- Axios for API calls

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

## 🚀 Setup and Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd finacebuget
```

### 2. Backend Setup

Navigate to the server directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Create a `.env` file with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb+srv://natihailug_db_user:33CppfK8eZSQzNBI@cluster0.7ylaesq.mongodb.net/?appName=Cluster0
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

### 3. Frontend Setup

Navigate to the client directory:
```bash
cd ../client
```

Install dependencies:
```bash
npm install
```

## 🏃‍♂️ Running the Application

### Option 1: Manual Startup

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm run dev
```
The backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend Server:**
```bash
cd client
npm run dev
```
The frontend will run on `http://localhost:5173`

### Option 2: Concurrent Startup (Recommended)

From the root directory, you can run both servers concurrently:

**Using npm scripts (add these to package.json):**
```json
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "cd server && npm run dev",
    "client": "cd client && npm run dev"
  }
}
```

Then run:
```bash
npm run dev
```

## 📱 Application Usage

### 1. Register/Login
- Create a new account or login with existing credentials
- Only single user role (no admin panel)

### 2. Categories Management
- Navigate to Categories page
- Add income and expense categories
- Edit or delete existing categories

### 3. Transactions Management
- Navigate to Transactions page
- Add new transactions with amount, type, category, and description
- Filter transactions by category, type, or date range
- Edit or delete existing transactions

### 4. Dashboard Analytics
- View total income, expenses, and balance
- Analyze expense breakdown by category (pie chart)
- Analyze income breakdown by category (pie chart)
- Compare monthly income vs expenses (bar chart)
- Track balance trend over time (line chart)

## 🗂️ Project Structure

```
finacebuget/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React Context (Auth)
│   │   ├── pages/          # Page components
│   │   └── App.jsx         # Main App component
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js Backend
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   ├── middleware/         # Custom middleware
│   ├── .env               # Environment variables
│   ├── index.js           # Server entry point
│   └── package.json
└── README.md
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Categories
- `GET /api/categories` - Get user categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Transactions
- `GET /api/transactions` - Get user transactions (with filters)
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats` - Get dashboard statistics

## 🔧 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

## 🎨 UI Features

- **Responsive Design**: Works on mobile and desktop
- **Modern UI**: Clean interface with Tailwind CSS
- **Interactive Charts**: Data visualization with Recharts
- **Form Validation**: Client-side validation for all forms
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages

## 🚦 Development Notes

- The frontend proxy is configured to forward `/api` requests to the backend
- JWT tokens are stored in localStorage and sent with API requests
- All routes are protected except login/register
- Data validation is implemented on both client and server sides
- MongoDB connection is established with proper error handling

## 📝 Future Enhancements

- Export transactions to CSV/PDF
- Budget tracking and alerts
- Recurring transactions
- Multi-currency support
- Dark mode
- Transaction receipts/upload
- Advanced reporting features

## 🐛 Troubleshooting

1. **MongoDB Connection Issues**: Verify your MongoDB URI in the .env file
2. **Port Conflicts**: Ensure ports 5000 and 5173 are available
3. **CORS Issues**: The backend is configured to allow frontend requests
4. **JWT Issues**: Check that JWT_SECRET is set in your .env file

## 📄 License

This project is licensed under the MIT License.
