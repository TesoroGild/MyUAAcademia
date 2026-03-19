import { useState, useEffect } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";

// ── Public ────────────────────────────────────────────────────────────────────
import Home             from "./pages/home/home.jsx";
import ProgramsByGrade  from "./pages/program/progs-by-grade/progsbygrade.jsx";
import AdmissionForm    from "./pages/admission/form.jsx";
import AdmissionBill    from "./pages/admission/bill.jsx";
import PaymentAdmission from "./pages/admission/payment.jsx";
import AdmissionVerify  from "./pages/admission/verify.jsx";
import Contact          from "./pages/contact/contact";
import Notfound         from "./pages/not-found/notfound";
import Registration     from "./pages/registration/registration.jsx";
import ChangePassword   from "./pages/employee/change-pwd/changepassword.jsx";

// ── Auth ──────────────────────────────────────────────────────────────────────
import Login            from "./pages/login/login";

// ── Student ───────────────────────────────────────────────────────────────────
import StudentSpace     from "./pages/space/studentspace.jsx";
import Bill             from "./pages/bill/bill";
import Bulletin         from "./pages/bulletin/bulletin";
import Calendar         from "./pages/calendar/calendar";
import PaymentCourse    from "./pages/payment/paymentcourse.jsx";
import Progress         from "./pages/progress/progress";
import Subscribe        from "./pages/subscribe/subscribe";
import StudentDetails   from "./pages/student/details/details.jsx";

// ── Professor ─────────────────────────────────────────────────────────────────
import ProfessorSpace   from "./pages/space/professorspace.jsx";
import AddStudentsNotes from "./pages/professor/add-students-notes/addnotes.jsx";
import ProfessorAcademicPlanning from "./pages/planning/professorplanning.jsx";
import ProfessorCourses from "./pages/professor/courses/courses.jsx";
import ProfessorRooms from "./pages/professor/rooms/rooms.jsx";

// ── Admin ─────────────────────────────────────────────────────────────────────
import AdminSpace       from "./pages/space/adminspace.jsx";
import AdminPlanning    from "./pages/planning/adminplanning.jsx";
import ProgramCreate    from "./pages/employee/program/programcreate.jsx";
import Class            from "./pages/program/class/class.jsx";
import Classroom        from "./pages/program/classroom/classroom.jsx";
import CourseCreate     from "./pages/employee/course/coursecreate.jsx";
import AssignProfessor  from "./pages/employee/add/assignprofessor.jsx";
import EmployeeDetails  from "./pages/employee/details/details.jsx";
import EmployeeCreate   from "./pages/employee/create/employeecreate.jsx";
import EmployeesList    from "./pages/employee/list/employeeslist.jsx";
import Employee         from "./pages/employee/employee.jsx";
import Inscription      from "./pages/student/inscription/inscription.jsx";
import Course           from "./pages/student/course/course.jsx";
import CourseEnrollment from "./pages/student/create/create.jsx";
import StudentList      from "./pages/student/list/list.jsx";
import Student          from "./pages/student/student";
import Program          from "./pages/program/program.jsx";

import { getUserBySessionS } from "./services/auth.service.js";

