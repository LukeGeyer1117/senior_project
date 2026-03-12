const express = require("express");
const router = express.Router();

module.exports = (db) => {
    //
    // MULTIPLE PLANETS ENDPOINTS
    //

    // GET all planets tied to a preset
    router.get("/:preset_id/planets" , (req, res) => {
        const preset_id = Number(req.params.preset_id);

        if (!Number.isInteger(preset_id)) return res.status(400).json({error: "Preset ID must be an integer"});

        db.all("SELECT * FROM planet WHERE preset_id=?", [preset_id], (err, rows) => {
            if (err) return res.status(500).json({error: "Database error"});

            if (!rows) return res.status(404).json({message: "Planets not found"});

            res.json(rows)
        })
    })

    // POST a new planet to a preset
    router.post("/:preset_id/planets", (req, res) => {
        const preset_id = Number(req.params.preset_id);
        const { mass, position_x, position_y, position_z, velocity_x, velocity_y, velocity_z, radius, spin, color, texture_path, name } = req.body;

        if (!Number.isInteger(preset_id)) return res.status(400).json({error: "Preset ID must be an integer"});

        if (mass === undefined || position_x === undefined || position_y === undefined || position_z === undefined || velocity_x === undefined || velocity_y === undefined || velocity_z === undefined || radius === undefined || spin === undefined || color === undefined) {
            return res.status(400).json({error: "Missing required parameters\n(required are mass, position (3), velocity (3), radius, spin, color).\n(Optional are texture_path and name)"});
        }

        const fields = ["preset_id", "mass", "position_x", "position_y", "position_z", "velocity_x", "velocity_y", "velocity_z", "radius", "spin", "color"];
        const values = [preset_id ,mass, position_x, position_y, position_z, velocity_x, velocity_y, velocity_z, radius, spin, color];

        if (texture_path !== undefined) {
            fields.push("texture_path");
            values.push(texture_path);
        }

        if (name !== undefined) {
            fields.push("name");
            values.push(name);
        }

        const sql = `INSERT INTO planet (${fields.join(", ")}) VALUES (${fields.map(() => "?").join(", ")})`; 

        db.run(sql, values, function (err) {
            if (err) return res.status(500).json({error: "Database error"});
            res.json({
                message: "Planet created",
                id: this.lastID
            })
        })
    })

    //
    // SINGLE PLANET ENDPOINTS
    //

    // GET a single planet tied to a preset with given ID
    router.get("/:preset_id/planets/:planet_id", (req, res) => {
        const preset_id = Number(req.params.preset_id);
        const planet_id = Number(req.params.planet_id);

        if (!Number.isInteger(preset_id)) return res.status(400).json({error: "Preset ID must be an integer"});
        if (!Number.isInteger(planet_id)) return res.status(400).json({error: "Planet ID must be an integer"});
        
        const sql = `SELECT * FROM planet WHERE id=? AND preset_id=?`;
        db.get(sql, [planet_id, preset_id], function (err, row) {
            if (err) return res.status(500).json({error: "Databae error"});
            if (!row) return res.status(404).json({message: "Planet not found"});

            res.json(row);
        })
    })

    // PUT (update) a single planet tied to a preset with given ID
    router.put("/:preset_id/planets/:planet_id", (req, res) => {
        const preset_id = Number(req.params.preset_id);
        const planet_id = Number(req.params.planet_id);

        if (!Number.isInteger(preset_id)) return res.status(400).json({error: "Preset ID must be an integer"});
        if (!Number.isInteger(planet_id)) return res.status(400).json({error: "Planet ID must be an integer"});

        const {mass, position_x, position_y, position_z, velocity_x, velocity_y, velocity_z, radius, spin, color, texture_path, name} = req.body;

        fields = [];
        values = [];

        if (mass !== undefined) {
            fields.push("mass=?");
            values.push(mass);
        }
        if (position_x !== undefined) {
            fields.push("position_x=?");
            values.push(position_x);
        }
        if (position_y !== undefined) {
            fields.push("position_y=?");
            values.push(position_y);
        }
        if (position_z !== undefined) {
            fields.push("position_z=?");
            values.push(position_z);
        }
        if (velocity_x !== undefined) {
            fields.push("velocity_x=?");
            values.push(velocity_x);
        }
        if (velocity_y !== undefined) {
            fields.push("velocity_y=?");
            values.push(velocity_y);
        }
        if (velocity_z !== undefined) {
            fields.push("velocity_z=?");
            values.push(velocity_z);
        }
        if (radius !== undefined) {
            fields.push("radius=?");
            values.push(radius);
        }
        if (spin !== undefined) {
            fields.push("spin=?");
            values.push(spin);
        }
        if (color !== undefined) {
            fields.push("color=?");
            values.push(color);
        }
        if (texture_path !== undefined) {
            fields.push("texture_path=?");
            values.push(texture_path);
        }
        if (name !== undefined) {
            fields.push("name=?");
            values.push(name);
        }

        if (fields.length === 0 || values.length === 0) return res.status(400).json({error: "No fields to update"});

        // Add the planet_id and preset_id for the WHERE clause
        values.push(planet_id);
        values.push(preset_id);

        const sql = `UPDATE planet SET ${fields.join(", ")} WHERE id=? AND preset_id=?`;

        db.run(sql, values, function (err) {
            if (err) return res.status(500).json({error: "Database error"});
            if (this.changes === 0) return res.status(404).json({message: "Planet not found"});

            res.json({message: "Planet updated successfully"});
        })
    })

    // DELETE a single planet tied to a preset with given ID
    router.delete("/:preset_id/planets/:planet_id", (req, res) => {
        const preset_id = Number(req.params.preset_id);
        const planet_id = Number(req.params.planet_id);

        if (!Number.isInteger(preset_id)) return res.status(400).json({error: "Preset ID must be an integer"});
        if (!Number.isInteger(planet_id)) return res.status(400).json({error: "Planet ID must be an integer"});

        const sql = `DELETE FROM planet WHERE id=? AND preset_id=?`;
        db.run(sql, [planet_id, preset_id], function (err) {
            if (err) return res.status(500).json({error: "Database error"});
            if (this.changes === 0) return res.status(404).json({message: "Planet not found"});

            res.json({message: "Planet deleted successfully"});
        })
    })

    return router;
}