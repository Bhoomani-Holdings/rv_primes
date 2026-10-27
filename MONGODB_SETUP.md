# MongoDB Connection and Setup

This guide explains how the application connects to MongoDB, which files are involved, and how to run it locally or against a shared database.

## Files involved

| File | Purpose |
| --- | --- |
| `backend/.env.example` | Safe starter configuration. It contains the local MongoDB URI and backend port. Copy it to `backend/.env` for local development. |
| `backend/.env` | Local, private configuration read by the backend. Keep real credentials here; this file is ignored by Git. |
| `backend/package.json` | Backend start scripts and dependencies, including Mongoose (the MongoDB library), Express, and dotenv. |
| `backend/package-lock.json` | Locks backend dependency versions for consistent installs. |
| `backend/server.js` | Connects to MongoDB, defines the dashboard document schema, initializes seed data, and exposes API routes that read and write data. |
| `backend/data/dashboard.json` | Initial seed data used when the MongoDB dashboard document does not exist. It is not the live store after initialization. |
| `src/services/dashboardService.js` | Frontend API calls for loading dashboard and project data and creating or updating projects. It calls the backend; it does not connect directly to MongoDB. |
| `.gitignore` | Excludes `.env` files and dependencies from Git while allowing `.env.example` to be committed. |

## How the data flows

```text
React app (localhost:5173)
        -> HTTP API (localhost:5000)
        -> Express + Mongoose (backend/server.js)
        -> MongoDB (local server or shared MongoDB deployment)
        -> Compass displays the same database
```

The browser should never connect directly to MongoDB. The backend keeps the database credentials private and handles reads and writes.

The current backend stores the dashboard in `rvprimes.dashboard`, in the document whose `_id` is `primary`. Project records are elements of that document's `projects` array. The `GET /api/projects` endpoint returns that array. Creating or editing a project calls the backend, which saves the updated dashboard document to MongoDB.

## Local setup (each developer has their own database)

1. Install **MongoDB Community Server** and **MongoDB Compass**. Compass is a database viewer; Community Server runs the database.
2. Start the MongoDB service. On Windows, check its status in PowerShell:

   ```powershell
   Get-Service MongoDB
   ```

   If needed, start it from an elevated PowerShell window:

   ```powershell
   Start-Service MongoDB
   ```

3. Clone the repository and open a terminal in the project root.
4. Install frontend dependencies:

   ```powershell
   npm install
   ```

5. In a second terminal, prepare and install the backend:

   ```powershell
   cd backend
   Copy-Item .env.example .env
   npm install
   ```

6. Confirm `backend/.env` contains the local settings:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/rvprimes
   ```

7. Start the backend from the `backend` folder:

   ```powershell
   npm run dev
   ```

   On first startup, it seeds `backend/data/dashboard.json` into MongoDB if the `primary` dashboard document is missing. Leave this terminal running.

8. In a third terminal, from the repository root, start the frontend:

   ```powershell
   npm run dev
   ```

9. Open the Vite URL printed in the terminal, usually `http://localhost:5173`.
10. Verify the backend is connected by opening `http://localhost:5000/api/health`. The response should report `"status":"success"` and `"database":"rvprimes"`.
11. In Compass, connect to:

    ```text
    mongodb://127.0.0.1:27017
    ```

    Expand **`rvprimes` → `dashboard`**, refresh the collection, and inspect the document with `_id: "primary"`. Expand its `projects` array to see project entries.

With this local setup, each developer has a separate database on their own computer. Project data added by one developer will not automatically appear on another developer's computer.

## Shared database setup (everyone sees the same data)

To share data between developers, use a hosted MongoDB deployment such as MongoDB Atlas or a MongoDB server reachable by all developers.

1. Create a database deployment and a database user with the permissions the application needs.
2. Configure network access to allow the developers and backend host to connect. Avoid opening access to everyone unless you understand the security implications.
3. Copy the deployment's connection URI. Include the database name `rvprimes` and URL-encode special characters in the username or password if required by the provider.
4. Each developer creates `backend/.env` from `backend/.env.example` and sets `MONGODB_URI` to the shared URI. Never commit the real URI or password.
5. Connect Compass to that same URI. Start the backend and frontend using steps 7–8 above.

Everyone using that URI will work with the same database. Share credentials through a secure password manager or secret store, not in source code or chat history.

## Useful API endpoints

| URL | Purpose |
| --- | --- |
| `http://localhost:5000/api/health` | Shows whether the backend is connected and the connected database name. |
| `http://localhost:5000/api/dashboard` | Returns the dashboard document's data. |
| `http://localhost:5000/api/projects` | Returns the projects array. |

`dashboard.json` is a seed/fallback source, not a live sync file. After data has been seeded, normal app changes are saved to MongoDB. Editing the JSON does not update an already initialized database.
