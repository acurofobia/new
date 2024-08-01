import React, { useEffect } from 'react'
import { useState } from 'react'
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import '../styles/adminPage.css';
import svg from './1.svg';

const AdminPage = () => {
  const [org, setOrg] = useState('fda');
  const [uin, setUin] = useState('');
  const [category, setCategory] = useState('');
  const questions = useRef('');
  const [pQuestions, setPQuestions] = useState('');
  const [tQuestions, setTQuestions] = useState('');
  const [responseStatus, setResponseStatus] = useState('Ответа нет');
  const [allUins, setAllUins] = useState([]);
  const svg2 = svg + '#curve';

  const onSubmit = (evt) => {
    evt.preventDefault();

    fetch(`http://localhost:5000/add/${org}/${uin}/${category}/${questions.current?.value}/${pQuestions}/${tQuestions}`, {
      method: 'PUT'
    })
    .then((res) => {
      if(res.ok) {
        console.log('OK');
      }
      else {
        return Promise.reject(res.status);
      }
    })
    .then ((data) => {
      setResponseStatus('Отправлено');
      onClick();
    })
    .catch ((error) => {
      if (error == 409) {
        setResponseStatus('УИН ЕСТЬ')
      } else {
        setResponseStatus('Другая ошибка')
      }
      ;
    })
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

  const onDelete = (evt) => {
    fetch(`http://localhost:5000/del/${evt.target.textContent}`, {
      method: "DELETE"
    })
    .then((res) => {
      onClick();
    })
  }
  
  return (
    <>
      <Link className='home-button' to={'/'}>{<FaHome></FaHome>}</Link>
      <h1 className='admin-page-header header' >Администрирование</h1>
      <h2 className='header2'>Форма добавления билета:</h2>
      <form className='admin-page-form' onSubmit={(evt) => onSubmit(evt)}>
        <select className='page-form-item' onChange={(evt) => {setOrg(evt.target.value)}}>
          <option value="fda">ФДА</option>
          <option value="favt_mos">ФАВТ Москва</option>
        </select>
        <svg viewBox="0 0 382 17" className='svg'>
          <use href={svg2} /> 
        </svg> 
        <input className='page-form-item' onChange={(evt) => {setUin(evt.target.value)}} type="text" placeholder='УИН' />
        <svg viewBox="0 0 382 17" className='svg'>
          <use href={svg2} /> 
        </svg> 
        <input className='page-form-item' onChange={(evt) => {setCategory(evt.target.value)}} type="text" placeholder='Категория'/>
        <svg viewBox="0 0 382 17" className='svg'>
          <use href={svg2} /> 
        </svg> 
        <input className='page-form-item' type="text" placeholder='Вопросы' ref={questions} defaultValue={(org == 'favt_mos') ? '1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70' : ''} />
        <svg viewBox="0 0 382 17" className='svg'>
          <use href={svg2} /> 
        </svg>
        <input className='page-form-item' type="text" placeholder='Вопросы практика' onChange={(evt) => {setPQuestions(evt.target.value)}} />
        <svg viewBox="0 0 382 17" className='svg'>
          <use href={svg2} /> 
        </svg> 
        <input className='page-form-item' type="text" placeholder='Вопросы тематика' onChange={(evt) => {setTQuestions(evt.target.value)}} />
        <svg viewBox="0 0 382 17" className='svg'>
          <use href={svg2} /> 
        </svg> 
        <button className='admin-page-button button' type='submit'>Отправить данные</button>
      </form>
      <div className='server-response'>
        <p>Ответ от сервера: </p>
        <p className='server-response-status'>{responseStatus}</p>
      </div>
      <h3 className='header2'>Все уины:</h3>
      <div className='uins-wrapper'>
        {allUins.map((uin, id) => {
          return <p className='uins' onClick={onDelete} key={id}>{uin}</p>
        })}
      </div>
    </>
  )
}

export default AdminPage