import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Answer from './Answer';

const Question = ({number, setEnd, setArrayOfCheckedAnswers}) => {
  const questions = JSON.parse(sessionStorage.getItem('data'));
  const arrayOfQuestionsKeys = Object.keys(questions).slice(0, -3);
  const answers = questions[arrayOfQuestionsKeys[number-1]].answers;
  const navigate = useNavigate();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [checkedAnswer, setCheckedAnswer] = useState('');
  const [orderedAnswers] = useState(() => {
    const arr = [];
    for (const key in answers) {
      arr.push({ key, ...answers[key] });
    }
    const answerOrder = sessionStorage.getItem('testAnswerOrder')
      || sessionStorage.getItem('answerOrder')
      || 'random';
    if (answerOrder == 'points_desc') {
      return arr.sort((a, b) => {
        const rightDifference = Number(b.right) - Number(a.right);
        if (rightDifference != 0) {
          return rightDifference;
        }
        return String(a.key).localeCompare(String(b.key), 'ru', { numeric: true });
      });
    }
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  const onSubmit = (evt) => {
    evt.preventDefault();
    if (!checkedAnswer) {
      return;
    }
    const currentQuestionNumber = arrayOfQuestionsKeys[number-1];
    const a = {};
    a[currentQuestionNumber] = checkedAnswer;
    setArrayOfCheckedAnswers(old => [...old, a]);

    questions[currentQuestionNumber].answers[checkedAnswer].selected = true;
    sessionStorage.setItem('data', JSON.stringify(questions));
    
    if (!questions[arrayOfQuestionsKeys[number]]) {
      setEnd(true);
    } else {
      setEnd(false);
      navigate(`/question/${parseInt(number) + 1}`);
    }
  }

  return (
    <form className='question-page-form' onChange={() => setButtonDisabled(false)} onSubmit={onSubmit}>
      <h3 className='question-page-question'>{questions[arrayOfQuestionsKeys[number-1]].question}</h3>
      { orderedAnswers.map((answer) => {
        const inputId = `question-${number}-answer-${answer.key}`;
        return <Answer
          setCheckedAnswer={setCheckedAnswer}
          answer={answer}
          id={answer.key}
          name={inputId}
          checked={checkedAnswer === answer.key}
          key={answer.key}
        />
      }) }
      <button className='button' disabled={buttonDisabled} type='submit'>Следующий вопрос</button>
    </form>
  )
}

export default Question
