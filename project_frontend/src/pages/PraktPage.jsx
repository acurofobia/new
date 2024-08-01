import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import '../styles/praktPage.css'
import '../styles/questionPage.css'

const PraktPage = () => {
  const navigate = useNavigate();
  const data = JSON.parse(sessionStorage.getItem('data'));
  const [countP, setCountP] = useState(0);
  const [countT, setCountT] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [end, setEnd] = useState('false');
  const questions = data['prakt'];
  const {number} = useParams();
  
  useEffect(() => {
    if (end == 'true'){
      navigate('/praktresult', {state: [countP, countT]});
    }}, [end]);
  const answersArray = questions[number-1].options;
  const array = [0, 1, 2, 3];

  const onSubmit = (evt) => {
    evt.preventDefault();
    for (const answer in array) {
      if (evt.target[answer].checked) {
        if (questions[number-1].type == 'prakt') {
          setCountP((prev) => prev + answersArray[answer].points);
        } else {
          setCountT((prev) => prev + answersArray[answer].points);
        }
        answersArray[answer].answered = true;
      }
    }
    questions[number-1].options = answersArray;
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
    <form className='question-page-wrapper question-page-form' onSubmit={onSubmit} onChange={() => setButtonDisabled(false)}>
      <h3 className='prakt-page-question'>{(questions[number-1].type == 'prakt') ? 'Практическая': 'Тематическая'} задача: {questions[number-1].question}</h3>
      <p className='prakt-page-question-help'>Выберите 2 правильных ответа</p>
      { answersArray.map((answer) => {
        return <div key={number + answer.option}>
          <input className='prakt-page-input' type='checkbox' defaultChecked={false} id={answer.option} name="answer" />
          <label htmlFor={answer.option} className="prakt-page-answer">{answer.answer}</label>
        </div>
      }) }
      <button className='button' disabled={buttonDisabled} type='submit'>Слудующий вопрос</button>
    </form>
  )
}

export default PraktPage