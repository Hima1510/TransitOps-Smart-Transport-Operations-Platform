# TransitOps - Smart Transport Operations Platform

TransitOps is a full-stack fleet operations platform for managing vehicles, drivers, trips, maintenance, fuel logs, and expenses.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: `sql.js` with a local SQLite file

## Project Structure

- `frontend/` - React app and UI
- `backend/` - Express API and database layer

## Prerequisites

- Node.js 18+ recommended
- npm

## Install Dependencies

Install dependencies in both apps:

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

## Run the Project

Start the backend in one terminal:

```powershell
cd backend
npm run dev
```

Start the frontend in another terminal:

```powershell
cd frontend
npm run dev
```

## URLs

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`
- Health check: `http://localhost:3001/api/health`

## Seed Demo Data

The backend includes a seed script that populates demo users and sample fleet data.

Run it from the `backend` folder:

```powershell
cd backend
npm run seed
```

## Demo Login

Use any of these accounts after seeding:

- `fleet@transitops.io`
- `driver@transitops.io`
- `safety@transitops.io`
- `finance@transitops.io`

Password for all demo users:

- `demo1234`

## Backend Scripts

From `backend/`:

- `npm run dev` - start the API in watch mode
- `npm run build` - compile TypeScript
- `npm run start` - run the compiled server from `dist/index.js`
- `npm run seed` - populate the database with demo data

## Frontend Scripts

From `frontend/`:

- `npm run dev` - start the Vite dev server
- `npm run build` - type-check and build for production
- `npm run preview` - preview the production build

## API Overview

The backend exposes REST endpoints under `/api`, including:

- `/api/auth`
- `/api/vehicles`
- `/api/drivers`
- `/api/trips`
- `/api/maintenance`
- `/api/fuel`
- `/api/expenses`
- `/api/dashboard`

Most routes are protected with JWT authentication.

## Notes

- The backend stores data in `backend/transitops.db`.
- If login fails, make sure the backend is running and the database has been seeded.
- The frontend proxies `/api` requests to `http://localhost:3001`.

