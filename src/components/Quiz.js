import React, { useState, useEffect } from "react";
import "./Quiz.css";
import SoloMode from "./SoloMode";
import MultiplayerMode from "./MultiplayerMode";
import CooperativeMode from "./CooperativeMode";

const Quiz = () => {
  console.log("Quiz-Komponente geladen!");
  


  const questionsData = [
    {
      category: "Programmierung",
      question: "Was bedeutet 'OOP' in der Programmierung?",
      answers: ["Object Oriented Programming", "Optimal Object Parsing", "Organized Object Programming", "Object Oriented Parsing"],
      correct: 0,
      explanation: "OOP steht für Object Oriented Programming, also objektorientierte Programmierung.",
    },
    {
      category: "Programmierung",
      question: "Welche Programmiersprache wird für Webentwicklung oft mit HTML kombiniert?",
      answers: ["Python", "C++", "JavaScript", "Java"],
      correct: 2,
      explanation: "JavaScript wird häufig mit HTML verwendet, um interaktive Webseiten zu erstellen.",
    },
    {
      category: "Programmierung",
      question: "Was ist ein Framework?",
      answers: ["Eine Bibliothek", "Ein vordefiniertes Software-Umfeld", "Ein Editor", "Eine Datenbank"],
      correct: 1,
      explanation: "Ein Framework ist ein vordefiniertes Software-Umfeld, das die Entwicklung erleichtert.",
    },
    {
      category: "Programmierung",
      question: "Welches Schlüsselwort wird in Java verwendet, um eine Klasse zu erstellen?",
      answers: ["class", "define", "function", "create"],
      correct: 0,
      explanation: "In Java wird das Schlüsselwort 'class' verwendet, um eine Klasse zu erstellen.",
    },
    {
      category: "Programmierung",
      question: "Welche Sprache wird oft für maschinelles Lernen genutzt?",
      answers: ["Python", "C#", "PHP", "Ruby"],
      correct: 0,
      explanation: "Python wird häufig für maschinelles Lernen verwendet, da es zahlreiche Bibliotheken bietet.",
    },
    {
      category: "Datenbanken",
      question: "Was bedeutet SQL?",
      answers: ["Structured Query Language", "Simple Query Language", "System Query List", "System Query Language"],
      correct: 0,
      explanation: "SQL steht für Structured Query Language, die für Datenbankabfragen verwendet wird.",
    },
    {
      category: "Datenbanken",
      question: "Was ist ein Primärschlüssel?",
      answers: ["Eine Spalte, die eindeutige Werte enthält", "Ein Datenbankindex", "Eine Abfrage", "Ein Datentyp"],
      correct: 0,
      explanation: "Ein Primärschlüssel ist eine Spalte, die eindeutige Werte zur Identifikation eines Datensatzes enthält.",
    },
    {
      category: "Datenbanken",
      question: "Welche Art von Datenbank ist MongoDB?",
      answers: ["Relational", "Dokumentenorientiert", "Graphbasiert", "Key-Value"],
      correct: 1,
      explanation: "MongoDB ist eine dokumentenorientierte NoSQL-Datenbank.",
    },
    {
      category: "Datenbanken",
      question: "Was ist ein Fremdschlüssel?",
      answers: ["Ein Schlüssel in einer anderen Tabelle", "Ein Primärschlüssel", "Ein Index", "Ein String"],
      correct: 0,
      explanation: "Ein Fremdschlüssel verweist auf einen Primärschlüssel in einer anderen Tabelle.",
    },
    {
      category: "Datenbanken",
      question: "Welcher Befehl wird verwendet, um Daten in eine Tabelle einzufügen?",
      answers: ["INSERT", "SELECT", "UPDATE", "DELETE"],
      correct: 0,
      explanation: "Der Befehl 'INSERT' wird verwendet, um Daten in eine Tabelle einzufügen.",
    },
    {
      category: "Netzwerke",
      question: "Was bedeutet 'IP' in IP-Adresse?",
      answers: ["Internet Protocol", "Internal Protocol", "Information Protocol", "Indexed Protocol"],
      correct: 0,
      explanation: "IP steht für Internet Protocol, das zur Adressierung von Geräten im Netzwerk dient.",
    },
    {
      category: "Netzwerke",
      question: "Welches Protokoll wird für sichere Webseiten verwendet?",
      answers: ["HTTP", "HTTPS", "FTP", "SSH"],
      correct: 1,
      explanation: "HTTPS ist die sichere Version von HTTP und wird für verschlüsselte Kommunikation verwendet.",
    },
    {
      category: "Netzwerke",
      question: "Was ist eine MAC-Adresse?",
      answers: ["Eine Hardware-Adresse", "Eine IP-Adresse", "Ein Netzwerkschlüssel", "Ein Gateway"],
      correct: 0,
      explanation: "Eine MAC-Adresse ist eine eindeutige Hardware-Adresse eines Netzwerkgeräts.",
    },
    {
      category: "Netzwerke",
      question: "Was bedeutet DNS?",
      answers: ["Domain Name System", "Dynamic Name Server", "Domain Network Service", "Dynamic Network System"],
      correct: 0,
      explanation: "DNS steht für Domain Name System, das Domainnamen in IP-Adressen umwandelt.",
    },
    {
      category: "Netzwerke",
      question: "Welches Gerät verbindet Netzwerke miteinander?",
      answers: ["Router", "Switch", "Modem", "Access Point"],
      correct: 0,
      explanation: "Ein Router verbindet Netzwerke miteinander und leitet Datenpakete weiter.",
    },
    {
      category: "Sicherheit",
      question: "Was ist Phishing?",
      answers: ["Das Stehlen von Daten durch gefälschte E-Mails", "Ein Sicherheitsprotokoll", "Eine Art Firewall", "Ein Datenverschlüsselungsalgorithmus"],
      correct: 0,
      explanation: "Phishing ist das Stehlen von Daten durch gefälschte E-Mails oder Webseiten.",
    },
    {
      category: "Sicherheit",
      question: "Was bedeutet HTTPS?",
      answers: ["Hyper Text Transfer Protocol Secure", "Hyper Text Secure Protocol", "Hyper Transfer Secure Protocol", "Hyper Text Secure Pages"],
      correct: 0,
      explanation: "HTTPS steht für Hyper Text Transfer Protocol Secure und wird für sichere Webseiten genutzt.",
    },
    {
      category: "Sicherheit",
      question: "Was ist eine Firewall?",
      answers: ["Eine Sicherheitsmaßnahme", "Ein Netzwerktyp", "Ein Router", "Eine IP-Adresse"],
      correct: 0,
      explanation: "Eine Firewall schützt Netzwerke vor unautorisierten Zugriffen.",
    },
    {
      category: "Sicherheit",
      question: "Was ist Zwei-Faktor-Authentifizierung?",
      answers: ["Ein zusätzlicher Sicherheitslayer", "Eine Passwortänderung", "Ein Netzwerkprotokoll", "Ein Typ von Malware"],
      correct: 0,
      explanation: "Zwei-Faktor-Authentifizierung fügt einen zusätzlichen Sicherheitslayer hinzu.",
    },
    {
      category: "Sicherheit",
      question: "Welcher Angriff nutzt Schwachstellen in Software?",
      answers: ["Exploit", "Phishing", "Man-in-the-Middle", "Spoofing"],
      correct: 0,
      explanation: "Ein Exploit nutzt Schwachstellen in Software aus.",
    },
    {
      category: "KI und Maschinelles Lernen",
      question: "Was bedeutet KI?",
      answers: ["Künstliche Intelligenz", "Kommunikationsintelligenz", "Kinetische Intelligenz", "Keine Intelligenz"],
      correct: 0,
      explanation: "KI steht für Künstliche Intelligenz, die Fähigkeit von Maschinen, menschenähnliche Aufgaben auszuführen.",
    },
    {
      category: "KI und Maschinelles Lernen",
      question: "Was ist ein neuronales Netz?",
      answers: ["Ein maschinelles Modell inspiriert vom menschlichen Gehirn", "Eine Art von Algorithmus", "Ein Softwareprotokoll", "Eine Datenbank"],
      correct: 0,
      explanation: "Ein neuronales Netz ist ein Modell, das vom menschlichen Gehirn inspiriert ist.",
    },
    {
      category: "KI und Maschinelles Lernen",
      question: "Welcher Algorithmus wird oft für Klassifizierungsprobleme genutzt?",
      answers: ["Random Forest", "Bubble Sort", "Prim's Algorithm", "Dijkstra's Algorithm"],
      correct: 0,
      explanation: "Random Forest wird häufig für Klassifizierungsprobleme eingesetzt.",
    },
    {
      category: "KI und Maschinelles Lernen",
      question: "Was ist Überanpassung?",
      answers: ["Wenn ein Modell zu stark auf Trainingsdaten spezialisiert ist", "Wenn ein Algorithmus nicht funktioniert", "Wenn ein Modell alle Daten lernt", "Wenn ein Fehler auftritt"],
      correct: 0,
      explanation: "Überanpassung bedeutet, dass ein Modell zu stark auf Trainingsdaten spezialisiert ist und schlecht generalisiert.",
    },
    {
      category: "KI und Maschinelles Lernen",
      question: "Was ist Supervised Learning?",
      answers: ["Lernen mit gekennzeichneten Daten", "Unüberwachtes Lernen", "Eine Art von Netzwerkprotokoll", "Eine Datenbanktechnik"],
      correct: 0,
      explanation: "Supervised Learning ist Lernen mit gekennzeichneten Daten.",
    },
  ];

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameMode, setGameMode] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [highscores, setHighscores] = useState(() => {
    const savedHighscores = localStorage.getItem('quizHighscores');
    return savedHighscores ? JSON.parse(savedHighscores) : [];
  });
  const [playerScores, setPlayerScores] = useState([0, 0, 0]);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [playerCount, setPlayerCount] = useState(3);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [soloScore, setSoloScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [showHighscoreInput, setShowHighscoreInput] = useState(false);
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    category: "",
    question: "",
    answers: ["", "", "", ""],
    correct: 0,
    explanation: ""
	});
 const backToMainMenu = () => {
    setGameMode(null);
    setSelectedCategory(null);
    setQuestions([]);
    setCurrentQuestion(0);
    setFinished(false);
    setFeedback(null);
    setPlayerScores(new Array(playerCount).fill(0));
    setSoloScore(0);
    setAnswered(false);
    setAnsweredQuestions({});
    setCurrentPlayer(0);
    setShowHighscoreInput(false);
    setIsAddingQuestion(false);
  };	
  
 const handleBackToMainMenu = () => {
    const confirmReturn = window.confirm("Bist du sicher, dass du zum Hauptmenü zurückkehren möchtest? Der aktuelle Fortschritt geht verloren.");
    
    if (confirmReturn) {
      setGameMode(null);
      setSelectedCategory(null);
      setQuestions([]);
      setCurrentQuestion(0);
      setFinished(false);
      setFeedback(null);
      setPlayerScores(new Array(playerCount).fill(0));
      setSoloScore(0);
      setAnswered(false);
      setAnsweredQuestions({});
      setCurrentPlayer(0);
      setShowHighscoreInput(false);
      setIsAddingQuestion(false);
    }
  };
  
