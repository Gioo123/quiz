const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Firebase Admin SDK initialisieren
admin.initializeApp({
  credential: admin.credential.cert(require("./firebase-key.json")), // Pfad zu deinem privaten Schlüssel
});

const db = admin.firestore();

// Route für das Abrufen der Fragen
app.get("/questions", async (req, res) => {
  try {
    const questionsRef = db.collection("questions");
    const snapshot = await questionsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "Keine Fragen gefunden." });
    }

    const questions = [];
    snapshot.forEach((doc) => {
      questions.push({ id: doc.id, ...doc.data() });
    });

    res.json(questions);
  } catch (error) {
    console.error("Fehler beim Abrufen der Fragen:", error);
    res.status(500).json({ message: "Fehler beim Abrufen der Fragen." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
