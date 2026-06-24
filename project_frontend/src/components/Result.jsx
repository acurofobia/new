import React, { useEffect } from 'react'

const Result = ({element, setRightAnswered}) => {
  const lime = {
    backgroundColor: 'lime'
  }
  const red = {
    backgroundColor: 'red'
  }
  let questionNumber = '';
  for (const key in element) {
    questionNumber = key;
  }
  const questions = JSON.parse(sessionStorage.getItem('data'));
  const answersForQuestion = Object.entries(questions[questionNumber].answers);
  const selectedAnswerKey = String(element[questionNumber]);

  let ignore = false;
  useEffect(() => {
    if (!ignore) {
      answersForQuestion.forEach(([key, answer]) => {
        if((answer.right == true) && (key === selectedAnswerKey)) {
          setRightAnswered(old => old + 1);
        }
      })
    }
    return () => { ignore = true }
  }, [])

  const selectColor = (key, answer) => {
    if (answer.right) {
      return lime;
    }
    if (key === selectedAnswerKey) {
      return red;
    }
    return;
  }

  return (
    <div className='result-page-wrapper-result'>
      <h3 className='result-page-result-header'>{questions[questionNumber].question}</h3>
      <div className='result-page-result-wrapper'>
        {answersForQuestion.map(([key, answer]) => {
          return <p key={key} style={selectColor(key, answer)}>{answer.answer}</p>
        })}
      </div>
    </div>
  )
}

export default Result
