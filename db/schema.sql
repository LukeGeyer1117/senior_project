-- Users table for authentication
CREATE TABLE IF NOT EXISTS "user" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL CHECK(role IN ('admin', 'user')),
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- The preset table stores the presets for simulations.
-- Presets are collections of planets and stars that can be loaded
-- at simulation startup. Each preset has a name, optional
-- description, and an owner (user_id).
CREATE TABLE IF NOT EXISTS "preset" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "user_id" INTEGER NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);

-- The planet and star tables store the data necessary for creating 
-- their respective bodies in the simulation. Each planet and star
-- contains a link to the preset they belong to.
CREATE TABLE IF NOT EXISTS "planet" (
    -- Primary key and foreign key to preset
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "preset_id" INTEGER NOT NULL,

    -- Body required initial properties
    "mass" REAL NOT NULL,
    "position_x" REAL NOT NULL,
    "position_y" REAL NOT NULL,
    "position_z" REAL NOT NULL,
    "velocity_x" REAL NOT NULL,
    "velocity_y" REAL NOT NULL,
    "velocity_z" REAL NOT NULL,
    "radius" REAL NOT NULL,
    "spin" REAL NOT NULL,
    "color" TEXT NOT NULL,
    "trail_color" TEXT NOT NULL,

    -- Body properties not required for initialization
    "texture_path" TEXT,
    "name" TEXT,

    FOREIGN KEY (preset_id) REFERENCES preset(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "star" (
    -- Primary key and foreign key to preset
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "preset_id" INTEGER NOT NULL,

    -- Body required initial properties
    "mass" REAL NOT NULL,
    "position_x" REAL NOT NULL,
    "position_y" REAL NOT NULL,
    "position_z" REAL NOT NULL,
    "velocity_x" REAL NOT NULL,
    "velocity_y" REAL NOT NULL,
    "velocity_z" REAL NOT NULL,
    "radius" REAL NOT NULL,
    "spin" REAL NOT NULL,
    "color" TEXT NOT NULL,
    "trail_color" TEXT NOT NULL,

    -- Star light properties
    "light_intensity" REAL NOT NULL,

    -- Body properties not required for initialization
    "texture_path" TEXT,
    "name" TEXT,

    FOREIGN KEY (preset_id) REFERENCES preset(id) ON DELETE CASCADE
);