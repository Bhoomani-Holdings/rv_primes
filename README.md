# RVPrimes

## Local development

### MongoDB Community Server

Install MongoDB Community Server for Windows and start its Windows service. The backend connects to `mongodb://127.0.0.1:27017/rvprimes` by default.

You can check the service in PowerShell:

```powershell
Get-Service MongoDB
```

If it is stopped, start PowerShell as Administrator and run:

```powershell
Start-Service MongoDB
```

### Backend

In a PowerShell window:

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run dev
```

Edit `backend/.env` to change the MongoDB connection string or backend port. On its first successful connection, the backend copies the contents of `backend/data/dashboard.json` into the MongoDB database. Later starts use MongoDB and do not overwrite the database from that file.

The API health endpoint is `http://localhost:5000/api/health`; it reports the MongoDB connection state.

### React app

In a separate PowerShell window from the project root:

```powershell
npm install
npm run dev
```

The React app calls the backend at `http://localhost:5000`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
