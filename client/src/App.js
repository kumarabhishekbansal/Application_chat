import React from 'react'
import "./App.css"
import { Route,Routes } from 'react-router-dom'
import Register from './components/Authentication/Register'
import Login from './components/Authentication/Login'
import Navbar from './components/Navbar/Navbar'
import Home from './Pages/Home'
import SideBarUser from './Pages/ChatApp/SideBarUser'
import ChatPage from './Pages/ChatApp/ChatPage'
const App = () => {
  return (
    <>
    <Navbar />
      <Routes>
      <Route exact path='/' element={<Home />} />
        <Route exact path='/register' element={<Register />} />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/chat' element={<ChatPage />} />
      </Routes>
    </>
  )
}

export default App