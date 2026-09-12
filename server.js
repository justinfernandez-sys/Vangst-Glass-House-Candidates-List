const express = require('express');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

// Use a Railway Volume mounted at /data if present; falls back to a local
// ./data folder for testing on your own machine.
const dbPath = process.env.DB_PATH || path.join(__dirname, 'data', 'app.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.exec(`CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT)`);

const app = express();
app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Simple key-value API — the frontend stores one JSON blob under
// "tracker-data", same shape it used to save to Claude's artifact storage.
app.get('/api/kv/:key', (req, res) => {
  const row = db.prepare('SELECT value FROM kv WHERE key = ?').get(req.params.key);
  res.json({ value: row ? row.value : null });
});

app.put('/api/kv/:key', (req, res) => {
  const { value } = req.body;
  if (typeof value !== 'string') {
    return res.status(400).json({ error: 'value must be a JSON string' });
  }
  db.prepare(
    `INSERT INTO kv (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  ).run(req.params.key, value);
  res.json({ ok: true });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vangst Glasshouse Candidates List running on port ${PORT}`);
  console.log(`Database file: ${dbPath}`);
});
