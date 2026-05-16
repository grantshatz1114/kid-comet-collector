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

  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      profile TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    )`
  );
});

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS");
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

const DEFAULT_USER_PROFILE = {
  score: 0,
  highScore: 0,
  coins: 0,
  lives: 3,
  level: 1,
  settings: {
    difficulty: "normal",
    sound: true,
    music: true,
    theme: "bright",
    brightness: 100,
    language: "en",
    playerName: "Captain",
    skin: "classic",
    background: "deep",
    cometVariant: "star",
  },
  unlockedSkins: ["classic"],
  unlockedBackgrounds: ["deep"],
  unlockedCometVariants: ["star"],
  shop: {
    speedLevel: 0,
  },
  hackUnlocked: false,
};

app.post("/users/login", (req, res) => {
  const username = String(req.body.username || "").trim().slice(0, 24);
  if (!username) return res.status(400).json({ error: "invalid username" });

  const now = Date.now();
  db.get("SELECT profile FROM users WHERE username = ?", [username], (err, row) => {
    if (err) {
      console.error("User lookup failed:", err);
      return res.status(500).json({ error: "database error" });
    }
    if (row) {
      try {
        const profile = JSON.parse(row.profile);
        return res.json({ username, profile });
      } catch {
        return res.status(500).json({ error: "invalid profile data" });
      }
    }

    const profile = DEFAULT_USER_PROFILE;
    const profileJson = JSON.stringify(profile);
    db.run(
      "INSERT INTO users (username, profile, createdAt, updatedAt) VALUES (?, ?, ?, ?)",
      [username, profileJson, now, now],
      function (insertErr) {
        if (insertErr) {
          console.error("User create failed:", insertErr);
          return res.status(500).json({ error: "database error" });
        }
        res.status(201).json({ username, profile });
      }
    );
  });
});

app.get("/users/:username", (req, res) => {
  const username = String(req.params.username || "").trim().slice(0, 24);
  if (!username) return res.status(400).json({ error: "invalid username" });

  db.get("SELECT profile FROM users WHERE username = ?", [username], (err, row) => {
    if (err) {
      console.error("User fetch failed:", err);
      return res.status(500).json({ error: "database error" });
    }
    if (!row) return res.status(404).json({ error: "user not found" });

    try {
      const profile = JSON.parse(row.profile);
      res.json({ username, profile });
    } catch {
      res.status(500).json({ error: "invalid profile data" });
    }
  });
});

app.put("/users/:username", (req, res) => {
  const username = String(req.params.username || "").trim().slice(0, 24);
  if (!username) return res.status(400).json({ error: "invalid username" });

  const profile = req.body.profile;
  if (!profile || typeof profile !== "object") {
    return res.status(400).json({ error: "invalid profile" });
  }

  const profileJson = JSON.stringify(profile);
  const now = Date.now();
  db.run(
    "UPDATE users SET profile = ?, updatedAt = ? WHERE username = ?",
    [profileJson, now, username],
    function (err) {
      if (err) {
        console.error("User update failed:", err);
        return res.status(500).json({ error: "database error" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "user not found" });
      }
      res.json({ username, profile });
    }
  );
});

app.listen(port, () => {
  console.log(`Leaderboard backend listening on port ${port}`);
});

process.on("SIGINT", () => {
  db.close(() => process.exit(0));
});