// Benutzerdefinierte Fragen aus dem Local Storage laden oder leeres Array
  const [customQuestions, setCustomQuestions] = useState(() => {
    const savedQuestions = localStorage.getItem('customQuizQuestions');
    return savedQuestions ? JSON.parse(savedQuestions) : [];
  });

  // Funktion zum Aktualisieren des neuen Frage-Objekts
  const handleAddQuestionChange = (e, index = null) => {
    const { name, value } = e.target;
    
    if (index !== null) {
      // Wenn ein Index angegeben ist, aktualisiere eine bestimmte Antwort
      const newAnswers = [...newQuestion.answers];
      newAnswers[index] = value;
      setNewQuestion({ ...newQuestion, answers: newAnswers });
    } else {
      // Sonst aktualisiere das entsprechende Feld der Frage
      setNewQuestion({ ...newQuestion, [name]: value });
    }
  };

  // Funktion zum Hinzufügen einer neuen Frage
  const submitNewQuestion = () => {
    // Überprüfe, ob alle Felder ausgefüllt sind
    if (!newQuestion.category || !newQuestion.question || 
        newQuestion.answers.some(a => a.trim() === '') || 
        !newQuestion.explanation) {
      alert("Bitte fülle alle Felder aus!");
      return;
    }

    // Füge die neue Frage zu den benutzerdefinierten Fragen hinzu
    setCustomQuestions([...customQuestions, newQuestion]);
    
    // Setze das Formular zurück
    setNewQuestion({
      category: "",
      question: "",
      answers: ["", "", "", ""],
      correct: 0,
      explanation: ""
    });
    setIsAddingQuestion(false);
  };
 
  // useEffect-Hook, der bei Änderungen von questionsData, highscores oder customQuestions ausgeführt wird
  useEffect(() => {
    // Extrahiere einzigartige Kategorien aus den Fragen
    const uniqueCategories = Array.from(new Set(questionsData.map((q) => q.category)));
    setCategories(uniqueCategories);
    
    // Speichere Highscores und benutzerdefinierte Fragen im Local Storage
    localStorage.setItem('quizHighscores', JSON.stringify(highscores));
    localStorage.setItem('customQuizQuestions', JSON.stringify(customQuestions));
  }, [questionsData, highscores, customQuestions]);
  
  // Funktion zum Auswählen einer Kategorie
  const chooseCategory = (category) => {
    // Kombiniere vordefinierte und benutzerdefinierte Fragen
    const allQuestions = [...questionsData, ...customQuestions];
    setSelectedCategory(category);
    // Filtere Fragen der ausgewählten Kategorie
    setQuestions(allQuestions.filter((q) => q.category === category));
    setCurrentQuestion(0);
    setFinished(false);
    setFeedback(null);
    setAnswered(false);
    setAnsweredQuestions({});
  };

  // Funktion zum Starten eines Spiels
  const startGame = (mode) => {
    setGameMode(mode);
    setSelectedCategory(null);
    setPlayerScores(new Array(playerCount).fill(0));
    setSoloScore(0);
    setCurrentQuestion(0);
    setFinished(false);
    setFeedback(null);
    setAnswered(false);
    setAnsweredQuestions({});
    setCurrentPlayer(0);
  };

  // Funktion zum Behandeln einer Antwort
  const handleAnswer = (index) => {
    if (answered) return; // Verhindere mehrfaches Antworten

    setAnswered(true);
    const isCorrect = index === questions[currentQuestion].correct;

    if (gameMode === "solo") {
      // Solo-Modus: Punktestand erhöhen und Feedback geben
      if (isCorrect) {
        setSoloScore((prevScore) => prevScore + 1);
        setFeedback(`Richtig! ${questions[currentQuestion].explanation}`);
      } else {
        setFeedback(
          `Falsch! Die richtige Antwort war: "${questions[currentQuestion].answers[questions[currentQuestion].correct]}". ${questions[currentQuestion].explanation}`
        );
      }
    }

    if (gameMode === "multiplayer") {
      // Multiplayer-Modus: Punktestand des aktuellen Spielers erhöhen und Feedback geben
      if (isCorrect) {
        setPlayerScores((prevScores) => {
          const newScores = [...prevScores];
          newScores[currentPlayer] = newScores[currentPlayer] + 1;
          return newScores;
        });
        setFeedback(`Spieler ${currentPlayer + 1}: Richtig! ${questions[currentQuestion].explanation}`);
      } else {
        setFeedback(
          `Spieler ${currentPlayer + 1}: Falsch! Die richtige Antwort war: "${questions[currentQuestion].answers[questions[currentQuestion].correct]}". ${questions[currentQuestion].explanation}`
        );
      }
    }

    if (gameMode === "kooperativ") {
      // Kooperativer Modus: Nur Feedback geben
      if (isCorrect) {
        setFeedback(`Richtig! ${questions[currentQuestion].explanation}`);
      } else {
        setFeedback(
          `Falsch! Die richtige Antwort war: "${questions[currentQuestion].answers[questions[currentQuestion].correct]}". ${questions[currentQuestion].explanation}`
        );
      }
    }

    // Speichere die gegebene Antwort
    setAnsweredQuestions({
      ...answeredQuestions,
      [currentQuestion]: {
        isCorrect,
        explanation: questions[currentQuestion].explanation,
        answer: questions[currentQuestion].answers[index],
      },
    });
  };

  // Funktion zur Behandlung des Weiter-Buttons
  const handleNext = () => {
    if (currentQuestion + 1 < questions.length) {
      // Gehe zur nächsten Frage
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(false);
      setFeedback(null);

      if (gameMode === "multiplayer") {
        // Wechsle zum nächsten Spieler im Multiplayer-Modus
        setCurrentPlayer((prevPlayer) => (prevPlayer + 1) % playerCount);
      }
    } else {
      // Quiz ist beendet
      setFinished(true);
      setShowHighscoreInput(true);
    }
  };

  // Funktion zum Speichern eines Highscores
  const saveHighscore = () => {
    if (gameMode === "solo") {
      // Speichere Highscore für Solo-Modus
      const newHighscore = {
        mode: "Solo",
        name: playerName || "Unbekannt",
        score: soloScore,
        date: new Date().toLocaleDateString()
      };
      const updatedHighscores = [...highscores, newHighscore]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // Behalte nur die Top 10
      setHighscores(updatedHighscores);
    } else if (gameMode === "multiplayer") {
      // Speichere Highscores für Multiplayer-Modus
      const updatedHighscores = playerScores.map((score, index) => {
        const playerName = prompt(`Name für Spieler ${index + 1} (max. 15 Zeichen):`, `Spieler ${index + 1}`);
        return {
          mode: "Multiplayer",
          name: playerName ? playerName.slice(0, 15) : `Spieler ${index + 1}`,
          score: score,
          date: new Date().toLocaleDateString()
        };
      }).filter(entry => entry.score > 0); // Nur Spieler mit Punkten speichern

      setHighscores([...highscores, ...updatedHighscores]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)); // Behalte nur die Top 10
    } else if (gameMode === "kooperativ") {
      // Speichere Highscore für kooperativen Modus
      const playerName = prompt("Name für das Kooperative Team (max. 15 Zeichen):", "Kooperatives Team");
      const newHighscore = {
        mode: "Kooperativ",
        name: playerName ? playerName.slice(0, 15) : "Kooperatives Team",
        score: questions.length, // Alle Fragen richtig beantwortet
        date: new Date().toLocaleDateString()
      };
      const updatedHighscores = [...highscores, newHighscore]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // Behalte nur die Top 10
      setHighscores(updatedHighscores);
    }
    
    setShowHighscoreInput(false);
    setPlayerName("");
  };

  // Funktion zum Neustarten des Quiz
  const restartQuiz = () => {
    setGameMode(null);
    setSelectedCategory(null);
    setQuestions([]);
    setCurrentQuestion(0);
    setFinished(false);
    setFeedback(null);
    setPlayerScores(new Array(playerCount).fill(0));
    setSoloScore(0);
    setAnswered(false);
    setAnsweredQuestions({});
    setCurrentPlayer(0);
    setShowHighscoreInput(false);
  };

  // Funktion zum Rendern der Highscores
  const renderHighscores = () => {
    return (
      <div>
        <h2>Highscores</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Modus</th>
              <th>Punkte</th>
              <th>Datum</th>
            </tr>
          </thead>
          <tbody>
            {highscores.map((score, index) => (
              <tr key={index}>
                <td>{score.name}</td>
                <td>{score.mode}</td>
                <td>{score.score}</td>
                <td>{score.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render-Methode der Komponente
  return (
    <div className="quiz-container">
      {/* Hauptmenü - Anzeige, wenn kein Spielmodus ausgewählt ist */}
      {!gameMode && (
        <div>
          <h1>Willkommen zum Quiz!</h1>
          <p>Wähle deinen Spielmodus:</p>
          <button onClick={() => setGameMode("solo")}>Solo</button>
          <button onClick={() => setGameMode("multiplayer")}>Mehrspieler</button>
          <button onClick={() => setGameMode("kooperativ")}>Kooperativ</button>
          <button onClick={() => setIsAddingQuestion(true)}>Frage einreichen</button>
        </div>
      )}

      {/* Formular zum Hinzufügen einer neuen Frage */}
      {isAddingQuestion && (
        <div className="modal">
          <h2>Neue Frage hinzufügen</h2>
          <input
            type="text"
            name="category"
            placeholder="Kategorie"
            value={newQuestion.category}
            onChange={handleAddQuestionChange}
          />
          <input
            type="text"
            name="question"
            placeholder="Frage"
            value={newQuestion.question}
            onChange={handleAddQuestionChange}
          />
          {/* Eingabefelder für alle Antwortoptionen */}
          {newQuestion.answers.map((answer, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Antwort ${index + 1}`}
              value={answer}
              onChange={(e) => handleAddQuestionChange(e, index)}
            />
          ))}
          {/* Auswahl der richtigen Antwort */}
          <select
            value={newQuestion.correct}
            onChange={(e) => setNewQuestion({
              ...newQuestion, 
              correct: parseInt(e.target.value)
            })}
          >
            {newQuestion.answers.map((_, index) => (
              <option key={index} value={index}>
                Richtige Antwort: {index + 1}
              </option>
            ))}
          </select>
          <textarea
            name="explanation"
            placeholder="Erklärung"
            value={newQuestion.explanation}
            onChange={handleAddQuestionChange}
          />
          <button onClick={submitNewQuestion}>Frage speichern</button>
          <button onClick={() => setIsAddingQuestion(false)}>Abbrechen</button>
          <button onClick={handleBackToMainMenu}>Zurück zum Hauptmenü</button>
        </div>
      )}

      {/* Eingabe der Spieleranzahl im Mehrspieler-Modus */}
      {gameMode === "multiplayer" && !selectedCategory && (
        <div>
          <h1>Wähle die Anzahl der Spieler (max. 3):</h1>
          <input
            type="number"
            value={playerCount}
            onChange={(e) => setPlayerCount(Math.min(3, Math.max(1, e.target.value)))}
            min="1"
            max="3"
          />
          <button onClick={() => startGame(gameMode)}>Spiel starten</button>
          <button onClick={handleBackToMainMenu}>Zurück zum Hauptmenü</button>
        </div>
      )}

      {/* Kategorie-Auswahl, wenn Spielmodus ausgewählt ist */}
      {gameMode && !selectedCategory && !isAddingQuestion && (
        <div>
          <h1>Wähle eine Kategorie:</h1>
          {categories.map((category) => (
            <button key={category} onClick={() => chooseCategory(category)}>
              {category}
            </button>
          ))}
          <button onClick={handleBackToMainMenu}>Zurück zum Hauptmenü</button>
        </div>
      )}

      {/* Solo-Modus-Anzeige */}
      {gameMode === "solo" && selectedCategory && !finished && questions.length > 0 && (
        <div>
          <SoloMode
            questions={questions}
            currentQuestion={currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
            soloScore={soloScore}
            setSoloScore={setSoloScore}
            feedback={feedback}
            answered={answered}
            handleAnswer={handleAnswer}
            handleNext={handleNext}
          />
          <button onClick={handleBackToMainMenu}>Zurück zum Hauptmenü</button>
        </div>
      )}

      {/* Kooperativer Modus-Anzeige */}
      {gameMode === "kooperativ" && selectedCategory && !finished && questions.length > 0 && (
        <div>
          <CooperativeMode
            questions={questions}
            currentQuestion={currentQuestion}
            feedback={feedback}
            answered={answered}
            handleAnswer={handleAnswer}
            handleNext={handleNext}
          />
          <button onClick={handleBackToMainMenu}>Zurück zum Hauptmenü</button>
        </div>
      )}

      {/* Mehrspieler-Modus-Anzeige */}
      {gameMode === "multiplayer" && selectedCategory && !finished && questions.length > 0 && (
        <div>
          <MultiplayerMode
            questions={questions}
            currentQuestion={currentQuestion}
            currentPlayer={currentPlayer}
            playerScores={playerScores}
            setPlayerScores={setPlayerScores}
            feedback={feedback}
            answered={answered}
            handleAnswer={handleAnswer}
            handleNext={handleNext}
          />
          <button onClick={handleBackToMainMenu}>Zurück zum Hauptmenü</button>
        </div>
      )}

      {/* Quiz beendet - Anzeige der Ergebnisse und Highscores */}
      {finished && (
        <div>
          {/* Name für Highscore-Eintrag */}
          {showHighscoreInput && (
            <div>
              <input
                type="text"
                placeholder="Dein Name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
              <button onClick={saveHighscore}>Speichern</button>
            </div>
          )}
          
          {/* Anzeige der Highscores */}
          {renderHighscores()}
          
          <h1>Quiz beendet!</h1>
          <p>Alle Fragen wurden beantwortet.</p>
          
          {/* Zusammenfassung der Fragen und Antworten */}
          <div>
            <h2>Fragen und Antworten:</h2>
            {questions.map((q, index) => (
              <div key={index}>
                <p><strong>Frage:</strong> {q.question}</p>
                <p><strong>Antwort:</strong> {answeredQuestions[index]?.answer}</p>
                <p><strong>Erklärung:</strong> {answeredQuestions[index]?.explanation}</p>
              </div>
            ))}
          </div>

          {/* Anzeige der Punkte im Mehrspieler-Modus */}
          {gameMode === "multiplayer" && (
            <div>
              <h2>Punkte je Spieler:</h2>
              {playerScores.map((score, index) => (
                <p key={index}>
                  Spieler {index + 1}: {score} Punkte
                </p>
              ))}
            </div>
          )}

          {/* Anzeige der Punkte im Solo-Modus */}
          {gameMode === "solo" && (
            <div>
              <h2>Deine Punktzahl:</h2>
              <p>{soloScore} Punkte</p>
            </div>
          )}

          {/* Buttons zum Neustarten oder Zurück zum Hauptmenü */}
          <button onClick={restartQuiz}>Quiz neu starten</button>
          <button onClick={handleBackToMainMenu}>Zurück zum Hauptmenü</button>
        </div>
      )}
    </div>
  );
};

export default Quiz;