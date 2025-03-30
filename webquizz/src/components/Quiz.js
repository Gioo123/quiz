import React, { useState, useEffect } from "react";
import "./Quiz.css";
import SoloMode from "./SoloMode";
import MultiplayerMode from "./MultiplayerMode";
import CooperativeMode from "./CooperativeMode";
import axios from "axios"; // Stelle sicher, dass axios installiert ist: npm install axios

// API Basis-URL (passe dies an deine Umgebung an)
// Statt einer absoluten URL:
// const API_URL = "http://localhost:4000";

// Verwende einen relativen Pfad:
const API_URL = "https://webquiz-tqdz.onrender.com";

const Quiz = () => {
  console.log("Quiz-Komponente geladen!");

  // State-Variablen
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameMode, setGameMode] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [highscores, setHighscores] = useState([]);
  const [playerScores, setPlayerScores] = useState([0, 0, 0]);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [playerCount, setPlayerCount] = useState(3);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [soloScore, setSoloScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  // State für Spielernamen im Multiplayer-Modus
  const [playerNames, setPlayerNames] = useState(["Spieler 1", "Spieler 2", "Spieler 3"]);
  const [showHighscoreInput, setShowHighscoreInput] = useState(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "A",
    category_id: ""
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Zurück zum Hauptmenü
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
      backToMainMenu();
    }
  };

  // Beim ersten Laden: Kategorien vom Backend holen
  useEffect(() => {
    // Lade die Kategorien vom Backend
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Fehler beim Laden der Kategorien:", error);
      }
    };

    // Lade Highscores vom Backend
    const fetchHighscores = async () => {
      try {
        const response = await axios.get(`${API_URL}/highscores`);
        setHighscores(response.data);
      } catch (error) {
        console.error("Fehler beim Laden der Highscores:", error);
      }
    };

    fetchCategories();
    fetchHighscores();

    // Prüfe, ob ein Token im localStorage ist
    const token = localStorage.getItem('quizToken');
    if (token) {
      // Extrahiere Benutzerinformationen aus dem JWT (vereinfacht)
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        setUser({ id: payload.id, email: payload.email });
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Fehler beim Dekodieren des Tokens:", error);
        localStorage.removeItem('quizToken'); // Entferne ungültigen Token
      }
    }
  }, []);

  // Funktion zum Auswählen einer Kategorie
  const chooseCategory = async (categoryId) => {
    setSelectedCategory(categoryId);
    
    try {
      // Lade Fragen für die ausgewählte Kategorie
      const response = await axios.get(`${API_URL}/questions?category=${categoryId}`);
      
      // Konvertiere die Antworten in das Format, das dein Frontend erwartet
      const formattedQuestions = response.data.map(q => {
        // Konvertiere die Datenbank-Antworten in das Array-Format, das dein Frontend erwartet
        const answers = [q.option_a, q.option_b, q.option_c, q.option_d];
        
        // Konvertiere die korrekte Option (A, B, C, D) in einen Index (0, 1, 2, 3)
        let correctIndex = 0;
        switch(q.correct_option) {
          case 'A': correctIndex = 0; break;
          case 'B': correctIndex = 1; break;
          case 'C': correctIndex = 2; break;
          case 'D': correctIndex = 3; break;
          default: correctIndex = 0;
        }
        
        return {
          category: q.category_id, // oder hole den Kategorienamen, falls nötig
          question: q.question,
          answers: answers,
          correct: correctIndex,
          explanation: q.explanation || "Keine Erklärung verfügbar." // Falls keine Erklärung vorhanden ist
        };
      });
      
      setQuestions(formattedQuestions);
      setCurrentQuestion(0);
      setFinished(false);
      setFeedback(null);
      setAnswered(false);
      setAnsweredQuestions({});
    } catch (error) {
      console.error("Fehler beim Laden der Fragen:", error);
    }
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
  const saveHighscore = async () => {
    if (!isLoggedIn) {
      alert("Bitte logge dich ein, um deinen Highscore zu speichern.");
      return;
    }

    let score = 0;
    if (gameMode === "solo") {
      score = soloScore;
    } else if (gameMode === "multiplayer") {
      // Im Multiplayer: Höchster Spielerstand
      score = Math.max(...playerScores);
    } else if (gameMode === "kooperativ") {
      // Im Kooperativmodus: Alle richtigen Antworten
      score = Object.values(answeredQuestions).filter(q => q.isCorrect).length;
    }

    try {
      await axios.post(`${API_URL}/highscores`, {
        user_id: user.id,
        score: score,
        mode: gameMode
      });
      
      // Hole aktualisierte Highscores
      const response = await axios.get(`${API_URL}/highscores`);
      setHighscores(response.data);
      
      setShowHighscoreInput(false);
      alert("Highscore erfolgreich gespeichert!");
    } catch (error) {
      console.error("Fehler beim Speichern des Highscores:", error);
      alert("Es gab einen Fehler beim Speichern deines Highscores.");
    }
  };

  // Funktion zum Neustarten des Quiz
  const restartQuiz = () => {
    backToMainMenu();
  };

  // Login-Funktion
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    
    try {
      const response = await axios.post(`${API_URL}/login`, loginData);
      const { token } = response.data;
      
      // Token im localStorage speichern
      localStorage.setItem('quizToken', token);
      
      // Token decodieren, um Benutzerdaten zu erhalten
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      setUser({ id: payload.id, email: payload.email });
      setIsLoggedIn(true);
      setShowLoginForm(false);
      setLoginData({ email: "", password: "" });
    } catch (error) {
      console.error("Login fehlgeschlagen:", error);
      setAuthError(error.response?.data?.error || "Login fehlgeschlagen");
    }
  };

  // Registrierungs-Funktion
  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError("");
    
    try {
      const response = await axios.post(`${API_URL}/register`, registerData);
      alert("Registrierung erfolgreich! Bitte logge dich jetzt ein.");
      setShowRegisterForm(false);
      setShowLoginForm(true);
      setRegisterData({ email: "", password: "" });
    } catch (error) {
      console.error("Registrierung fehlgeschlagen:", error);
      setAuthError(error.response?.data?.error || "Registrierung fehlgeschlagen");
    }
  };

  // Logout-Funktion
  const handleLogout = () => {
    localStorage.removeItem('quizToken');
    setIsLoggedIn(false);
    setUser(null);
  };

  // Funktion zum Aktualisieren des neuen Frage-Objekts
  const handleAddQuestionChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion({ ...newQuestion, [name]: value });
  };

  // Funktion zum Übermitteln einer neuen Frage ans Backend
  const submitNewQuestion = async () => {
    if (!isLoggedIn) {
      alert("Bitte logge dich ein, um eine Frage einzureichen.");
      return;
    }
    
    // Überprüfe, ob alle Felder ausgefüllt sind
    if (!newQuestion.category_id || !newQuestion.question || 
        !newQuestion.option_a || !newQuestion.option_b || 
        !newQuestion.option_c || !newQuestion.option_d) {
      alert("Bitte fülle alle Felder aus!");
      return;
    }

    try {
      // Hier würdest du eine API zum Speichern der Frage aufrufen
      // Diese Route müsstest du noch auf deinem Backend implementieren
      await axios.post(`${API_URL}/questions`, newQuestion);
      
      alert("Deine Frage wurde erfolgreich eingereicht!");
      setIsAddingQuestion(false);
      
      // Setze das Formular zurück
      setNewQuestion({
        question: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: "A",
        category_id: ""
      });
    } catch (error) {
      console.error("Fehler beim Einreichen der Frage:", error);
      alert("Es gab einen Fehler beim Einreichen deiner Frage.");
    }
  };

  // Render-Methode der Komponente
  return (
    <div className="quiz-container">
      {/* Benutzerauthentifizierung */}
      <div className="auth-container">
        {isLoggedIn ? (
          <div className="user-info">
            <span>Eingeloggt als: {user.email}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button onClick={() => setShowLoginForm(true)}>Login</button>
            <button onClick={() => setShowRegisterForm(true)}>Registrieren</button>
          </div>
        )}
      </div>

      {/* Login-Formular */}
      {showLoginForm && (
        <div className="modal">
          <h2>Login</h2>
          {authError && <p className="error">{authError}</p>}
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="E-Mail"
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Passwort"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              required
            />
            <button type="submit">Einloggen</button>
            <button type="button" onClick={() => setShowLoginForm(false)}>Abbrechen</button>
          </form>
        </div>
      )}

      {/* Registrierungs-Formular */}
      {showRegisterForm && (
        <div className="modal">
          <h2>Registrieren</h2>
          {authError && <p className="error">{authError}</p>}
          <form onSubmit={handleRegister}>
            <input
              type="email"
              placeholder="E-Mail"
              value={registerData.email}
              onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Passwort"
              value={registerData.password}
              onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
              required
            />
            <button type="submit">Registrieren</button>
            <button type="button" onClick={() => setShowRegisterForm(false)}>Abbrechen</button>
          </form>
        </div>
      )}

      {/* Hauptmenü - Anzeige, wenn kein Spielmodus ausgewählt ist */}
      {!gameMode && !showLoginForm && !showRegisterForm && (
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
          <select
            name="category_id"
            value={newQuestion.category_id}
            onChange={handleAddQuestionChange}
          >
            <option value="">Kategorie auswählen</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="text"
            name="question"
            placeholder="Frage"
            value={newQuestion.question}
            onChange={handleAddQuestionChange}
          />
          <input
            type="text"
            name="option_a"
            placeholder="Antwort A"
            value={newQuestion.option_a}
            onChange={handleAddQuestionChange}
          />
          <input
            type="text"
            name="option_b"
            placeholder="Antwort B"
            value={newQuestion.option_b}
            onChange={handleAddQuestionChange}
          />
          <input
            type="text"
            name="option_c"
            placeholder="Antwort C"
            value={newQuestion.option_c}
            onChange={handleAddQuestionChange}
          />
          <input
            type="text"
            name="option_d"
            placeholder="Antwort D"
            value={newQuestion.option_d}
            onChange={handleAddQuestionChange}
          />
          <select
            name="correct_option"
            value={newQuestion.correct_option}
            onChange={handleAddQuestionChange}
          >
            <option value="A">A ist korrekt</option>
            <option value="B">B ist korrekt</option>
            <option value="C">C ist korrekt</option>
            <option value="D">D ist korrekt</option>
          </select>
          <textarea
            name="explanation"
            placeholder="Erklärung (optional)"
            value={newQuestion.explanation || ""}
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
      onChange={(e) => setPlayerCount(Math.min(3, Math.max(1, parseInt(e.target.value))))}
      min="1"
      max="3"
    />
    
    {/* Eingabefelder für Spielernamen */}
    <div className="player-names">
      <h2>Spielernamen:</h2>
      {Array.from({ length: playerCount }).map((_, index) => (
        <div key={index} className="player-name-input">
          <label>
            Spieler {index + 1}:
            <input
              type="text"
              value={playerNames[index]}
              onChange={(e) => {
                const newNames = [...playerNames];
                newNames[index] = e.target.value || `Spieler ${index + 1}`;
                setPlayerNames(newNames);
              }}
              placeholder={`Spieler ${index + 1}`}
            />
          </label>
        </div>
      ))}
    </div>
    
    <button onClick={() => startGame(gameMode)}>Spiel starten</button>
    <button onClick={handleBackToMainMenu}>Zurück zum Hauptmenü</button>
  </div>
)}


      {/* Kategorie-Auswahl, wenn Spielmodus ausgewählt ist */}
      {gameMode && !selectedCategory && !isAddingQuestion && (
        <div>
          <h1>Wähle eine Kategorie:</h1>
          {categories.map((category) => (
            <button key={category.id} onClick={() => chooseCategory(category.id)}>
              {category.name}
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
          {/* Speichern des Highscores */}
          {isLoggedIn && showHighscoreInput && (
            <div>
              <button onClick={saveHighscore}>Highscore speichern</button>
            </div>
          )}
          
          {/* Anzeige der Highscores */}
          <div>
            <h2>Highscores</h2>
            <table>
              <thead>
                <tr>
                  <th>Spieler</th>
                  <th>Modus</th>
                  <th>Punkte</th>
                  <th>Datum</th>
                </tr>
              </thead>
              <tbody>
                {highscores.map((score, index) => (
                  <tr key={index}>
                    <td>{score.user_email}</td>
                    <td>{score.mode}</td>
                    <td>{score.score}</td>
                    <td>{new Date(score.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
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