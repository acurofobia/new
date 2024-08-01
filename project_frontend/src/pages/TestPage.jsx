import React from 'react'
import { useState } from 'react'
import StartTestForm from '../components/StartTestForm'
import ResponseStatus from '../components/ResponseStatus'
import { Link } from 'react-router-dom'
import { FaHome } from "react-icons/fa";
import '../styles/testPage.css'

const TestPage = () => {
  const [responseStatus, setResponseStatus] = useState('');

  return (
    <>
      <Link className='home-button' to={'/'}>{<FaHome></FaHome>}</Link>
      <StartTestForm setResponseStatus={setResponseStatus}></StartTestForm>
      <ResponseStatus responseStatus={responseStatus}></ResponseStatus>
    </>
  )
}

export default TestPage