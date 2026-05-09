# TaskManager

A minimalist, high-performance team task management platform built with the MERN stack. Designed with a focus on speed, strict Role-Based Access Control (RBAC), and a premium monochromatic UI.

## Features

- **Strict Role-Based Access Control (RBAC)**: Distinct permissions for Admin and Member roles to ensure data privacy across projects.
- **Project Workspaces**: Create and manage isolated workspaces for different teams.
- **Kanban-style Task Management**: Efficiently track issues, manage sprints, and update task statuses (Todo, In-Progress, Done).
- **Secure Authentication**: JWT-based authentication with live password validation.
- **Premium UI/UX**: Designed using a custom Zinc monochrome palette and Plus Jakarta Sans typography for a highly professional feel.

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, React Router, Context API
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT) & bcrypt.js

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB connection string (Atlas or Local)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GarvBirdi9/TaskManager.git
   cd TaskManager
   ```

2. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Environment Variables

Create a `.env` file in the `server` directory and add the following variables:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

### Running the Application

**Run Backend (from the `server` directory):**
```bash
npm run dev
```

**Run Frontend (from the `client` directory):**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Demo Credentials

- **Admin Email**: admin@taskmanager.com
- **Admin Password**: Admin@1234
*(Note: To seed these credentials into your fresh database, run `node seed.js` in the server folder).*

---
*Developed as a full-stack assessment project.*
