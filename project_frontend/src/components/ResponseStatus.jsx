import React from 'react'
import { Link } from 'react-router-dom'

const ResponseStatus = ({responseStatus}) => {
  const setCurrentTime = () => {
    const currentdate = new Date();
    const currentTime = currentdate.getHours() + ":"  
                                    + currentdate.getMinutes() + ":" 
                                    + currentdate.getSeconds();
    sessionStorage.setItem('startTestTime', currentTime);
  }

  const createBlockIfSuccess = () => {
    if (responseStatus == 'Уин найден, можете приступать к тесту') {
      return <Link className='button' onClick={() => setCurrentTime()} to={'/question/1'}>Начать тест</Link>
    }
  }

  return (
    <>
      <h3 className='test-page-header2 header2'>Статус:</h3>
      <p className='test-page-status'>{responseStatus}</p>
      <>{createBlockIfSuccess()}</>
    </>
  )
}

export default ResponseStatus