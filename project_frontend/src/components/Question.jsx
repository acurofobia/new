import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Answer from './Answer';

const Question = ({number, setEnd, setArrayOfCheckedAnswers}) => {
  const questions = JSON.parse(sessionStorage.getItem('data'));
  console.log(JSON.parse(sessionStorage.getItem('data')));
  const arrayOfQuestionsKeys = Object.keys(questions).slice(0, -3);
  const answers = questions[arrayOfQuestionsKeys[number-1]].answers;
  const navigate = useNavigate();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [checkedAnswer, setCheckedAnswer] = useState('');
  const [shuffledAnswers] = useState(() => {
    const arr = [];
    for (const key in answers) {
      arr.push({ key, ...answers[key] });
    }
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  const onSubmit = (evt) => {
    evt.preventDefault();
    const currentQuestionNumber = arrayOfQuestionsKeys[number-1];
    const a = {};
    a[currentQuestionNumber] = checkedAnswer;
    setArrayOfCheckedAnswers(old => [...old, a]);

    questions[currentQuestionNumber].answers[checkedAnswer].selected = true;
    sessionStorage.setItem('data', JSON.stringify(questions));
    
    if (!questions[arrayOfQuestionsKeys[number]]) {
      console.log('HERE!!!')
      setEnd(true);
    } else {
      setEnd(false);
      navigate(`/question/${parseInt(number) + 1}`);
    }
  }

  return (
    <form className='question-page-form' onChange={() => setButtonDisabled(false)} onSubmit={onSubmit}>
      <h3 className='question-page-question'>{questions[arrayOfQuestionsKeys[number-1]].question}</h3>
      { shuffledAnswers.map((answer, id) => {
        return <Answer setCheckedAnswer={setCheckedAnswer} answer={answer} id={answer.key} key={id}></Answer>
      }) }
      <button className='button' disabled={buttonDisabled} type='submit'>Следующий вопрос</button>
    </form>
  )
}

export default Question