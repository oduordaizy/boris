# Boris - Frontend Application

Modern, responsive React application for the Boris task management system. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion for a delightful user experience.

## 🎨 Features

- ✨ **Modern UI**: Clean, responsive design with Tailwind CSS
- 🎬 **Smooth Animations**: Enhanced UX with Framer Motion
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🔐 **Authentication**: Secure user registration and login
- 📊 **Task Management**: Create, read, update, delete tasks
- 🎯 **Task Filtering**: Filter by status, priority, and category
- 📅 **Date Handling**: Intuitive date pickers and formatting with date-fns
- 🔔 **Notifications**: Real-time notification center
- ⏰ **Reminders**: Task reminder system
- 📈 **Dashboard**: Overview of your tasks and statistics
- ⚙️ **Settings**: User preferences and configuration
- 📱 **Mobile-Friendly**: Fully responsive for all devices

## 📋 Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development](#development)
- [Building](#building)
- [Deployment](#deployment)
- [Component Documentation](#component-documentation)
- [Styling](#styling)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Troubleshooting](#troubleshooting)

## 🔧 Requirements

- Node.js 18.0 or higher
- npm 9.0 or higher (or yarn/pnpm)
- A code editor (VS Code recommended)

## 📦 Installation

### 1. Install Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install packages
npm install
```

**Dependencies Installed:**
- `next@16.2.3` - React framework
- `react@19.2.4` - UI library
- `react-dom@19.2.4` - React DOM rendering
- `typescript@5` - Type safety
- `tailwindcss@4.2.2` - CSS framework
- `framer-motion@12.38.0` - Animation library
- `lucide-react@1.8.0` - Icon library
- `date-fns@4.1.0` - Date utilities

### 2. Environment Configuration

Create `.env.local` in the `frontend/` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Optional - for production
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

### 3. Verify Installation

```bash
npm run dev
```

Visit `http://localhost:3000` - you should see the login page.

## 🚀 Quick Start

### Development Server

```bash
npm run dev
```

Opens automatically at `http://localhost:3000`

**Features:**
- Hot module reloading
- Fast refresh for instant feedback
- Source maps for debugging

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   ├── globals.css               # Global styles
│   │   ├── page.module.css           # Page-specific styles
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Dashboard page
│   │   │
│   │   ├── tasks/
│   │   │   └── page.tsx              # Tasks page
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx              # Login page
│   │   │
│   │   ├── register/
│   │   │   └── page.tsx              # Registration page
│   │   │
│   │   ├── reminders/
│   │   │   └── page.tsx              # Reminders page
│   │   │
│   │   └── settings/
│   │       └── page.tsx              # Settings page
│   │
│   ├── components/                   # Reusable Components
│   │   ├── Navbar.tsx                # Top navigation bar
│   │   ├── Sidebar.tsx               # Side navigation
│   │   ├── TaskModal.tsx             # Task creation/edit modal
│   │   ├── DashboardStats.tsx        # Dashboard statistics
│   │   ├── NotificationCenter.tsx    # Notifications
│   │   ├── AttentionPanel.tsx        # Attention/alerts panel
│   │   └── ... (other components)
│   │
│   ├── context/                      # React Context
│   │   └── AuthContext.tsx           # Authentication state
│   │
│   ├── lib/                          # Utilities
│   │   └── api.ts                    # API client setup
│   │
│   └── public/                       # Static assets
│
├── package.json                      # Dependencies
├── next.config.mjs                   # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── postcss.config.mjs                # PostCSS configuration
└── eslint.config.mjs                 # ESLint configuration
```

## 💻 Development

### Creating New Pages

Create a new file in `src/app/`:

```typescript
// src/app/newpage/page.tsx
export default function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
    </div>
  );
}
```

Access at `/newpage`

### Creating New Components

```typescript
// src/components/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export default function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold">{title}</h2>
      {onAction && (
        <button onClick={onAction} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
          Action
        </button>
      )}
    </div>
  );
}
```

### Using TypeScript

```typescript
// Define interfaces for type safety
interface Task {
  id: number;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string | null;
  completed_at: string | null;
}

// Use types in components
type TaskListProps = {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
};

export default function TaskList({ tasks, onTaskClick }: TaskListProps) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id} onClick={() => onTaskClick(task)}>
          {task.title}
        </li>
      ))}
    </ul>
  );
}
```

### Use React Context (Authentication)

```typescript
'use client';

import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export default function ProtectedComponent() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.username}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 🎨 Styling

### Tailwind CSS

All styling uses Tailwind CSS utility classes:

```typescript
<div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
  <div className="p-8 bg-white rounded-lg shadow-lg">
    <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
  </div>
</div>
```

### Custom Styles

For component-specific styles, use CSS modules:

