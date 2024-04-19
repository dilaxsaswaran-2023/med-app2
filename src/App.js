import React, { useState } from 'react';
import logo from './doctor.svg';
import './App.css';

function App() {
  const GOOGLE_SHEETS_API_AUTH = require('./med-app-key.json');
  const [answers, setAnswers] = useState(Array(5).fill(null));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const questions = [
    {
      question: "What is 1 + 1?",
      answers: ["1", "2", "3"]
    },
    {
      question: "What is the capital of France?",
      answers: ["London", "Berlin", "Paris"]
    },
    {
      question: "What is the tallest mountain in the world?",
      answers: ["Mount Everest", "K2", "Kangchenjunga"]
    },
    {
      question: "Who wrote 'To Kill a Mockingbird'?",
      answers: ["Harper Lee", "J.K. Rowling", "Stephen King"]
    },
    {
      question: "What is the chemical symbol for water?",
      answers: ["H2O", "CO2", "NaCl"]
    }
  ];

  const handleAnswerChange = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
    setSelectedAnswers(prevAnswers => [...prevAnswers, { question: currentQuestion + 1, answer: value }]);
    setErrorMessage('');
  };

  const handleNextQuestion = () => {
    if (answers[currentQuestion] === null) {
      setErrorMessage('Please select an answer');
      return;
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      console.log("Selected Answers:", selectedAnswers);
      setAnswers(prevAnswers => {
        const newAnswers = [...prevAnswers];
        newAnswers[currentQuestion] = null;
        return newAnswers;
      });
    } else {
      setShowResults(true);
    }
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
    let score = answers.reduce((acc, answer) => acc + (answer === '2' || answer === 'Paris' || answer === 'Mount Everest' || answer === 'Harper Lee' || answer === 'H2O' ? 1 : 0), 0);
    console.log("Selected Answers:", selectedAnswers);
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
