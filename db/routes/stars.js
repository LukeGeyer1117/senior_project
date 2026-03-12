const express = require("express");
const router = express.Router();

module.exports = (db) => {
    //
    // MULTIPLE STARS ENDPOINTS
    //

    // GET all stars tied to a preset
    router.get("/:preset_id/stars" , (req, res) => {
        const preset_id = Number(req.params.preset_id);

        if (!Number.isInteger(preset_id)) return res.status(400).json({error: "Preset ID must be an integer"});

        db.all("SELECT * FROM star WHERE preset_id=?", [preset_id], (err, rows) => {
            if (err) return res.status(500).json({error: "Database error"});

            if (!rows) return res.status(404).json({message: "Stars not found"});

            res.json(rows)
        })
    })

    // POST a new star to a preset
    router.post("/:preset_id/stars", (req, res) => {
        const preset_id = Number(req.params.preset_id);
        const { mass, position_x, position_y, position_z, velocity_x, velocity_y, velocity_z, radius, spin, color, light_intensity, texture_path, name } = req.body;

        if (!Number.isInteger(preset_id)) return res.status(400).json({error: "Preset ID must be an integer"});

        if (mass === undefined || position_x === undefined || position_y === undefined || position_z === undefined || velocity_x === undefined || velocity_y === undefined || velocity_z === undefined || radius === undefined || spin === undefined || color === undefined || light_intensity === undefined) {
            return res.status(400).json({error: "Missing required parameters\n(required are mass, position (3), velocity (3), radius, spin, color, light_intensity).\n(Optional are texture_path and name)"});
        }

        const fields = ["preset_id", "mass", "position_x", "position_y", "position_z", "velocity_x", "velocity_y", "velocity_z", "radius", "spin", "color", "light_intensity"];
        const values = [preset_id ,mass, position_x, position_y, position_z, velocity_x, velocity_y, velocity_z, radius, spin, color, light_intensity];

        if (texture_path !== undefined) {
            fields.push("texture_path");
            values.push(texture_path);
        }

        if (name !== undefined) {
            fields.push("name");
            values.push(name);
        }

        const sql = `INSERT INTO star (${fields.join(", ")}) VALUES (${fields.map(() => "?").join(", ")})`; 

        db.run(sql, values, function (err) {
            if (err) return res.status(500).json({error: "Database error"});
            res.json({
                message: "Star created",
                id: this.lastID
            })
        })
    })

    //
    // SINGLE STAR ENDPOINTS
    //

    // GET a single star tied to a preset with given ID
    router.get("/:preset_id/stars/:star_id", (req, res) => {
        const preset_id = Number(req.params.preset_id);
        const star_id = Number(req.params.star_id);

        if (!Number.isInteger(preset_id)) return res.status(400).json({error: "Preset ID must be an integer"});
        if (!Number.isInteger(star_id)) return res.status(400).json({error: "Star ID must be an integer"});
        
        const sql = `SELECT * FROM star WHERE id=? AND preset_id=?`;
        db.get(sql, [star_id, preset_id], function (err, row) {
            if (err) return res.status(500).json({error: "Databae error"});
            if (!row) return res.status(404).json({message: "Star not found"});

            res.json(row);
        })
    })

    // PUT (update) a single star tied to a preset with given ID
    router.put("/:preset_id/stars/:star_id", (req, res) => {
        const preset_id = Number(req.params.preset_id);
        const star_id = Number(req.params.star_id);

        if (!Number.isInteger(preset_id)) return res.status(400).json({error: "Preset ID must be an integer"});
        if (!Number.isInteger(star_id)) return res.status(400).json({error: "Star ID must be an integer"});

        const {mass, position_x, position_y, position_z, velocity_x, velocity_y, velocity_z, radius, spin, color, light_intensity, texture_path, name} = req.body;

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
        if (light_intensity !== undefined) {
            fields.push("light_intensity=?");
            values.push(light_intensity);
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

        // Add the star_id and preset_id for the WHERE clause
        values.push(star_id);
        values.push(preset_id);

        const sql = `UPDATE star SET ${fields.join(", ")} WHERE id=? AND preset_id=?`;

        db.run(sql, values, function (err) {
            if (err) return res.status(500).json({error: "Database error"});
            if (this.changes === 0) return res.status(404).json({message: "Star not found"});

            res.json({message: "Star updated successfully"});
        })
    })

    // DELETE a single star tied to a preset with given ID
    router.delete("/:preset_id/stars/:star_id", (req, res) => {
        const preset_id = Number(req.params.preset_id);
        const star_id = Number(req.params.star_id);

        if (!Number.isInteger(preset_id)) return res.status(400).json({error: "Preset ID must be an integer"});
        if (!Number.isInteger(star_id)) return res.status(400).json({error: "Star ID must be an integer"});

        const sql = `DELETE FROM star WHERE id=? AND preset_id=?`;
        db.run(sql, [star_id, preset_id], function (err) {
            if (err) return res.status(500).json({error: "Database error"});
            if (this.changes === 0) return res.status(404).json({message: "Star not found"});

            res.json({message: "Star deleted successfully"});
        })
    })

    return router;
}