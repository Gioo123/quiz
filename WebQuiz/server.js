// === SERVER.JS ===
// Status: Registrierung, Login, Fragenabruf nach Kategorie, Kategorienliste

// === 1. GRUNDKONFIGURATION ===
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});
app.use(express.json());

/* // === 2. POSTGRESQL EINRICHTEN ===
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
}); */
// Tabellen überprüfen
pool.on('connect', async (client) => {
  try {
    console.log("Verbindung zur Datenbank hergestellt, überprüfe Tabellen...");
    
    // Prüfe, ob die Tabellen existieren
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        correct_option CHAR(1) NOT NULL,
        category_id INTEGER REFERENCES categories(id),
        explanation TEXT
      );
      
      CREATE TABLE IF NOT EXISTS highscores (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        score INTEGER NOT NULL,
        mode VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Füge Beispielkategorien hinzu, falls keine vorhanden sind
    const categoryCount = await client.query('SELECT COUNT(*) FROM categories');
    if (parseInt(categoryCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO categories (name) VALUES 
        ('Allgemeinwissen'),
        ('Wissenschaft'),
        ('Geschichte'),
        ('Geografie'),
        ('Sport');
      `);
      console.log("Beispielkategorien wurden hinzugefügt");
    }
    
    console.log("Datenbankstruktur überprüft");
  } catch (err) {
    console.error("Fehler beim Überprüfen der Datenbankstruktur:", err);
  }
});
// === 3. ROUTE: SERVER-CHECK ===
// FRONTEND: Kann genutzt werden, um zu prüfen, ob das Backend läuft
app.get('/api', (req, res) => {
  res.send('Webquiz Backend ist online');
});

// Testroute für direkte Fragenabfrage ohne Kategorieauswahl
app.get('/test-questions', async (req, res) => {
  try {
    console.log("Test-Fragen-Anfrage empfangen");
    
    // Versuche, direkt Fragen zu holen ohne Kategoriefilter
    const result = await pool.query('SELECT * FROM questions LIMIT 5');
    console.log("Fragen gefunden:", result.rowCount);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Fehler beim Abrufen der Testfragen:', err);
    res.status(500).json({ 
      error: 'Testfragen konnten nicht geladen werden: ' + err.message
    });
  }
});

// === 4. ROUTE: REGISTRIERUNG ===
// FRONTEND: POST /register
// Erwartet im Body: { email, password }
// Gibt zurück: { user: { id, email } }
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error('Fehler bei Registrierung:', err);
    if (err.code === '23505') {
      res.status(400).json({ error: 'E-Mail bereits registriert' });
    } else {
      res.status(500).json({ error: 'Serverfehler' });
    }
  }
});

// === 5. ROUTE: LOGIN ===
// FRONTEND: POST /login
// Erwartet im Body: { email, password }
// Gibt zurück: { token } (wird im Frontend gespeichert)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Benutzer nicht gefunden' });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Falsches Passwort' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Fehler beim Login:', err);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// === 6. ROUTE: FRAGEN ABRUFEN (NACH KATEGORIE) ===
// FRONTEND: GET /questions?category=ID
// Erwartet: query parameter category (z. B. category=2)
// Gibt zurück: Array mit max. 10 zufälligen Fragen aus dieser Kategorie
app.get('/questions', async (req, res) => {
  const category = req.query.category;
  if (!category) {
    return res.status(400).json({ error: 'Kategorie-ID fehlt. Verwende ?category=ID' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM questions WHERE category_id = $1 ORDER BY RANDOM() LIMIT 10',
      [category]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fehler beim Abrufen der Fragen:', err);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// === 7. ROUTE: KATEGORIEN ABRUFEN ===
// FRONTEND: GET /categories
// Erwartet keine Parameter
// Gibt zurück: Array mit allen verfügbaren Kategorien (id + name)
// Beispiel: [ { id: 1, name: "Programmierung" }, ... ]
app.get('/categories', async (req, res) => {
  try {
    console.log("Kategorien-Anfrage empfangen");
    
    // Überprüfe Datenbankverbindung
    const connectionTest = await pool.query('SELECT 1 AS connection_test');
    console.log("Datenbankverbindung OK:", connectionTest.rows[0]);
    
    const result = await pool.query('SELECT * FROM categories ORDER BY id ASC');
    console.log("Kategorien gefunden:", result.rowCount);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Detaillierter Fehler beim Abrufen der Kategorien:', err);
    res.status(500).json({ 
      error: 'Kategorien konnten nicht geladen werden: ' + err.message
    });
  }
});

// === 9. HIGHSCORE SPEICHERN ===
// FRONTEND: POST /highscores
// Erwartet im Body: { user_id, score, mode }
// Beispiel-Request:
// { "user_id": 1, "score": 700, "mode": "solo" }
app.post('/highscores', async (req, res) => {
  const { user_id, score, mode } = req.body;

  if (!user_id || !score || !mode) {
    return res.status(400).json({ error: 'Fehlende Daten (user_id, score, mode)' });
  }

  try {
    await pool.query(
      'INSERT INTO highscores (user_id, score, mode) VALUES ($1, $2, $3)',
      [user_id, score, mode]
    );
    res.status(201).json({ message: 'Highscore gespeichert' });
  } catch (err) {
    console.error('Fehler beim Speichern des Highscores:', err);
    res.status(500).json({ error: 'Serverfehler beim Speichern des Highscores' });
  }
});

// Gast-Highscore speichern
app.post('/guest-highscores', async (req, res) => {
  const { guest_name, score, mode } = req.body;

  if (!guest_name || !score || !mode) {
    return res.status(400).json({ error: 'Fehlende Daten (guest_name, score, mode)' });
  }

  try {
    await pool.query(
      'INSERT INTO highscores (guest_name, score, mode) VALUES ($1, $2, $3)',
      [guest_name, score, mode]
    );
    res.status(201).json({ message: 'Highscore gespeichert' });
  } catch (err) {
    console.error('Fehler beim Speichern des Highscores:', err);
    res.status(500).json({ error: 'Serverfehler beim Speichern des Highscores' });
  }
});

// === 10. HIGHSCORES LADEN ===
// FRONTEND: GET /highscores
// Gibt eine Liste zurück (Top 10), inkl. Nutzer-E-Mail und Modus
app.get('/highscores', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT h.score, h.mode, h.created_at, u.email AS user_email
      FROM highscores h
      LEFT JOIN users u ON h.user_id = u.id
      ORDER BY h.score DESC, h.created_at ASC
      LIMIT 10
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Fehler beim Laden der Highscores:', err);
    res.status(500).json({ error: 'Fehler beim Abrufen der Highscores' });
  }
});

// === 11. FRAGE EINREICHEN ===
// FRONTEND: POST /questions
// Erwartet eine neue Frage im Body
app.post('/questions', async (req, res) => {
  const { question, option_a, option_b, option_c, option_d, correct_option, category_id, explanation } = req.body;

  // Überprüfe, ob alle erforderlichen Felder vorhanden sind
  if (!question || !option_a || !option_b || !option_c || !option_d || !correct_option || !category_id) {
    return res.status(400).json({ error: 'Fehlende Felder in der Anfrage' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_option, category_id, explanation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      [question, option_a, option_b, option_c, option_d, correct_option, category_id, explanation || '']
    );

    res.status(201).json({ 
      message: 'Frage erfolgreich gespeichert', 
      question_id: result.rows[0].id 
    });
  } catch (err) {
    console.error('Fehler beim Speichern der Frage:', err);
    res.status(500).json({ error: 'Serverfehler beim Speichern der Frage' });
  }
});

// Statische Dateien aus dem Frontend-Build-Verzeichnis bereitstellen
app.use(express.static(path.join(__dirname, 'client/build')));

// Catch-all-Route für das Frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// === 8. SERVER STARTEN ===
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend läuft auf Port ${PORT}`);
});