import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './App.css'

//Routes
import Home from './pages/home/home.jsx'
import AdmissionForm from './pages/admission/form.jsx'
import PaymentAdmission from './pages/admission/payment.jsx'
import AdmissionVerify from './pages/admission/verify.jsx';
import ProgramsByGrade from './pages/program/progs-by-grade/progsbygrade.jsx'

//Student pages
import StudentSpace from './pages/space/studentspace.jsx';
import Bill from './pages/bill/bill'
import Bulletin from './pages/bulletin/bulletin'
import Calendar from './pages/calendar/calendar'
import Contact from './pages/contact/contact'
import Login from './pages/login/login'
import Notfound from './pages/not-found/notfound'
import PaymentCourse from './pages/payment/paymentcourse.jsx'
import Planning from './pages/planning/planning'
import Progress from './pages/progress/progress'
import UserSpace from './pages/space/studentspace.jsx'
import Subscribe from './pages/subscribe/subscribe'

//Admin pages
import AdminSpace from './pages/space/adminspace.jsx'
import AdminPlanning from './pages/planning/adminplanning.jsx'
import Class from './pages/program/class/class.jsx'
import Classroom from './pages/program/classroom/classroom.jsx'
import Course from './pages/student/course/course.jsx'
import Create from './pages/student/create/create.jsx'
import StudentDetails from './pages/student/details/details.jsx'
import EmployeeDetails from './pages/employee/details/details.jsx'
import StudentList from './pages/student/list/list.jsx'
import Inscription from './pages/student/inscription/inscription.jsx'
import Message from './pages/message/message.jsx'
import Program from './pages/program/program.jsx'
import Registration from './pages/registration/registration.jsx'
import Student from './pages/student/student'

import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import AdmissionBill from './pages/admission/bill.jsx'
import EmployeeLogin from './pages/login/employeelogin.jsx'
import Employee from './pages/employee/employee.jsx'
import EmployeeCreate from './pages/employee/add/employeecreate.jsx'
import EmployeesList from './pages/employee/list/employeeslist.jsx'
import ProgramCreate from './pages/employee/program/programcreate.jsx'
import CourseCreate from './pages/employee/course/coursecreate.jsx'
import ChangePassword from './pages/employee/change-pwd/changepassword.jsx'
import { getUserBySessionS } from './services/auth.service.js';

