# Boris - Task Management Application

A full-stack task management application designed to help users organize, prioritize, and track their work efficiently. Built with Django REST Framework for the backend and Next.js for a modern, responsive frontend.

![Boris Dashboard](./screenshots/dashboard.png)

## 🚀 Features

### Task Management
- ✅ Create, read, update, and delete tasks
- 📊 **Task Priorities**: Low, Medium, High, Urgent
- 🔄 **Task Status Tracking**: Pending, In Progress, Completed
- 📅 **Due Dates**: Set and track task deadlines
- 🏷️ **Tags & Categories**: Organize tasks with custom tags and categories
- ⚠️ **Overdue Detection**: Automatically identifies overdue tasks

### User Features
- 👤 User Registration & Authentication
- 🔐 JWT-based Authentication
- 📊 Dashboard with statistics and overview
- 🔔 Notifications
- ⏰ Reminders System
-

## 📁 Project Structure

```
boris/
├── backend/                    # Django REST API
│   ├── backend/               # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── tasks/                 # Task management app
│   │   ├── models.py          # Task model definition
│   │   ├── views.py           # API endpoints
│   │   ├── serializers.py     # DRF serializers
│   │   ├── urls.py            # Task routes
│   │   └── migrations/
│   ├── manage.py
│   ├── requirements.txt
│   └── db.sqlite3
│
├── frontend/                   # Next.js React Application
│   ├── src/
│   │   ├── app/               # Next.js app directory
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── dashboard/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── tasks/
│   │   │   ├── reminders/
│   │   │   └── settings/
│   │   ├── components/        # Reusable React components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TaskModal.tsx
│   │   │   ├── DashboardStats.tsx
│   │   │   └── ...
│   │   ├── context/           # React Context (Auth)
│   │   └── lib/               # Utilities
│   │       └── api.ts         # API client
│   ├── package.json
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
└── README.md                  # This file
```

## 🔧 Prerequisites

### System Requirements
- **Node.js**: v18 or higher (for frontend)
- **Python**: v3.9 or higher (for backend)
- **npm** or **yarn**: Package manager for Node.js
- **pip**: Python package manager


## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/oduordaizy/boris.git
cd boris
```

### 2. Backend Setup

See [backend/README.md](backend/README.md) for detailed backend setup instructions.

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional, for admin panel)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

See [frontend/README.md](frontend/README.md) for detailed frontend setup instructions.

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🚀 Quick Start

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Admin Panel (optional):**
Navigate to `http://localhost:8000/admin` and log in with your superuser credentials.

### Build for Production

**Backend:**
```bash
cd backend
pip install gunicorn
gunicorn backend.wsgi:application
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

## 🏗️ Project Architecture

### Backend Architecture

**Framework**: Django REST Framework
- **Authentication**: JWT (djangorestframework-simplejwt)
- **API Documentation**: Swagger/OpenAPI (drf-yasg)
- **Database**: SQLite (development) / PostgreSQL (production)

## 📡 API Documentation

### Authentication
All endpoints except `/auth/register` and `/auth/login` require JWT authentication.

**Header:**
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

**Tasks**
- `GET /tasks/` - List all tasks for the authenticated user
- `POST /tasks/` - Create a new task
- `GET /tasks/{id}/` - Retrieve task details
- `PUT /tasks/{id}/` - Update a task
- `PATCH /tasks/{id}/` - Partially update a task
- `DELETE /tasks/{id}/` - Delete a task

**Filters Available:**
- `status`: Filter by task status (pending, in_progress, completed)
- `priority`: Filter by task priority (low, medium, high, urgent)
- `category`: Filter by category
- `overdue`: Filter overdue tasks (true/false)

**Example Request:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/tasks/?status=pending&priority=high
```

For full API documentation, visit `http://localhost:8000/swagger/` when the server is running.

