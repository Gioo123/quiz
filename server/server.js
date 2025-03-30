import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const questions = [
  {
    id: 1,
    category: "Programmierung",
    question: "Was bedeutet 'OOP' in der Programmierung?",
    answers: ["Object Oriented Programming", "Optimal Object Parsing", "Organized Object Programming", "Object Oriented Parsing"],
    correct: 0,
    explanation: "OOP steht für Object Oriented Programming, also objektorientierte Programmierung."
  }
];

// API-Endpunkt für Fragen
app.get("/api/questions", (req, res) => {
  res.json(questions);
});

// Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server läuft auf Port ${PORT}`));
