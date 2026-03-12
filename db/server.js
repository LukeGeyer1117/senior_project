const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS so REACT app can call this API
app.use(cors());
app.use(express.json());

// Connect to SQLite db
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error("Failed to connect with database:", err);
    else console.log("Connected to SQLite database.");
});

// Import routers
const presetsRouter = require('./routes/presets')(db);
const planetsRouter = require('./routes/planets')(db);

// Mount routers
app.use("/api/presets", presetsRouter);
app.use("/api/presets", planetsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});