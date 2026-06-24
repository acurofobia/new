import React, { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import ScrollToTop from '../components/ScrollToTop';
import '../styles/praktPage.css'
import '../styles/questionPage.css'

const getPoints = (answer) => {
  const points = Number(answer.points);
  return Number.isFinite(points) ? points : 0;
}

const orderAnswers = (answers, answerOrder) => {
  const arr = [...answers];
  if (answerOrder == 'points_desc') {
    return arr.sort((a, b) => {
      const pointsDifference = getPoints(b) - getPoints(a);
      if (pointsDifference != 0) {
        return pointsDifference;
      }
      return String(a.option).localeCompare(String(b.option), 'ru', { numeric: true });
    });
  }

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const PraktPage = () => {
  const navigate = useNavigate();
  const data = JSON.parse(sessionStorage.getItem('data'));
  const answerOrder = sessionStorage.getItem('answerOrder') || 'random';
  const [countP, setCountP] = useState(0);
  const [countT, setCountT] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');
  const [end, setEnd] = useState('false');
  const questions = data['prakt'];
  const {number} = useParams();
  const currentQuestion = questions[number-1];

  const shuffledAnswersArray = useMemo(() => {
    return orderAnswers(currentQuestion.options, answerOrder);
  }, [number, answerOrder]);

  useEffect(() => {
    if (end == 'true'){
      navigate('/praktresult', {state: [countP, countT]});
    }}, [end]);

  useEffect(() => {
    setButtonDisabled(true);
    setSelectedOption('');
  }, [number]);

  const onSubmit = (evt) => {
    evt.preventDefault();
    const selectedAnswer = shuffledAnswersArray.find(
      (answer) => String(answer.option) === selectedOption
    );
    if (!selectedAnswer) {
      return;
    }
    if (currentQuestion.type == 'prakt') {
      setCountP((prev) => prev + getPoints(selectedAnswer));
    } else {
      setCountT((prev) => prev + getPoints(selectedAnswer));
    }
    selectedAnswer.answered = true;
    questions[number-1].options = shuffledAnswersArray;
    data['prakt'] = questions;
    sessionStorage.setItem('data', JSON.stringify(data));
    if (parseInt(number) == parseInt(questions.length)){
      setEnd('true');
    } else{
      setEnd('false');
      navigate(`/prakt/${parseInt(number) + 1}`);
    }
  }

  return (
    <>
      <ScrollToTop></ScrollToTop>
      <form className='question-page-wrapper question-page-form' onSubmit={onSubmit}>
        <h3 className='prakt-page-question'>{(currentQuestion.type == 'prakt') ? 'Практическая': 'Тематическая'} задача: {currentQuestion.question}</h3>
        <img src={currentQuestion.image} alt="" />
        <p className='prakt-page-question-help'>Выберите 1 правильный ответ</p>
        { shuffledAnswersArray.map((answer) => {
          const option = String(answer.option);
          const inputId = `prakt-${number}-answer-${option}`;
          return <div key={inputId}>
            <input
              className='prakt-page-input'
              type='radio'
              checked={selectedOption === option}
              onChange={() => {
                setSelectedOption(option);
                setButtonDisabled(false);
              }}
              id={inputId}
              name="answer"
              value={option}
            />
            <label htmlFor={inputId} className="prakt-page-answer">{answer.answer}</label>
          </div>
        }) }
        <button className='button' disabled={buttonDisabled} type='submit'>Следующий вопрос</button>
      </form>
    </>
  )
}

export default PraktPage
