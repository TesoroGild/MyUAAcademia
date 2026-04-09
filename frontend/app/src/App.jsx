import { useState, useEffect } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// ── Public ────────────────────────────────────────────────────────────────────
import Home             from "./pages/home/home.jsx";
import ProgramsByGrade  from "./pages/program/progs-by-grade/progsbygrade.jsx";
import AdmissionForm    from "./pages/admission/form.jsx";
import AdmissionBill    from "./pages/admission/bill.jsx";
import PaymentAdmission from "./pages/admission/payment.jsx";
import AdmissionVerify  from "./pages/admission/verify.jsx";
import Contact          from "./pages/contact/contact";
import Notfound         from "./pages/specials/notfound.jsx";
import ResetPassword   from "./pages/change-pwd/resetpassword.jsx";
import Forbidden from "./pages/specials/forbidden.jsx";

// ── Auth ──────────────────────────────────────────────────────────────────────
import Login            from "./pages/login/login";

// ── Student ───────────────────────────────────────────────────────────────────
import StudentSpace     from "./pages/space/studentspace.jsx";
import Bill             from "./pages/bill/bill";
import Bulletin         from "./pages/bulletin/bulletin";
import StudentPlanning  from "./pages/planning/studentplanning.jsx";
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
import Inscription      from "./pages/student/inscription/inscription.jsx";
import Course           from "./pages/student/course/course.jsx";
import CourseEnrollment from "./pages/student/create/create.jsx";
import StudentList      from "./pages/student/list/list.jsx";
import ContractCreate   from "./pages/employee/contract/contract.jsx";

import { getUserBySessionS } from "./services/auth.service.js";

const App = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => { getUserBySession(); }, []);

  const getUserBySession = async () => {
    try {
      const justLoggedIn = localStorage.getItem("justLoggedIn");
      const userRole     = localStorage.getItem("userRole");
      const stored = localStorage.getItem("user");
      if (!justLoggedIn) return;

      if (stored) {
        setUser(JSON.parse(stored));
        return;
      } else {
        const response = await getUserBySessionS();
  
        if (response.success) {
          setUser(response.userConnected);
          localStorage.setItem("user", JSON.stringify(response.userConnected));
        } else {
          localStorage.clear();
          const role = userRole?.toLowerCase();
          if (role === "student") navigate("/login/user");
          else navigate("/login/employee");
        }
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
        <Route path="/login/user"         element={<Login type="student" setUser={setUser} />} />
        <Route path="/login/employee"     element={<Login type="employee" setUser={setUser} />} />
        <Route path="/forbidden"          element={<Forbidden />} />

        {/* ── Users ── */}
        <Route path="/resetpwd"  element={<ResetPassword user={user} />} />

        {/* ── Student & Admin ── */}
        <Route element={<ProtectedRoute 
            allowedRoles={["admin", "student", "director"]}
            redirectPath="/login/user"
          />} 
        >
          <Route path="/student/:permanentcode" element={<StudentDetails user={user} />} />
        </Route>

        {/* ── Student ── */}
        <Route element={<ProtectedRoute 
            allowedRoles={["student"]}
            redirectPath="/login/user"
          />} 
        >
          <Route path="/studentspace"           element={<StudentSpace user={user} />} />
          <Route path="/bill/courses"           element={<Bill user={user} />} />
          <Route path="/bulletin"               element={<Bulletin user={user} />} />
          <Route path="/StudentPlanning"               element={<StudentPlanning user={user} />} />
          <Route path="/payment/courses"        element={<PaymentCourse user={user} />} />
          <Route path="/progress"               element={<Progress user={user} />} />
          <Route path="/subscribe"              element={<Subscribe user={user} />} />
        </Route>

        {/* ── Employees ── */}
        <Route element={<ProtectedRoute 
            allowedRoles={["admin", "director", "professor"]}
            redirectPath="/login/employee"
          />} 
        >
          <Route path="/employee/:usercode"             element={<EmployeeDetails user={user} />} />
        </Route>

        {/* ── Professor ── */}
        <Route element={<ProtectedRoute 
            allowedRoles={["professor"]}
            redirectPath="/login/employee"
          />} 
        >
          <Route path="/professorspace"     element={<ProfessorSpace   user={user} />} />
          <Route path="/professor/grades"   element={<AddStudentsNotes user={user} />} />
          <Route path="/professorplanning"  element={<ProfessorAcademicPlanning   user={user} />} />
          <Route path="/professor/courses"  element={<ProfessorCourses user={user} />} />
          <Route path="/professor/rooms"    element={<ProfessorRooms   user={user} />} />
        </Route>

        {/* ── Admin ── */}
        <Route element={<ProtectedRoute 
            allowedRoles={["admin", "director"]}
            redirectPath="/login/employee"
          />} 
        >
          <Route path="/adminspace"                     element={<AdminSpace      user={user} />} />
          <Route path="/adminplanning"                  element={<AdminPlanning   user={user} />} />
          <Route path="/employee/program/program"       element={<ProgramCreate   user={user} />} />
          <Route path="/employee/program/class"         element={<Class           user={user} />} />
          <Route path="/employee/program/classroom"     element={<Classroom       user={user} />} />
          <Route path="/employee/program/course"        element={<CourseCreate    user={user} />} />
          <Route path="/employee/employee/assign-course" element={<AssignProfessor user={user} />} />
          <Route path="/employee/employee/create"       element={<EmployeeCreate  user={user} />} />
          <Route path="/employee/employee/list"         element={<EmployeesList   user={user} />} />
          <Route path="/employee/student/list"          element={<StudentList     user={user} />} />
          <Route path="/employee/student/create"        element={<CourseEnrollment user={user} />} />
          <Route path="/employee/student/course"        element={<Course          user={user} />} />
          <Route path="/employee/student/inscription"   element={<Inscription     user={user} />} />
          <Route path="/employee/contracts"             element={<ContractCreate user={user} />} />
        </Route>

        {/* ── Fallback ── */}
        <Route path="/notfound" element={<Notfound />} />
        <Route path="*"         element={<Navigate replace to="/notfound" />} />

      </Routes>
    </div>
  );
};

export default App;