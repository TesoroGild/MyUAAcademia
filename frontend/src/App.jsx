import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

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
import Details from './components/student/details/details.jsx'
import Files from './components/student/files/files.jsx'
import Inscription from './components/student/inscription/inscription.jsx'
import Message from './components/message/message.jsx'
import Program from './components/program/program.jsx'
import Student from './components/student/student'

import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

const App = () => {
  
  const [userCo, setUserCo] = useState({
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

  const [employeeCo, setEmployeeCo] = useState({
    firstName: "",
    lastName: "",
    code: "",
    sexe: "",
    gender: "",
    email: "",
    userRole: "",
    department: "",
    faculty: "",
    job: "",
    phoneNumber: "",
    birthDay: "",
    nas: ""
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
          <Route path="/" element={<Login setUserCo = {setUserCo} setEmployeeCo = {setEmployeeCo}/>} />
          <Route path="/bill" element={<Bill userCo= {userCo} userPermanentCode = {userCo.permanentCode}/>} />
          <Route path="/bulletin" element={<Bulletin userCo = {userCo}/>} />
          <Route path="/calendar" element={<Calendar userCo= {userCo}/>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/home" element={<Home userCo = {userCo} />} />
          <Route path="/login" element={<Login setUserCo = {setUserCo} setEmployeeCo = {setEmployeeCo}/>} />
          <Route path="/payment" element={<Payment bill = {bill} />}/>
          <Route path="/profile" element={<Profile userCo = {userCo} setUserCo = {setUserCo} />} />
          <Route path="/planning" element={<Planning userCo = {userCo} />} />
          <Route path="/progress" element={<Progress userCo = {userCo} />} />
          <Route path="/subscribe" element={<Subscribe userCo = {userCo}/>} />

          {/*Admin routes*/}
          <Route path='/adminhome' element={<AdminHome employeeCo = {employeeCo} />} />
          <Route path='/adminprofile' element={<AdminProfile employeeCo = {employeeCo} setEmployeeCo = {setEmployeeCo} />} />
          <Route path="/adminplanning" element={<AdminPlanning employeeCo = {employeeCo} />} />
          <Route path="/message" element={<Message employeeCo = {employeeCo} />} />
          <Route path='/program' element={<Program employeeCo = {employeeCo} />} />
            <Route path='/program/class' element={<Class employeeCo = {employeeCo} />} />
            <Route path='/program/classroom' element={<Classroom employeeCo= {employeeCo}  />} />
          <Route path='/student' element={<Student employeeCo = {employeeCo} />} />
            <Route path="/students/:permanentcode" element={<Details employeeCo = {employeeCo} />} />
            <Route path='/student/course' element={<Course employeeCo = {employeeCo} />} />
            <Route path='/student/create' element={<Create employeeCo = {employeeCo} />} />
            <Route path='/student/files' element={<Files employeeCo = {employeeCo} />} />
            <Route path='/student/Inscription' element={<Inscription employeeCo = {employeeCo} />} /> 

            <Route path="/notfound" element={<Notfound />} /> 
            <Route path="*" element={<Navigate replace to="/notfound" />} />
        </Routes>
      </div>
  )
  
}

export default App
