const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

module.exports = (db) => {

  // POST /users/register
  router.post("/register", async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password) return res.status(400).json({ error: "Username and password required" });
    if (role && !["admin", "user"].includes(role)) return res.status(400).json({ error: "Invalid role" });

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = "INSERT INTO user (username, password, role) VALUES (?, ?, ?)";

      db.run(sql, [username, hashedPassword, role || "user"], function(err) {
        if (err) return res.status(500).json({ error: "Username may already exist" });

        res.status(201).json({
          id: this.lastID,
          username,
          role: role || "user"
        });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });

  // POST /users/login
  router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ error: "Username and password required" });

    const sql = "SELECT * FROM user WHERE username = ?";
    db.get(sql, [username], async (err, user) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (!user) return res.status(401).json({ error: "Invalid credentials" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: "Invalid credentials" });

      // For now, return user info. In production, use a session or JWT.
      res.json({ id: user.id, username: user.username, role: user.role });
    });
  });

  return router;
};