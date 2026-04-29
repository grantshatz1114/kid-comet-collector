const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = parseInt(process.env.PORT, 10) || 3000;
const dbPath = process.env.LEADERBOARD_DB_PATH || path.join(__dirname, "leaderboard.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Unable to open leaderboard database:", err);
    process.exit(1);
  }
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS leaderboard (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      level INTEGER NOT NULL DEFAULT 1,
      at INTEGER NOT NULL
    )`
  );
});

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.get("/", (_req, res) => {
  res.send("Comet Collector leaderboard backend is running.");
});

app.get("/leaderboard", (_req, res) => {
  db.all(
    "SELECT name, score, level, at FROM leaderboard ORDER BY score DESC, at ASC LIMIT 20",
    (err, rows) => {
      if (err) {
        console.error("Leaderboard fetch failed:", err);
        return res.status(500).json({ error: "database error" });
      }
      res.json(rows);
    }
  );
});

app.post("/leaderboard", (req, res) => {
  const name = String(req.body.name || "Computer").trim().slice(0, 24) || "Computer";
  const score = Number.isFinite(req.body.score) ? Math.max(0, Math.floor(req.body.score)) : null;
  const level = Number.isFinite(req.body.level) ? Math.max(1, Math.floor(req.body.level)) : 1;
  const at = Number.isFinite(req.body.at) ? Math.floor(req.body.at) : Date.now();

  if (score === null) {
    return res.status(400).json({ error: "invalid score" });
  }

  db.run(
    "INSERT INTO leaderboard (name, score, level, at) VALUES (?, ?, ?, ?)",
    [name, score, level, at],
    function (err) {
      if (err) {
        console.error("Leaderboard save failed:", err);
        return res.status(500).json({ error: "database error" });
      }
      res.status(201).json({ id: this.lastID, name, score, level, at });
    }
  );
});

app.listen(port, () => {
  console.log(`Leaderboard backend listening on port ${port}`);
});

process.on("SIGINT", () => {
  db.close(() => process.exit(0));
});
