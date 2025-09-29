
# 🏦 Capital Bank Application

A modern, professional **Bank Web Application** built with **React, Node.js, Express, and MongoDB**.  
This app provides a simulated digital banking experience with secure login/register, transaction management, and profile settings.

---

## 🚀 Features

- 🔐 **Authentication**: User Registration & User Login  
- 👤 **User Dashboard**: Overview of the users account
  - Display **current balance**
  - **Recent transactions** list transactions
- 💰 **Transactions**:
  - Deposit / Withdraw funds
  - Transfer funds between accounts
- ⚙️ **Profile Management**:
  - Update profile details (phone, ID number, name, etc.)
- 📊 **Banking Features**:
  - Notifications
  - Cards
  - Spending Limits
  - Statements
- 🎨 **Modern UI**:
  - Sidebar navigation with icons
  - Dark mode (under settings)
  - Professional bank-themed design
  - Responsive layout
- 🔒 **Protected Routes** using JWT authentication

---

## 🛠️ Tech Stack

- **Frontend**: React, React Router, Tailwind CSS, React Icons  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (Mongoose ORM)  
- **Authentication**: JWT (JSON Web Tokens)  

---

## 📂 Project Structure



bank-app/
│── client/ # React frontend
│ ├── src/
│ │ ├── pages/ # Login, Register, Dashboard, etc.
│ │ ├── components/ # PrivateRoute, Navbar, Sidebar
│ │ ├── App.js
│ │ └── index.js
│── server/ # Express backend
│ ├── models/ # User, Transactions
│ ├── routes/ # API endpoints
│ └── server.js
│── README.md

------
📸 Screenshots
## 1. Home
<img width="1355" height="646" alt="Home" src="https://github.com/user-attachments/assets/66dc1bac-6e4b-42d1-b67c-690044d3fc34" />

## 2.  Dashboard
<img width="1366" height="768" alt="Dashboard" src="https://github.com/user-attachments/assets/11053a92-667b-4534-a001-ad9c25a7f2a8" />

## 3. Deposit/Withdraw
<img width="1356" height="642" alt="DepositWithdraw" src="https://github.com/user-attachments/assets/c7150206-8787-4d2f-9853-44d4cd237847" />


---

## ⚡ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/capital-bank.git
cd capital-bank

2. Install Dependencies
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

3. Configure Environment

Create a .env file in the server directory with:

PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret

4. Run the App
# Start backend
cd server
npm start

# Start frontend (in another terminal)
cd client
npm start

📜 License

This project is licensed under the MIT License.

👨‍💻 Author: Antony Mwandiki

Name: Antony Mwandiki

GitHub: https://github.com/MwandikiAntony

Email: antonymwandiki23@gmail.com



