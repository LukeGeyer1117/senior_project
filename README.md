# Gravity Simulator

A 3D gravity simulation built with React, Three.js, and Tailwind CSS.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)
- [sqlite3](https://www.sqlite.org/) (for database setup)

## Setup

### 1. Make the installation script executable

```bash
chmod +x installations.sh
```

### 2. Run the installation script

```bash
./installations.sh
```

This will:
- Install all frontend dependencies (Vite, React, React Three Fiber, Tailwind CSS, DaisyUI, etc.) in `gravity_sim/`
- Install all backend dependencies (Express, SQLite, bcrypt, cors, dotenv) in `db/`
- Set up the SQLite database schema

### 3. Start the backend server

In a terminal window:

```bash
cd db
node server.js
```

The API server will start running on the configured port.

### 4. Start the frontend dev server

In a separate terminal window:

```bash
cd gravity_sim
npm run dev
```

The app will be available at the local Vite dev server URL (typically `http://localhost:5173`).

## Project Structure

```
senior_project/
├── gravity_sim/          # Frontend React app
│   ├── src/
│   │   ├── components/   # R3F components, UI controls, etc.
│   │   ├── pages/        # Home, About, GridTest pages
│   │   └── App.tsx
│   ├── public/           # Textures, audio, assets
│   └── package.json
├── db/                   # Backend Express API
│   ├── routes/           # API routes (users, planets, stars, presets)
│   ├── schema.sql        # Database schema
│   └── server.js
└── installations.sh      # Setup script
```

## Technologies

- **Frontend**: React 19, Vite 7, Tailwind CSS 4, DaisyUI 5, React Three Fiber, Three.js
- **Backend**: Express.js, SQLite3
