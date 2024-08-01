import React from 'react'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import TestPage from './pages/TestPage';
import TrainPage from './pages/TrainPage';
import QuestionPage from './pages/QuestionPage';
import ResultPage from './pages/ResultPage';
import PraktPage from './pages/PraktPage';
import PraktResultPage from './pages/PraktResultPage';
import './App.css';
import './styles/main.css'

const App = () => {
    const router = createBrowserRouter(
    createRoutesFromElements(
    <>
      <Route index element={ <HomePage /> }></Route>
      <Route path='/admin' element={ <AdminPage /> }></Route>
      <Route path='/test' element={ <TestPage/> }></Route>
      <Route path='/train' element={ <TrainPage /> }></Route>
      <Route path='/result' element={ <ResultPage /> }></Route>
      <Route path='/praktresult' element={ <PraktResultPage /> }></Route>
      <Route path='/prakt/:number' element={ <PraktPage /> }></Route>
      <Route path='/question/:number' element={ <QuestionPage /> }></Route>
    </>
  ));

  return (
    <RouterProvider router={router} />
  )
}

export default App