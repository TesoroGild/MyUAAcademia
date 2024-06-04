import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './components/home/home'
import Login from './components/login/login'
import Bill from './components/bill/bill'
import { BrowserRouter as Router, Route, Routes, Link, createBrowserRouter } from 'react-router-dom';
import Header from './components/header/header'
import Notfound from './components/not-found/notfound'
import Programs from './components/programs/programs'
import Contact from './components/contact/contact'

const App = () => {
  //const [count, setCount] = useState(0)

  return (
      <div>
        <Header/>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bill" element={<Bill />} />
          <Route path="/home" element={<Home />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/notfound" element={<Notfound />} />
        </Routes>
      </div>
  )
  
}

export default App
