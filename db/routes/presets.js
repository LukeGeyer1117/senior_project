const express = require("express");
const router = express.Router();

module.exports = (db) => {
    //
    // MULTIPLE PRESETS ENDPOINTS
    //

    // GET all presets
    router.get("/" ,(req, res) => {
        db.all("SELECT * FROM preset", (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows);
        })
    })

    // POST new preset
    router.post("/", (req, res) => {
        const { name, description } = req.body;

        if (!name) return res.status(400).json({error: "Name is required"});

        const sql = "INSERT INTO preset (name, description) VALUES (?, ?)"

        db.run(sql, [name, description || null], function(err) {
            if (err) return res.status(500).json(err);

            res.status(201).json({
                id: this.lastID,
                name,
                description
            });
        })
    })

    //
    // SINGLE PRESET ENDPOINTS
    // 

    // GET preset by id
    router.get("/:id" ,(req, res) => {
        const { id } = req.params;

        if (!Number.isInteger(Number(id))) return res.status(400).json({error: "ID must be a valid number."});

        db.get("SELECT * FROM preset WHERE id = ?", [id], (err, row) => {
            if (err) return res.status(500).json({error: "Database error"});

            if (!row) return res.status(404).json({error: "Preset not found"});

            res.json(row);
        })
    })

    // PUT update preset by id
    router.put("/:id" ,(req, res) => {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!Number.isInteger(Number(id))) return res.status(400).json({error: "ID must be a valid number."});

        if (!name && !description) return res.status(400).json({error: "No changes submitted"});

        const fields = [];
        const values = [];

        if (name !== undefined) {
            fields.push("name = ?");
            values.push(name);
        }

        if (description !== undefined) {
            fields.push("description = ?");
            values.push(description);
        }

        values.push(id); // Add id for WHERE clause

        const sql = `UPDATE preset SET ${fields.join(', ')} WHERE id = ?`;

        db.run(sql, values, (err) => {
            if (err) return res.status(500).json({error: "Database error"})
            res.json({message: "Preset updated successfully"})
        })
    })

    // DELETE preset by id
    router.delete("/:id" ,(req, res) => {
        const { id } =req.params;

        if (!Number.isInteger(Number(id))) return res.status(400).json({error: "ID must be a valid number."});

        db.run("DELETE FROM preset WHERE id = ?", [id], (err, result) => {
            if (err) return res.status(500).json({error: "Database error"});

            if (this.changes === 0) return res.status(404).json({error: "Preset not found"});

            res.json({message: "Preset deleted successfully"});
        })
    })

    return router;
}