const App = () => {
  const navigate = useNavigate();

  const [userCo, setUserCo] = useState({
    firstName: "", lastName: "", permanentCode: "", userRole: "",
  });

  const [employeeCo, setEmployeeCo] = useState({
    firstName: "", lastName: "", code: "",
  });

  const [employeeTRC, setEmployeeTRC] = useState({
    firstName: "", lastName: "", code: "",
  });

  useEffect(() => { getUserBySession(); }, []);

  const getUserBySession = async () => {
    try {
      const justLoggedIn = localStorage.getItem("justLoggedIn");
      const userRole     = localStorage.getItem("userRole");
      if (!justLoggedIn) return;

      const response = await getUserBySessionS();

      if (response.success) {
        const role = response.userConnected.userRole?.toLowerCase();

        if (role === "student") {
          setUserCo(response.userConnected);
        } else if (role === "professor") {
          setEmployeeCo(response.userConnected);
          //setUserCo(response.userConnected);
        } else if (role === "admin") {
          setEmployeeCo(response.userConnected);
        }
      } else {
        localStorage.clear();
        const role = userRole?.toLowerCase();
        if (role === "student") navigate("/login/user");
        else navigate("/login/employee");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Routes>

        {/* ── Public ── */}
        <Route path="/"                   element={<Navigate replace to="/home" />} />
        <Route path="/home"               element={<Home />} />
        <Route path="/programs/:grade"    element={<ProgramsByGrade />} />
        <Route path="/admission"          element={<AdmissionForm />} />
        <Route path="/admission/bill"     element={<AdmissionBill />} />
        <Route path="/admission/payment"  element={<PaymentAdmission />} />
        <Route path="/admission/verify"   element={<AdmissionVerify />} />
        <Route path="/contact"            element={<Contact />} />
        <Route path="/registration"       element={<Registration setUserCo={setUserCo} setEmployeeCo={setEmployeeCo} />} />
        <Route path="/employee/resetpwd"  element={<ChangePassword employeeTRC={employeeTRC} />} />
        <Route path="/login/user"         element={<Login type="user"     setUserCo={setUserCo}     setEmployeeCo={setEmployeeCo} />} />
        <Route path="/login/employee"     element={<Login type="employee" setEmployeeCo={setEmployeeCo} setUserCo={setUserCo} />} />

        {/* ── Student ── */}
        <Route path="/studentspace"       element={<StudentSpace userCo={userCo} />} />
        <Route path="/bill/courses"       element={<Bill userCo={userCo} userPermanentCode={userCo.permanentCode} />} />
        <Route path="/bulletin"           element={<Bulletin userCo={userCo} />} />
        <Route path="/calendar"           element={<Calendar userCo={userCo} />} />
        <Route path="/payment/courses"    element={<PaymentCourse userCo={userCo} />} />
        <Route path="/progress"           element={<Progress userCo={userCo} />} />
        <Route path="/subscribe"          element={<Subscribe userCo={userCo} />} />
        <Route path="/student/:permanentcode" element={<StudentDetails userCo={userCo} />} />

        {/* ── Professor ── */}
        <Route path="/professorspace"     element={<ProfessorSpace   employeeCo={employeeCo} />} />
        <Route path="/professor/grades"   element={<AddStudentsNotes employeeCo={employeeCo} />} />
        <Route path="/professorplanning"  element={<ProfessorAcademicPlanning   employeeCo={employeeCo} />} />
        <Route path="/professor/courses" element={<ProfessorCourses employeeCo={employeeCo} />} />
        <Route path="/professor/rooms"   element={<ProfessorRooms   employeeCo={employeeCo} />} />

        {/* ── Admin ── */}
        <Route path="/adminspace"                     element={<AdminSpace      employeeCo={employeeCo} />} />
        <Route path="/adminplanning"                  element={<AdminPlanning   employeeCo={employeeCo} />} />
        <Route path="/program"                        element={<Program         employeeCo={employeeCo} />} />
        <Route path="/employee/program/program"       element={<ProgramCreate   employeeCo={employeeCo} />} />
        <Route path="/employee/program/class"         element={<Class           employeeCo={employeeCo} />} />
        <Route path="/employee/program/classroom"     element={<Classroom       employeeCo={employeeCo} />} />
        <Route path="/employee/program/course"        element={<CourseCreate    employeeCo={employeeCo} />} />
        <Route path="/employee/employee/assign-course" element={<AssignProfessor employeeCo={employeeCo} />} />
        <Route path="/employee/employees"             element={<Employee        employeeCo={employeeCo} />} />
        <Route path="/employee/employee/create"       element={<EmployeeCreate  employeeCo={employeeCo} />} />
        <Route path="/employee/employee/list"         element={<EmployeesList   employeeCo={employeeCo} />} />
        <Route path="/employee/:usercode"             element={<EmployeeDetails employeeCo={employeeCo} />} />
        <Route path="/employee/students"              element={<Student         employeeCo={employeeCo} />} />
        <Route path="/employee/student/list"          element={<StudentList     employeeCo={employeeCo} />} />
        <Route path="/employee/student/create"        element={<CourseEnrollment employeeCo={employeeCo} />} />
        <Route path="/employee/student/course"        element={<Course          employeeCo={employeeCo} />} />
        <Route path="/employee/student/inscription"   element={<Inscription     employeeCo={employeeCo} />} />

        {/* ── Fallback ── */}
        <Route path="/notfound" element={<Notfound />} />
        <Route path="*"         element={<Navigate replace to="/notfound" />} />

      </Routes>
    </div>
  );
};

export default App;