```typescript
// src/components/Button.tsx
import styles from './Button.module.css';

export default function Button() {
  return <button className={styles.primaryBtn}>Click me</button>;
}
```

```css
/* Button.module.css */
.primaryBtn {
  @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600;
}
```

### Dark Mode (if implemented)

```typescript
<div className="dark:bg-gray-900 dark:text-white bg-white text-black">
  Content
</div>
```

## 🎬 Animations

### Framer Motion

```typescript
'use client';

import { motion } from 'framer-motion';

export default function AnimatedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-white rounded-lg shadow"
    >
      Animated content
    </motion.div>
  );
}
```

## 📡 API Integration

### API Client Setup

```typescript
// src/lib/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### Making API Calls

```typescript
'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api';

interface Task {
  id: number;
  title: string;
  // ... other fields
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await apiClient.get('/tasks/');
      setTasks(response.data.results);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Partial<Task>) => {
    try {
      const response = await apiClient.post('/tasks/', taskData);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const updateTask = async (id: number, taskData: Partial<Task>) => {
    try {
      const response = await apiClient.patch(`/tasks/${id}/`, taskData);
      setTasks(tasks.map(t => t.id === id ? response.data : t));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await apiClient.delete(`/tasks/${id}/`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
```

## 📊 State Management

### Context API (Authentication)

```typescript
'use client';

import React, { createContext, useEffect, useState } from 'react';
import apiClient from '@/lib/api';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Verify token exists
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
      // Optionally fetch user data
    }
  };

  const login = async (username: string, password: string) => {
    const response = await apiClient.post('/auth/login/', { username, password });
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (userData: any) => {
    await apiClient.post('/auth/register/', userData);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## 🔧 Configuration

### Next.js Configuration

```javascript
// next.config.mjs
export default {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    return config;
  },
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};
```

### Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
      },
    },
  },
  plugins: [],
}
export default config
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 🏗️ Building

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

This creates an optimized production bundle.

### Build Optimization

The build process:
1. Bundles and minifies code
2. Optimizes images
3. Code splitting for faster load times
4. Tree shaking to remove unused code

## 🚢 Deployment

### Vercel (Recommended for Next.js)

**Push to GitHub:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

**Deploy:**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables:
   - `NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api`
4. Click Deploy

### Netlify

```bash
npm install -g netlify-cli
netlify init
netlify deploy --prod
```

### AWS Amplify

```bash
npm install -g @aws-amplify/cli
amplify init
amplify publish
```

### GitHub Pages

```bash
npm run build
# Export as static site (requires next.config.js changes)
```

### Docker

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

CMD ["npm", "start"]
```

**Build & Run:**
```bash
docker build -t boris-frontend .
docker run -p 3000:3000 boris-frontend
```

## 🔐 Security Best Practices

1. **Never commit `.env` files**
   ```bash
   # Add to .gitignore
   .env.local
   .env.*.local
   ```

2. **Validate user input** before sending to API

3. **HTTPS in production** - Use secure CORS headers

4. **Token management**
   ```typescript
   // Store tokens securely
   localStorage.setItem('access_token', token);
   
   // Clear on logout
   localStorage.clear();
   ```

5. **XSS prevention** - React escapes content by default

## 📋 Component Documentation

### Navbar
- Top navigation bar
- Shows user info
- Logout button
- Mobile responsive menu

### Sidebar
- Side navigation
- Links to main pages
- Collapsible on mobile
- Active page highlighting

### TaskModal
- Modal for creating/editing tasks
- Form validation
- Category and tag selection
- Priority and status dropdowns

### DashboardStats
- Statistics cards
- Task counts by status
- Task counts by priority
- Charts (if implemented)

### NotificationCenter
- Displays notifications
- Real-time updates
- Dismissible alerts

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process on port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Run on different port
npm run dev -- --port 3001
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### API Connection Issues

1. Check `NEXT_PUBLIC_API_URL` in `.env.local`
2. Ensure backend is running
3. Check CORS settings on backend
4. Open browser DevTools → Network tab to see errors

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### TypeScript Errors

```bash
# Check for type errors
npm run type-check
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [date-fns Documentation](https://date-fns.org/docs/Getting-Started)

## ✅ Deployment Checklist

- [ ] Set `NEXT_PUBLIC_API_URL` to production backend
- [ ] Build and test locally: `npm run build`
- [ ] Run production build: `npm start`
- [ ] Test all pages and features
- [ ] Check responsive design on mobile
- [ ] Verify authentication flow
- [ ] Test API integration
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure CDN for assets
- [ ] Set up SSL/HTTPS
- [ ] Configure domain/DNS
- [ ] Set up monitoring

---

**Ready to deploy? Happy coding! 🚀**
