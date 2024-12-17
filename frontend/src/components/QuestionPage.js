import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/QuestionPage.css';

const QuestionPage = () => {
  const questions = [
    { question: 'What is the capital of France?', options: ['Berlin', 'Madrid', 'Paris', 'Rome', 'Lisbon'], marks: [1, 2, 3, 4, 5] },
    { question: 'Who developed the theory of relativity?', options: ['Isaac Newton', 'Albert Einstein', 'Nikola Tesla', 'Marie Curie', 'Galileo Galilei'], marks: [1, 2, 3, 4, 5] },
    { question: 'What is the largest planet in our solar system?', options: ['Earth', 'Mars', 'Jupiter', 'Saturn', 'Neptune'], marks: [1, 2, 3, 4, 5] },
    { question: 'Which programming language is used for web development?', options: ['Java', 'Python', 'JavaScript', 'C++', 'Ruby'], marks: [1, 2, 3, 4, 5] },
    { question: 'Who painted the Mona Lisa?', options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Claude Monet', 'Edvard Munch'], marks: [1, 2, 3, 4, 5] },
    { question: 'What is the boiling point of water?', options: ['90°C', '100°C', '120°C', '80°C', '110°C'], marks: [1, 2, 3, 4, 5] },
    { question: 'Who is the author of Harry Potter?', options: ['J.K. Rowling', 'George R.R. Martin', 'J.R.R. Tolkien', 'C.S. Lewis', 'Mark Twain'], marks: [1, 2, 3, 4, 5] },
    { question: 'What is the largest continent?', options: ['Africa', 'Asia', 'Europe', 'North America', 'Australia'], marks: [1, 2, 3, 4, 5] },
    { question: 'Which element has the chemical symbol O?', options: ['Oxygen', 'Osmium', 'Ozone', 'Opium', 'Oganesson'], marks: [1, 2, 3, 4, 5] },
    { question: 'What is the square root of 64?', options: ['6', '8', '10', '7', '9'], marks: [1, 2, 3, 4, 5] }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [totalMarks, setTotalMarks] = useState(0); // Accumulating total marks
  const [finished, setFinished] = useState(false);
  const [email, setEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      console.log('User is not logged in.');
    }
  }, []);

  // Handle click on an answer option
  const handleAnswerClick = async (index) => {
    if (selectedAnswer !== null) return;  // Prevent selecting more than one answer per question

    const marksForSelectedOption = questions[currentQuestionIndex].marks[index];
    const updatedTotalMarks = totalMarks + marksForSelectedOption;  // Correctly accumulate total marks

    setTotalMarks(updatedTotalMarks);  // Update frontend state

    // Send updated total marks to the backend
    await submitMarks(updatedTotalMarks);

    setSelectedAnswer(index);

    // Move to the next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        setFinished(true);
        navigate('/home');  // Automatically navigate to homepage after finishing the quiz
      }
    }, 1000); // Adjust delay as necessary
  };

  // Submit marks to the backend after each answer
  const submitMarks = async (updatedTotalMarks) => {
    if (!email) {
      console.error('No email found.');
      return;
    }

    try {
      const response = await axios.patch(
        'http://localhost:8000/api/v1/users/update-marks',
        { email, marks: updatedTotalMarks } // Send updated total marks
      );
      console.log('Marks submitted successfully', response.data);
    } catch (err) {
      console.error('Error submitting marks:', err);
    }
  };

  return (
    <div className="question-container">
      {finished ? (
        <div className="finish-message">
          <h2>Quiz Finished! Marks: {totalMarks}</h2>
        </div>
      ) : (
        <div className="question">
          <h2>{questions[currentQuestionIndex].question}</h2>
          <div className="options">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${selectedAnswer === index ? 'selected' : ''}`}
                onClick={() => handleAnswerClick(index)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="question-nav">
            <p>
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionPage;
