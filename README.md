# Full-Stack Web Application

## 📌 About the Project

This project is a full-stack web application developed using modern web technologies. It provides a user-friendly frontend, a backend API to handle business logic and data processing, and a database to store and manage information.

The application is built with React.js on the frontend, Node.js and Express.js on the backend, and MySQL for database management. The project is deployed using Vercel, Render, and TiDB Cloud.

## 🛠️ Technologies Used

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Bootstrap (if used)

### Backend
- Node.js
- Express.js
- RESTful API

### Database
- MySQL
- TiDB Cloud

### Deployment
- Vercel – Frontend deployment
- Render – Backend deployment
- TiDB Cloud – Cloud database hosting

## 🏗️ Project Architecture

```text
Frontend (React.js)
       |
       | HTTP Requests (REST API)
       |
Backend (Node.js + Express.js)
       |
       | Database Connection
       |
Database (MySQL / TiDB Cloud)
```

## 🚀 Features

- User-friendly interface built with React.js
- Responsive web design
- RESTful API using Node.js and Express.js
- MySQL database management
- Frontend and backend separated architecture
- Cloud database integration
- Online deployment

<!-- Add your actual project features here -->

## 📂 Project Structure

```text
project-name/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── index.js
│   └── package.json
│
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Posdapal/Ecommerce.git
```

### 2. Navigate to the Project Folder

```bash
cd Ecommerce
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm start
```

If your frontend uses Vite, run:

```bash
npm run dev
```

### 4. Setup Backend

Open another terminal:

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder and configure your environment variables.

Example:

```env
PORT=8081

DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# your secret key for JWT authentication
JWT_SECRET=your_secret_jwt

BAKONG_ACCOUNT_ID=your_account_id
BAKONG_MERCHANT_NAME=your_merchant_name
BAKONG_MERCHANT_CITY=your_merchant_city
BAKONG_TOKEN=your_token
USD_TO_KHR=4100

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:

```bash
npm start
```

Or, if you use Nodemon:

```bash
npm run dev
```

## 🔐 Environment Variables

For security reasons, sensitive information such as database credentials and API keys should be stored in environment variables.

Do not upload your `.env` file to GitHub.

Example `.gitignore`:

```gitignore
node_modules/
.env
```

## 🌐 Deployment

| Technology | Purpose | Platform |
|---|---|---|
| React.js | Frontend | Vercel |
| Node.js & Express.js | Backend API | Render |
| MySQL | Database | TiDB Cloud |

## 📡 Live Demo

- **Admin Frontend:** https://ecommerce-admin-six-sepia.vercel.app/
- **Frontend:** https://ecommerce-frontend-phi-dun.vercel.app/
- **Backend API:** https://ecommerce-backend-vtag.onrender.com

## 👨‍💻 Author

Developed by **Pal Chanposda**

## 📄 License

This project is created for learning, development, and educational purposes.
