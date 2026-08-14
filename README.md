# SELCO Innovation Benchmarking Dashboard

A dashboard to track and benchmark SELCO's innovation solutions. Data comes from an Excel file stored on OneDrive, read through the Microsoft Graph API. The dashboard shows solution counts, sector breakdowns, benchmarking status, and lets you browse and compare individual solutions.

## Tech stack

Frontend: React (Vite), React Router, Recharts, Axios, Socket.IO client
Backend: Node.js, Express, Microsoft Graph API (via MSAL), Socket.IO

## Project structure

```
backend/    Express API, Excel/Graph integration, in-memory cache, WebSocket server
frontend/   React app (Dashboard, Solution Explorer, Benchmarking Tracker pages)
```

## How it works

The backend downloads the Excel file from OneDrive every 30 seconds, checks if it actually changed, and only re-parses it if it did. When it changes, the backend pushes an update to every connected browser tab over a WebSocket, so the dashboard refreshes on its own without needing a page reload.

## Pages

- **Dashboard**: overview KPIs, sector breakdown, benchmarking status, recent solutions
- **Solution Explorer**: browse, search, filter, and view details of every solution
- **Benchmarking Tracker**: track documentation progress across solutions (Not Started / In Progress / Done), with priority filtering and CSV export

## Running locally

### Backend

```
cd backend
npm install
```

Create a `.env` file in `backend/` with:

```
TENANT_ID=...
CLIENT_ID=...
CLIENT_SECRET=...
DRIVE_ID=...
FILE_ID=...
```

These come from an Azure app registration with access to the OneDrive file. Ask whoever set up the Azure app for these values.

Start the server:

```
npm start
```

Runs on `http://localhost:5000` by default.

### Frontend

```
cd frontend
npm install
```

Create a `.env` file in `frontend/` with:

```
VITE_API_BASE_URL=http://localhost:5000
```

Start the dev server:

```
npm run dev
```

Runs on `http://localhost:5173` by default.

## Deployment

Hosted on AWS EC2. The backend needs to run as an always-on service (not serverless), since it keeps data in memory and polls Excel in the background - it runs under PM2 so it restarts on crash and on server reboot. nginx serves the built frontend and reverse-proxies `/api` and `/socket.io` requests to the backend.

CORS on the backend is restricted to the deployed frontend URL and localhost, so update `ALLOWED_ORIGINS` in `backend/server.js` if the frontend URL changes.