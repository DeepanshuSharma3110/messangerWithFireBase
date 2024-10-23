import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './component/Login/Login';
import Register from './component/Register/Register';
import Home from './pages/Home/Home';
import NavBar from './component/NavBar/NavBar';
import './App.module.css'
import Messanger from './pages/Messanger/Messanger';
import UpdatePicture from './pages/Upload Profile Pic/UpdatePicture';
const App = () => {
  return (
    <BrowserRouter>
    <NavBar />
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/messenger' element={<Messanger />}/>
      <Route path='/update-profile-pic' element={<UpdatePicture />}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
