# MERN Starter Project

This is a starter project for building a MERN (MongoDB, Express, React, Node.js) stack application.

## Project Structure

- `/backend`: Contains the Express.js server-side application.
- `/frontend`: Contains the React.js client-side application.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or a cloud instance)

## Getting Started

### 1. Clone the repository (or download the code)

```bash
git clone <repository-url>
cd mern-starter
```

### 2. Set up the Backend

Navigate to the `backend` directory and install the dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add your MongoDB connection string:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Start the backend development server:

```bash
npm run dev
```

The server will be running on `http://localhost:5000`.

### 3. Set up the Frontend

In a new terminal, navigate to the `frontend` directory and install the dependencies:

```bash
cd ../frontend
npm install
```

Start the frontend development server:

```bash
npm start
```

The React app will open in your browser at `http://localhost:3000`.
