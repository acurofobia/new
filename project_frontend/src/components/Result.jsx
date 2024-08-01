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
  const answersForQuestion = [];

  for (const key in questions[questionNumber].answers) {
    answersForQuestion.push(questions[questionNumber].answers[key])
  }

  let ignore = false;
  useEffect(() => {
    if (!ignore) {
      answersForQuestion.forEach((answer, id) => {
        if((answer.right == true) && (id+1 == element[questionNumber])) {
          setRightAnswered(old => old + 1);
        }
      })
    }
    return () => { ignore = true }
  }, [])

  const selectColor = (id, answer) => {
    if (answer.right) {
      return lime;
    }
    if (id+1 == element[questionNumber]) {
      return red;
    }
    return;
  }

  return (
    <div className='result-page-wrapper-result'>
      <h3 className='result-page-result-header'>{questions[questionNumber].question}</h3>
      <div className='result-page-result-wrapper'>
        {answersForQuestion.map((answer, id) => {
          return <p key={id} style={selectColor(id, answer)}>{answer.answer}</p>
        })}
      </div>
    </div>
  )
}

export default Result