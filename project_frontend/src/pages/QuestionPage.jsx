import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Question from '../components/Question';
import '../styles/questionPage.css'

const QuestionPage = () => {
  const {number} = useParams();
  const [end, setEnd] = useState(false);
  const navigate = useNavigate();
  const [arrayOfCheckedAnswers, setArrayOfCheckedAnswers] = useState([]);

  useEffect(() => {
    if (end) {
      navigate('/result', {state: arrayOfCheckedAnswers});
    }
  }, [end]);
  
  return (
    <>
      <div className='question-page-wrapper'>
        <Question key={number} number={number} setEnd={setEnd} arrayOfCheckedAnswers={arrayOfCheckedAnswers} setArrayOfCheckedAnswers={setArrayOfCheckedAnswers}></Question>
      </div>
    </>
  )
}

export default QuestionPage