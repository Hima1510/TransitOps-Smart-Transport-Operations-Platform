# TransitOps - Smart Transport Operations Platform

TransitOps is a full-stack fleet and transport operations platform designed to help organizations manage vehicles, drivers, trips, maintenance, fuel usage, expenses, and operational insights from a unified interface. It combines a modern React frontend with a TypeScript-based Express backend and a local SQL-based data store.

## Overview

TransitOps provides a practical control center for fleet operations with:

- A responsive dashboard for operational KPIs and fleet health
- Vehicle and driver management workflows
- Trip lifecycle tracking and dispatch support
- Maintenance scheduling and visibility
- Fuel and expense logging
- Role-based access for different business personas

## Key Features

### Fleet Operations
- Manage fleet vehicles with status, region, and utilization data
- Track driver records, safety scores, and licensing details
- Create and monitor trips from planning through completion
- Log maintenance tasks and close them once resolved
- Record fuel and other operational expenses

### Intelligence & Monitoring
- Real-time dashboard metrics such as active vehicles, utilization, and trips
- Attention-based insights for expiring licenses and maintenance issues
- Role-specific views for fleet managers, drivers, safety officers, and financial analysts

### Security & Access Control
- Secure authentication with email and password
- JWT-based session handling
- Protected routes and API endpoints
- Role-based authorization for sensitive operations

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Recharts for data visualization
- Lucide React icons

### Backend
- Node.js
- Express.js
- TypeScript
- JWT authentication
- SQL.js with a local SQLite-backed database
- Zod for schema validation

## Project Structure

```text
backend/        # Express API, routes, services, and database layer
frontend/       # React application and UI components
```

## Prerequisites

Before running the project, ensure the following are installed:

- Node.js 18+ recommended
- npm 9+

## Installation

Install dependencies for both the backend and frontend:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Running the Application

### Start the Backend

Open a terminal and run:

```bash
cd backend
npm run dev
```

The backend server will start on:
- http://localhost:3001

### Start the Frontend

Open a second terminal and run:

```bash
cd frontend
npm run dev
```

The frontend will be available at:
- http://localhost:5173

### Health Check

You can verify the backend is running at:
- http://localhost:3001/api/health

If port 3001 is already in use, you can start the backend on another port and point Vite at the same port:

```powershell
cd backend
$env:PORT = "3002"
npm run dev

cd ..\frontend
$env:VITE_BACKEND_PORT = "3002"
npm run dev
```

## Demo Data

The backend includes a seed script that populates sample users, vehicles, drivers, trips, and expenses.

Run:

```bash
cd backend
npm run seed
```

## Demo Credentials

After seeding the database, you can sign in with the following demo accounts:

- fleet@transitops.io
- driver@transitops.io
- safety@transitops.io
- finance@transitops.io

Password for all demo accounts:

```text
demo1234
```

## Supported Roles

The platform supports the following roles:

- fleet_manager
- driver
- safety_officer
- financial_analyst

## Available Scripts

### Backend

From the backend folder:

- npm run dev — start the API in watch mode
- npm run build — compile the TypeScript backend
- npm run start — run the built server from dist/index.js
- npm run seed — populate the local database with demo data

### Frontend

From the frontend folder:

- npm run dev — start the Vite development server
- npm run build — build the production bundle
- npm run preview — preview the production build locally

## API Overview

The backend exposes RESTful endpoints under the /api namespace, including:

- /api/auth — login and registration
- /api/vehicles — vehicle operations and vehicle details
- /api/drivers — driver records and profiles
- /api/trips — trip creation, dispatch, completion, and cancellation
- /api/maintenance — maintenance records and closure actions
- /api/fuel — fuel logs
- /api/expenses — expense tracking
- /api/dashboard — KPI and operational dashboard data

Most routes are protected with authentication and role-based access control.

## Notes

- The backend stores its local database in backend/transitops.db
- If authentication fails, confirm that the backend is running and the database has been seeded
- The frontend is configured to proxy API requests to the backend on port 3001

## License

This project is licensed under the MIT License. See the LICENSE file for details.

