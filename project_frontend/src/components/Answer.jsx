import React from 'react'

const Answer = ({answer, id, name, checked, setCheckedAnswer}) => {

  return (
    <>
      <input
        className='question-page-input'
        checked={checked}
        onChange={() => setCheckedAnswer(id)}
        type="radio"
        id={name}
        name="answer"
        value={id}
      />
      <label htmlFor={name} className="question-page-answer answer">{answer.answer}</label>
    </>
  )
}

export default Answer
