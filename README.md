# 🤖 AI Resume Analyzer & Job Match Platform

An AI-powered web application that helps users analyze resumes, calculate ATS scores, and discover matching job opportunities. Built using the MERN stack (MongoDB, Express.js, React, Node.js).

---

## 🚀 Live Demo

🌐 **Frontend:** https://ai-resume-analyzer-amisha0410.vercel.app

⚙️ **Backend API:** https://ai-resume-analyzer-i1nv.onrender.com

---

## ✨ Features

- 🔐 User Authentication (Register & Login)
- 📄 Upload Resume (PDF)
- 🤖 AI Resume Analysis
- 📊 ATS Score Calculation
- 💼 Job Recommendations
- 📁 Resume Management
- 📱 Responsive Design
- ⚡ Fast and Modern UI

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- bcrypt.js

### Deployment
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

---

## 📂 Project Structure

```text
ai-resume-analyzer/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   ├── uploads/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Amishapatel0410/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

---

## ▶️ Run the Project

### Start Backend

```bash
cd server
npm start
```

### Start Frontend

```bash
cd client
npm run dev
```

---

## 🔐 Environment Variables

### Server (`server/.env`)

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
```

### Client (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

For deployment:

```env
VITE_API_URL=https://ai-resume-analyzer-i1nv.onrender.com/api
```

---

## 📸 Screenshots

> Add screenshots in a folder named `screenshots`.

### 🏠 Home Page

![Home](screenshots/home.png)

### 🔐 Login Page

![Login](screenshots/login.png)

### 📄 Resume Upload

![Upload](screenshots/upload.png)

### 📊 Dashboard

![Dashboard](screenshots/dashboard.png)

### 💼 Jobs Page

![Jobs](screenshots/jobs.png)

---

## 🌟 Future Improvements

- AI Interview Question Generator
- Resume History
- Resume Version Comparison
- Skill Gap Analysis
- Email Notifications
- Dark Mode
- Admin Dashboard
- Company Job Portal Integration

---

## 👩‍💻 Author

**Amisha Patel**

- GitHub: https://github.com/Amishapatel0410
- LinkedIn: https://www.linkedin.com/in/amisha-patel-57a6523a1/

---

## 📄 License

This project is licensed under the MIT License.

---

⭐ If you like this project, consider giving it a star on GitHub!
