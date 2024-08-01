import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/homePage.css'

const HomePage = () => {
  return (
    <>
      <h1 className="home-page-header header">Аттестация сил ОТБ</h1>
      <nav className=" home-page-nav">
        <ul className=" home-page-nav-list">
          <li className=" home-page-nav-list-item">
            <Link to={'/admin'} className="button">Администрирование</Link>
          </li>
          <li className=" home-page-nav-list-item">
            <Link to={'/test'} className="button">Тестирование</Link>
          </li>
          <li className=" home-page-nav-list-item">
            <Link to={'/train'} className="button">Тренировка</Link>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default HomePage