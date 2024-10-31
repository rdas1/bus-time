const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS
app.use(cors());

// Open SQLite database
const db = new sqlite3.Database('db/mta_data.db');

// Example endpoint to get 10 stops
app.get('/api/stops', (req, res) => {
    db.all('SELECT * FROM stops LIMIT 10', [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });
});

app.get('/api/stops', (req, res) => {
    db.all('SELECT * FROM stops LIMIT 10', [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
