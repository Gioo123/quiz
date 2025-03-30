import React from 'react';
import '../styles/Quiz.css';

const MultiplayerMode = ({
  questions,
  currentQuestion,
  currentPlayer,
  playerScores,
  feedback,
  answered,
  handleAnswer,
  handleNext,
  playerNames // Diese Prop hinzufügen
}) => {
  // Aktuelle Frage
  const question = questions[currentQuestion];
  
  // Fallback für playerNames, falls sie nicht definiert sind
  const names = playerNames || [`Spieler 1`, `Spieler 2`, `Spieler 3`];

  return (
    <div className="quiz-mode">
      <h2>Mehrspieler-Modus</h2>
      <div className="progress">
        Frage {currentQuestion + 1} von {questions.length}
      </div>
      <div className="player-turn">{names[currentPlayer]} ist an der Reihe</div>
      
      <div className="player-scores">
        {playerScores.map((score, index) => (
          <div key={index} className={`player-score ${index === currentPlayer ? 'active' : ''}`}>
            {names[index]}: {score} Punkte
          </div>
        ))}
      </div>

      <div className="question">
        <h3>{question.question}</h3>
        <div className="answers">
          {question.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={answered}
              className={answered && index === question.correct ? 'correct' : ''}
            >
              {answer}
            </button>
          ))}
        </div>
      </div>

      {feedback && <div className="feedback">
        {feedback.replace(`Spieler ${currentPlayer + 1}`, names[currentPlayer])}
      </div>}

      {answered && (
        <button className="next-button" onClick={handleNext}>
          Weiter
        </button>
      )}
    </div>
  );
};

export default MultiplayerMode;