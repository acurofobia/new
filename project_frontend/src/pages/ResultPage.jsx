import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Result from '../components/Result';
import { useState } from 'react';
import '../styles/resultPage.css';

const ResultPage = () => {
  const location = useLocation();
  const data = location.state;
  const [rightAnswered, setRightAnswered] = useState(0);
  const selectedUin = parseInt(sessionStorage.getItem('selectedUin'));
  const questions = JSON.parse(sessionStorage.getItem('data'));
  const category = questions.category;
  delete questions.category;
  const toSend = {}
  toSend[selectedUin] = questions;
  const currentdate = new Date();
  toSend.timeEnd = ("0" + currentdate.getHours()).slice(-2) + ":"
                                    + ("0" + currentdate.getMinutes()).slice(-2) + ":"
                                    + ("0" + currentdate.getSeconds()).slice(-2);
  toSend.date = ("0" + currentdate.getDate()).slice(-2) + "." + ("0" + (currentdate.getMonth()+1)).slice(-2)  + "." + currentdate.getFullYear();
  sessionStorage.setItem('endTestTime', toSend.timeEnd);

  return (
    <div className='result-page-wrapper'>
      <h2 className='result-page-header2 header2'>Ваш УИН: {selectedUin}</h2>
      <p className='result-page-attension'><strong>Внимание!</strong> Не нажимайте на кнопку ниже без указания руководителя проверки</p>
      <Link className='button' to={'/prakt/1'}>Перейти к практическим вопросам</Link>
      <h2 className='result-page-header3 header2'>Результаты прохождения тестовой части:</h2>
      <p className='result-page-result'>Правильно: {rightAnswered}</p>
      {data.map((element, id) => {
        return <Result setRightAnswered={setRightAnswered} key={id} element={element} />
      })}
    </div>
    
  )
}

export default ResultPage