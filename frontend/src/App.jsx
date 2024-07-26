import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

//Reusable component
import Header from './components/header/header'

//Routes
import Bill from './components/bill/bill'
import Bulletin from './components/bulletin/bulletin'
import Calendar from './components/calendar/calendar'
import Contact from './components/contact/contact'
import Home from './components/home/home'
import Login from './components/login/login'
import Notfound from './components/not-found/notfound'
import Payment from './components/payment/payment'
import Profile from './components/profile/profile'
import Programs from './components/programs/programs'
import Progress from './components/progress/progress'
import Subscribe from './components/subscribe/subscribe'

import { BrowserRouter as Router, Route, Routes, Link, createBrowserRouter } from 'react-router-dom';

const App = () => {
  
  const [userCo, setUserCo] = useState({
    id: "",
    firstName: "",
    lastName: "",
    permanentCode: "",
    sexe: "",
    gender: "",
    email: "",
    userRole: "",
    department: "",
    faculty: "",
    lvlDegree: "",
    phoneNumber: "",
    birthDay: "",
    nas: "",
    program: ""
  });

  const [bill, setBill] = useState({
    dateOfIssue: "",
    deadLine: "",
    dateOfPaiement: "",
    sessionStudy: "",
    yearStudy: ""
});

  return (
      <div>
        <Header userCo = {userCo}/>
        <Routes>
          <Route path="/" element={<Login setUserCo = {setUserCo}/>} />
          <Route path="/bill" element={<Bill userPermanentCode = {userCo.permanentCode}/>} />
          <Route path="/bulletin" element={<Bulletin userCo = {userCo}/>} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login setUserCo = {setUserCo}/>} />
          <Route path="/notfound" element={<Notfound />} />
          <Route path="/payment" element={<Payment bill = {bill} />}/>
          <Route path="/profile" element={<Profile userCo = {userCo} setUserCo = {setUserCo} />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/subscribe" element={<Subscribe />} />
        </Routes>
      </div>
  )
  
}

export default App
