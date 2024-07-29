import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

//Reusable component
import Header from './components/header/header'

//Routes
//Student components
import Bill from './components/bill/bill'
import Bulletin from './components/bulletin/bulletin'
import Calendar from './components/calendar/calendar'
import Contact from './components/contact/contact'
import Home from './components/home/home'
import Login from './components/login/login'
import Notfound from './components/not-found/notfound'
import Payment from './components/payment/payment'
import Profile from './components/profile/profile'
import Planning from './components/planning/planning'
import Progress from './components/progress/progress'
import Subscribe from './components/subscribe/subscribe'

//Admin components
import AdminHome from './components/home/adminhome'
import AdminProfile from './components/profile/adminprofile'
import AdminPlanning from './components/planning/adminplanning.jsx'
import Class from './components/program/class/class.jsx'
import Classroom from './components/program/classroom/classroom.jsx'
import Course from './components/student/course/course.jsx'
import Create from './components/student/create/create.jsx'
import Files from './components/student/files/files.jsx'
import Inscription from './components/student/inscription/inscription.jsx'
import Message from './components/message/message.jsx'
import Program from './components/program/program.jsx'
import Student from './components/student/student'

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
        <Routes>
          {/*Student routes*/}
          <Route path="/" element={<Login setUserCo = {setUserCo}/>} />
          <Route path="/bill" element={<Bill userCo= {userCo} userPermanentCode = {userCo.permanentCode}/>} />
          <Route path="/bulletin" element={<Bulletin userCo = {userCo}/>} />
          <Route path="/calendar" element={<Calendar userCo= {userCo}/>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/home" element={<Home userCo = {userCo} />} />
          <Route path="/login" element={<Login setUserCo = {setUserCo}/>} />
          <Route path="/notfound" element={<Notfound />} />
          <Route path="/payment" element={<Payment bill = {bill} />}/>
          <Route path="/profile" element={<Profile userCo = {userCo} setUserCo = {setUserCo} />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/subscribe" element={<Subscribe userCo = {userCo}/>} />

          {/*Admin routes*/}
          <Route path='/adminhome' element={<AdminHome userCo = {userCo} />} />
          <Route path='/adminprofile' element={<AdminProfile userCo = {userCo} setUserCo = {setUserCo} />} />
          <Route path="/adminplanning" element={<AdminPlanning />} />
          <Route path="/message" element={<Message />} />
          <Route path='/program' element={<Program />} />
            <Route path='/program/class' element={<Class />} />
            <Route path='/program/classroom' element={<Classroom />} />
          <Route path='/student' element={<Student />} />
            <Route path='/student/course' element={<Course />} />
            <Route path='/student/create' element={<Create />} />
            <Route path='/student/files' element={<Files />} />
            <Route path='/student/Inscription' element={<Inscription />} />
            
        </Routes>
      </div>
  )
  
}

export default App
