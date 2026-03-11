-- The preset table stores the presets for simulations. 
-- Presets are collections of planets and stars that can be loaded
-- at simulation startup. Each preset has a name and an optional
-- description. Ideally, a preset will represent a unique, interesting
-- configuration that can be loaded repeatedly.
CREATE TABLE IF NOT EXISTS "preset" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- The planet and star tables store the data necessary for creating 
-- their respective bodies in the simulation. Each planet and star
-- contains a link to the preset they belong to.
CREATE TABLE IF NOT EXISTS "planet" (
    -- Primary key and foreign key to preset
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "preset_id" INTEGER NOT NULL,

    -- Body required initial properties
    "type" TEXT NOT NULL, 
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
    "type" TEXT NOT NULL, 
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

    -- Star light properties
    "light_intensity" REAL NOT NULL,

    -- Body properties not required for initialization
    "texture_path" TEXT,
    "name" TEXT,

    FOREIGN KEY (preset_id) REFERENCES preset(id) ON DELETE CASCADE
);