import React from 'react'
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa";

const PraktResultPage = () => {
  const location = useLocation();
  const counts = location.state;
  const praktCount = counts[0];
  const temCount = counts[1];
  const currentdate = new Date();
  sessionStorage.setItem('date', ("0" + currentdate.getDate()).slice(-2)+ "." + ("0" + (currentdate.getMonth()+1)).slice(-2) + "." + currentdate.getFullYear());

  const toSend = {};
  const questions = JSON.parse(sessionStorage.getItem('data'));
  toSend[parseInt(sessionStorage.getItem('selectedUin'))] = questions;
  const selectedUin = parseInt(sessionStorage.getItem('selectedUin'));
  const category = questions.category;
  toSend.praktCount = praktCount;
  toSend.temCount = temCount;
  toSend.praktTicket = parseInt(sessionStorage.getItem('praktTicket'));
  toSend.temTicket = parseInt(sessionStorage.getItem('temTicket'));
  toSend.testTimeEnd = sessionStorage.getItem('endTestTime');
  toSend.testTimeStart = sessionStorage.getItem('startTestTime');
  toSend.date = sessionStorage.getItem('date');

  fetch(`api/end/${selectedUin}/${category}`, {
    method: "PUT",
    body: JSON.stringify({'test': JSON.stringify(toSend)}),
    headers: {
      'content-type': 'application/json'
    }})

  return (
    <div className='result-page-wrapper'>
      <Link className='home-button' to={'/'}>{<FaHome></FaHome>}</Link>
      <h2 className='header'> Результаты прохождения практических и тематических задач</h2>
      <h3 className='header2'>Практические задачи: {praktCount} баллов</h3>
      <h3 className='header2'>Тематические задачи: {temCount} баллов</h3>
    </div>
  )
}

export default PraktResultPage
