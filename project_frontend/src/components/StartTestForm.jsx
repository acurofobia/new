import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';

const StartTestForm = ({setResponseStatus}) => {
  const [uin, setUin] = useState('');
  const [allUins, setAllUins] = useState([])

  const submitForm = async (evt) => {
    evt.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/api/${uin}`);
      if (res.ok) {
        const data = await res.json();
        const dataUin = data.uin;
        setResponseStatus(`Уин найден, можете приступать к тесту`);
        console.log(JSON.parse(data.questions));
        sessionStorage.setItem('data', (data.questions));
        sessionStorage.setItem('selectedUin', dataUin);
      } else {
        setResponseStatus(res.status);
        return;
      }
    }catch (error){
      setResponseStatus(error.message);
      return;
    }
  }

  const onClick = () => {
    fetch('http://localhost:5000/show')
    .then((res) => {
      return res.json();
    })
    .then ((data) => {
      setAllUins(data.uins)
    })
  }

  useEffect (() => {
    onClick();
  }, [])

  return (
    <>
      <h2 className='header'>Введите ваш УИН</h2>
      <form className='start-test-form' onSubmit={submitForm}>
        <input className='page-form-item' type='text' onChange={(evt) => setUin(evt.target.value)} required/>
        <button className='test-page-button button' type='submit'>Найти УИН</button>
      </form>
      <h3 className='header2'>Все уины:</h3>
      <div className='uins-wrapper'>
        {allUins.map((uin, id) => {
          return <p className='test-page-uins uins' key={id}>{uin}</p>
        })}
      </div>
    </>
  )
}

export default StartTestForm