const App = () => {
  //States
  useEffect(() => {
    getUserBySession();
  }, [])
  const navigate = useNavigate();

  //Moedls
  const [userCo, setUserCo] = useState({
    firstName: "",
    lastName: "",
    permanentCode: "",
    userRole: ""
  });

  const [employeeCo, setEmployeeCo] = useState({
    firstName: "",
    lastName: "",
    code: ""
  });

  const [employeeTRC, setEmployeeTRC] = useState({
    firstName: "",
    lastName: "",
    code: ""
  });

  //Functions
  const getUserBySession = async () => {
    try {
      const justLoggedIn = localStorage.getItem('justLoggedIn');
      const userRole = localStorage.getItem('userRole');
      if (justLoggedIn != null) {
        const response = await getUserBySessionS();
  
        if (response.success) {
          if (response.userConnected.userRole === "student") {
            setUserCo(response.userConnected);
          }
          if (response.userConnected.userRole === "employee") {
            setEmployeeCo(response.userConnected);
            //navigate('/employeespace');
          }
          if (response.userConnected.userRole === "Admin") {
            setEmployeeCo(response.userConnected);
            //navigate('/adminspace');
          }
        } else {
          console.log(response.message);
          localStorage.clear();
          if (userRole === "student" || userRole === "professor") navigate('/login/user');
          else navigate('/login/employee');
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
      <div>
        <Routes>
          
          <Route path="/" element={<Navigate replace to="/home"/>} />
          <Route path="/admission" element={<AdmissionForm />} />
          {/*<Route path="/admission" element={<AdmissionForm setUserCo = {setUserCo} setEmployeeCo = {setEmployeeCo}/>} />*/}
          <Route path="/admission/bill" element={<AdmissionBill />} />
          <Route path="/home" element={<Home />} />
          {/*<Route path="/home" element={<Home setUserCo = {setUserCo} setEmployeeCo = {setEmployeeCo}/>} />*/}
          <Route path="/login/employee" element={<EmployeeLogin setEmployeeCo = {setEmployeeCo} setUserCo = {setUserCo}/>} />
          <Route path="/admission/payment" element={<PaymentAdmission />} />
          <Route path='/admission/verify' element={<AdmissionVerify />} />

          {/*Student routes*/}
          <Route path="/bill/courses" element={<Bill userCo= {userCo} userPermanentCode = {userCo.permanentCode}/>} />
          <Route path="/bulletin" element={<Bulletin userCo = {userCo}/>} />
          <Route path="/calendar" element={<Calendar userCo= {userCo}/>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/userspace" element={<UserSpace userCo = {userCo} />} />
          <Route path="/login/user" element={<Login setUserCo = {setUserCo} />} />
          <Route path="/payment/courses" element={<PaymentCourse userCo = {userCo} />}/>
          <Route path="/planning" element={<Planning userCo = {userCo} />} />
          <Route path="/progress" element={<Progress userCo = {userCo} />} />
          <Route path="/subscribe" element={<Subscribe userCo = {userCo}/>} />
          <Route path='/studentspace' element={<StudentSpace userCo = {userCo} />}/>

          {/*Admin routes*/}
          <Route path='/employee/resetpwd' element={<ChangePassword employeeTRC = {employeeTRC} />}></Route>
          <Route path='/adminspace' element={<AdminSpace employeeCo = {employeeCo} />} />
          <Route path="/adminplanning" element={<AdminPlanning employeeCo = {employeeCo} />} />
          <Route path="/message" element={<Message employeeCo = {employeeCo} />} />
          <Route path='/program' element={<Program employeeCo = {employeeCo} />} />
          <Route path='/programs/:grade' element={<ProgramsByGrade />}></Route>
            <Route path='/employee/program/class' element={<Class employeeCo = {employeeCo} />} />
            <Route path='/employee/program/classroom' element={<Classroom employeeCo= {employeeCo}  />} />
          <Route path="/registration" element={<Registration setUserCo = {setUserCo} setEmployeeCo = {setEmployeeCo}/>} />
          {/**<Route path="/registration" element={<Home setUserCo = {setUserCo} setEmployeeCo = {setEmployeeCo}/>} /> */}
          <Route path="/employee/program/program" element={<ProgramCreate employeeCo = {employeeCo}/>} />
          <Route path='/employee/program/course' element={<CourseCreate employeeCo = {employeeCo} />} />
          <Route path='/employee/employees' element={<Employee employeeCo = {employeeCo} />} />
          <Route path='/employee/employee/create' element={<EmployeeCreate employeeCo = {employeeCo} />} />
          <Route path='/employee/employee/list' element={<EmployeesList employeeCo = {employeeCo} />} />
          <Route path='/employee/:usercode' element={<EmployeeDetails employeeCo = {employeeCo} />} />
          
          <Route path='/employee/students' element={<Student employeeCo = {employeeCo} />} />
            <Route path='/student/:permanentcode' element={<StudentDetails userCo = {userCo} />} />
            <Route path='/employee/student/course' element={<Course employeeCo = {employeeCo} />} />
            <Route path='/employee/student/create' element={<Create employeeCo = {employeeCo} />} />
            <Route path='/employee/student/list' element={<StudentList employeeCo = {employeeCo} />} />
            <Route path='/employee/student/inscription' element={<Inscription employeeCo = {employeeCo} />} /> 

            <Route path="/notfound" element={<Notfound />} /> 
            <Route path="*" element={<Navigate replace to="/notfound" />} />
        </Routes>
      </div>
  )
  
}

export default App
