# 🚚 TransitOps — Smart Transport Operations Platform

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square"/>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white&style=flat-square"/>
  <img alt="Express" src="https://img.shields.io/badge/Express.js-Backend-000000?logo=express&logoColor=white&style=flat-square"/>
  <img alt="Vite" src="https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white&style=flat-square"/>
  <img alt="SQLite" src="https://img.shields.io/badge/SQL.js-SQLite-003B57?logo=sqlite&logoColor=white&style=flat-square"/>
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green?style=flat-square"/>
</p>

<p align="center">
  <b>A unified control center for fleet operations — vehicles, drivers, trips, maintenance, fuel, and expenses — built for speed, clarity, and role-based decision making.</b>
</p>

<p align="center">
  <a href="#-demo">Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-roadmap">Roadmap</a> •
  <a href="#-team">Team</a>
</p>

---

## 📌 Overview

**TransitOps** is a full-stack fleet and transport operations platform that helps organizations manage their entire mobility operation from a single, real-time dashboard. It replaces spreadsheets and disconnected tools with one system that fleet managers, drivers, safety officers, and financial analysts can all rely on — each with a view tailored to their role.

Built for **[Hackathon Name] 2026**, TransitOps demonstrates how a lean, well-architected full-stack app can solve a real operational problem: fragmented visibility across vehicles, people, and money in a transport business.

> 💡 **Problem it solves:** Fleet operators today juggle spreadsheets, WhatsApp groups, and paper logs to track vehicle health, driver licensing, trip status, and fuel spend — leading to missed maintenance windows, expired licenses, and poor cost visibility. TransitOps centralizes all of it with real-time KPIs and proactive alerts.

---

## 🎥 Demo

<p align="center">
  <img src="./screenshots/demo.gif" alt="TransitOps Demo" width="85%"/>
</p>

🎬 **Video Walkthrough:** https://drive.google.com/file/d/1eyvuXQGLIdxAIR3wHtNlhl5yMDHB9XwY/view?usp=drive_link

---

## ✨ Features

### 🚗 Fleet Operations
- Manage fleet vehicles with live status, region, and utilization tracking
- Maintain driver records including safety scores and licensing details
- Full trip lifecycle — plan, dispatch, monitor, and complete trips
- Maintenance scheduling with open/close tracking
- Fuel and operational expense logging

### 📊 Intelligence & Monitoring
- Real-time dashboard with KPIs: active vehicles, utilization %, ongoing trips
- Proactive alerts for **expiring licenses** and **overdue maintenance**
- Role-specific dashboards for fleet managers, drivers, safety officers, and financial analysts
- Visual analytics powered by Recharts

### 🔐 Security & Access Control
- Email/password authentication with hashed credentials
- JWT-based session handling
- Protected routes on both frontend and backend
- Fine-grained role-based authorization (RBAC) for sensitive actions

---

## 🏗️ Architecture

```text
┌─────────────────────┐        REST/JSON        ┌──────────────────────┐
│   React Frontend     │ <---------------------> │   Express Backend     │
│  (Vite + TS + Tailwind)                        │  (Node.js + TS)       │
│  Recharts, Router     │                        │  JWT Auth, Zod        │
└─────────────────────┘                          └──────────┬───────────┘
                                                              │
                                                              ▼
                                                   ┌──────────────────────┐
                                                   │  SQL.js (SQLite)      │
                                                   │  backend/transitops.db│
                                                   └──────────────────────┘
```

---

## 🛠️ Tech Stack

**Frontend**
- React 19, TypeScript, Vite
- React Router
- Tailwind CSS
- Recharts (data visualization)
- Lucide React (icons)

**Backend**
- Node.js, Express.js, TypeScript
- JWT authentication
- SQL.js with local SQLite-backed storage
- Zod for schema validation

---

## 📂 Project Structure

```text
transitops/
├── backend/        # Express API, routes, services, database layer
│   ├── src/
│   ├── transitops.db
│   └── package.json
├── frontend/        # React application and UI components
│   ├── src/
│   └── package.json
├── screenshots/      # README screenshots & demo assets
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Clone & Install

```bash
git clone https://github.com/<your-username>/transitops.git
cd transitops

cd backend && npm install
cd ../frontend && npm install
```

### 2. Seed Demo Data

```bash
cd backend
npm run seed
```

### 3. Run the Backend

```bash
cd backend
npm run dev
```
Backend runs at **http://localhost:3001**

### 4. Run the Frontend

In a new terminal:

```bash
cd frontend
npm run dev
```
Frontend runs at **http://localhost:5173**

### 5. Health Check

Confirm the backend is live:
```
http://localhost:3001/api/health
```

### Using a Different Port (Windows / PowerShell)

```powershell
cd backend
$env:PORT = "3002"
npm run dev

cd ..\frontend
$env:VITE_BACKEND_PORT = "3002"
npm run dev
```

---

## 🔑 Demo Credentials

After seeding the database, sign in with any of the following:

| Role | Email | Password |
|---|---|---|
| Fleet Manager | `fleet@transitops.io` | `demo1234` |
| Driver | `driver@transitops.io` | `demo1234` |
| Safety Officer | `safety@transitops.io` | `demo1234` |
| Financial Analyst | `finance@transitops.io` | `demo1234` |

---

## 👥 Supported Roles

- `fleet_manager`
- `driver`
- `safety_officer`
- `financial_analyst`

---

## 📜 Available Scripts

**Backend** (`/backend`)
| Command | Description |
|---|---|
| `npm run dev` | Start the API in watch mode |
| `npm run build` | Compile the TypeScript backend |
| `npm run start` | Run the built server from `dist/index.js` |
| `npm run seed` | Populate the local database with demo data |

**Frontend** (`/frontend`)
| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the production bundle |
| `npm run preview` | Preview the production build locally |

---

## 🔌 API Overview

All endpoints are namespaced under `/api` and most are protected via JWT + role-based access control.

| Endpoint | Description |
|---|---|
| `/api/auth` | Login and registration |
| `/api/vehicles` | Vehicle operations and details |
| `/api/drivers` | Driver records and profiles |
| `/api/trips` | Trip creation, dispatch, completion, cancellation |
| `/api/maintenance` | Maintenance records and closure actions |
| `/api/fuel` | Fuel logs |
| `/api/expenses` | Expense tracking |
| `/api/dashboard` | KPI and operational dashboard data |

---

## 🧠 What We Learned / Challenges *(hackathon reflection — customize this)*

Briefly describe:
- A key technical challenge and how your team solved it
- Something new you learned during the build
- What you'd do differently with more time

---

## 🏆 Team

| Name | Role | GitHub |
|---|---|---|
| Hima Mehta | Full-Stack Developer |
| Chandni Kothari | Full-Stack Developer |
| Kairavi Padhariya | Frontend / UI |
| Akshara Pandya | Frontend / UI |

---

## 📝 Notes

- The backend stores its local database at `backend/transitops.db`
- If authentication fails, confirm the backend is running and the database has been seeded
- The frontend proxies API requests to the backend on port `3001`

---

<p align="center">Made with ❤️ for Odoo 2026</p>
