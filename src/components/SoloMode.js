import React from "react";

const SoloMode = ({ questions, currentQuestion, setCurrentQuestion, soloScore, setSoloScore, feedback, answered, handleAnswer, handleNext }) => {
  return (
    <div>
      <h1>Frage {currentQuestion + 1} von {questions.length}</h1>
      <p>{questions[currentQuestion].question}</p>
      <div className="answers-container">
        {questions[currentQuestion].answers.map((answer, index) => (
          <button key={index} onClick={() => handleAnswer(index)} disabled={answered}>
            {answer}
          </button>
        ))}
      </div>
      {feedback && <p className="feedback">{feedback}</p>}
      <button onClick={handleNext} disabled={!answered}>Weiter</button>
    </div>
  );
};

export default SoloMode;
