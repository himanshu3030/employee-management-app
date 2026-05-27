# Employee Management System

A full stack web app to manage employees and their attendance. Built with React, Node.js, Express and MongoDB.

---

## Project Structure

```
project-root/
├── frontend/         # React app
├── backend/          # Node.js + Express API
├── .gitignore
└── README.md
```

---

## Prerequisites

Make sure you have these installed before starting:

- Node.js (v18 or above)
- MongoDB (local or MongoDB Atlas)
- A Gmail account (for OTP emails)

---

########################################### Backend Setup ####################################################



### 1. Go into the backend folder

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your .env file

Create a new file called `.env` inside the `backend` folder. You can copy the example file:

```bash
cp .env.example .env
```

Now open `.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/employee_management
JWT_SECRET=write_any_long_random_string_here
JWT_REFRESH_SECRET=write_another_long_random_string_here
ADMIN_EMAIL=your_email@gmail.com
ADMIN_PASSWORD=your_admin_password
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

**Important notes on the .env values:**

- `MONGO_URI` — if you're using MongoDB Atlas, paste your connection string here instead
- `JWT_SECRET` and `JWT_REFRESH_SECRET` — just type any random long string, these are used to sign tokens
- `EMAIL_USER` and `EMAIL_PASS` — this is for sending OTP emails. Use your Gmail and a **Gmail App Password** (not your actual Gmail password). To generate an app password: Google Account → Security → 2-Step Verification → App Passwords
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` — this will be your login credentials for the app

### 4. Seed the admin account

This creates the admin user in the database using the email and password from your `.env`:

```bash
node seedAdmin.js
```

### 5. (Optional) Seed employee data

If you want 30 dummy employees for testing:

```bash
node seedEmployees.js
```

> Note: this will delete any existing employees and insert fresh ones

### 6. Start the backend

```bash
npm run dev
```

Backend will start on `http://localhost:5000`

---

############################################### Frontend Setup ################################################

### 1. Open a new terminal and go into the frontend folder

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Tailwind
take refrence from here `https://tailwindcss.com/docs/installation/using-vite`

### 4. Start the frontend

```bash
npm run dev
```

Frontend will open at `http://localhost:5173`

---

## How to Login

1. Open `http://localhost:5173`
2. Enter the email and password you set in `.env` as `ADMIN_EMAIL` and `ADMIN_PASSWORD`
3. An OTP will be sent to your email
4. Enter the OTP to complete login

---

## Features

- Admin login with OTP verification
- JWT authentication (access token expires in 5 mins, refresh token in 7 days)
- Add, edit, view employees with proper validations
- Search and paginate employee list
- Attendance auto-marked every day at 12:00 AM for all employees
- Attendance editable only on the same day
- Filter attendance by date or employee

---

## Important — Before Pushing to GitHub

Make sure you have a `.gitignore` file in the root of your project with at least this:

```
node_modules/
.env
```

Also add the same inside both `frontend/` and `backend/` folders if you have separate `.gitignore` files there.

**Never push your `.env` file to GitHub.** It contains your Gmail password and JWT secrets. If you accidentally push it, change your Gmail app password immediately and generate new JWT secrets.

The `.env.example` file is safe to push — it has no real values, just shows what keys are needed.

---

## API Base URL

All API requests go to: `http://localhost:5000/api`

Main routes:
- `POST /api/auth/login` — step 1 login
- `POST /api/auth/verify-otp` — step 2 OTP verify
- `GET /api/employees` — list employees
- `POST /api/employees` — add employee
- `PUT /api/employees/:id` — update employee
- `GET /api/attendance` — list attendance
- `PUT /api/attendance/:id` — update today's attendance
