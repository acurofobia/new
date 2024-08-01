import React from 'react'

const Answer = ({answer, id, setCheckedAnswer}) => {

  return (
    <>
      <input className='question-page-input' onChange={() => setCheckedAnswer(id)} type="radio" id={id} name="answer" />
      <label htmlFor={id} className="question-page-answer answer">{answer.answer}</label>
    </>
  )
}

export default Answer