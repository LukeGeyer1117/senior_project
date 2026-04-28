#!/bin/bash

set -e

echo "Installing project dependencies..."

# Install frontend dependencies (Vite, React, R3F, Tailwind, DaisyUI, etc.)
echo "Installing frontend dependencies..."
cd gravity_sim
npm install
cd ..

# Install backend dependencies
echo "Installing backend dependencies..."
cd db
npm install
cd ..

# Set up database schema
echo "Setting up database..."
cd db
if [ -f "../db/schema.sql" ]; then
    sqlite3 database.sqlite < ../db/schema.sql 2>/dev/null || echo "Note: sqlite3 not found or schema already applied"
fi
cd ..

echo "Installation complete!"
echo ""
echo "To run the project:"
echo "  Frontend: cd gravity_sim && npm run dev"
echo "  Backend:  cd db && node server.js"
