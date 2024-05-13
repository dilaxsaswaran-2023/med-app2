import React, { useState } from 'react';
import logo from './doctor.svg';
import './App.css';
import axios from 'axios'; // Import Axios for making HTTP requests

function App() {
  const [answers, setAnswers] = useState(Array(6).fill(null));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const questions = [
    {
      question: "Parity",
      answers: ["Nullipara", "Multipara"]
    },
    {
      question: "Previous CS",
      answers: ["Yes (One or more)", "No"]
    },
    {
      question: "Onset of labour",
      answers: ["Spontaneous", "Induced", "No labour (pre-labour CS)"]
    },
    {
      question: "Number of fetuses",
      answers: ["Singleton", "Multiple"]
    },
    {
      question: "Gestational age",
      answers: ["Preterm (less than 37 weeks)", "Term (37 weeks or more)"]
    },
    {
      question: "Fetal lie and presentation",
      answers: ["Cephalic presentation", "Breech presentation", "Transverse lie"]
    },
  ];

  const handleAnswerChange = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
    setErrorMessage('');
  };

  const handleNextQuestion = async () => {
    if (answers[currentQuestion] === null) {
      setErrorMessage('Please select an answer');
      return;
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      try {
        const response = await axios.post('http://localhost:3001/update-sheet', {
          answers,
          score: calculateScore(),
        });
        console.log(response.data);
      } catch (error) {
        console.error('Error updating spreadsheet:', error);
      }
    }
  };

  const calculateScore = () => {
    return "type 1";
  };

  const renderQuestion = () => {
    const currentQ = questions[currentQuestion];
    return (
      <div>
        <p>{currentQ.question}</p>
        {currentQ.answers.map((answer, index) => (
          <div key={index}>
            <input type="radio" name="answer" value={answer} onChange={() => handleAnswerChange(answer)} checked={answers[currentQuestion] === answer} />
            <label>{answer}</label>
          </div>
        ))}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <br />
        <button onClick={handleNextQuestion}>Next</button>
      </div>
    );
  };

  const renderResults = () => {
    let score = calculateScore(answers);
    return <p>Your score is: {score}/5</p>;
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {showResults ? renderResults() : renderQuestion()}
      </header>
    </div>
  );
}

export default App;
