import React from 'react';
import '../styles/Quiz.css';

const CooperativeMode = ({
  questions,
  currentQuestion,
  feedback,
  answered,
  handleAnswer,
  handleNext
}) => {
  // Aktuelle Frage
  const question = questions[currentQuestion];

  return (
    <div className="quiz-mode">
      <h2>Kooperativer Modus</h2>
      <div className="progress">
        Frage {currentQuestion + 1} von {questions.length}
      </div>
      
      <div className="question">
        <h3>{question.question}</h3>
        <p className="instructions">Besprecht gemeinsam die richtige Antwort!</p>
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

      {feedback && <div className="feedback">{feedback}</div>}

      {answered && (
        <button className="next-button" onClick={handleNext}>
          Weiter
        </button>
      )}
    </div>
  );
};

export default CooperativeMode;