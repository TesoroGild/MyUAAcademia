import "./space.css";
import Sidebar from "../sidebar/sidebar";
import { HiPencilAlt, HiEye } from "react-icons/hi";
import { RiGraduationCapFill } from "react-icons/ri";
import profPicture from "../../assets/img/Professor.jpg"; // adapte selon ton asset
 
// Données fictives — à brancher sur ton API
const MOCK_COURSES = [
  {
    sigle: "INF3405",
    name: "Réseaux informatiques",
    group: "Groupe 01",
    students: 28,
    schedule: "Lun. 10h–12h",
    graded: 18,
  },
  {
    sigle: "INF4481",
    name: "Systèmes distribués",
    group: "Groupe 02",
    students: 22,
    schedule: "Mer. 14h–16h",
    graded: 22,
  },
  {
    sigle: "MAT2440",
    name: "Probabilités et statistiques",
    group: "Groupe 01",
    students: 35,
    schedule: "Ven. 8h–10h",
    graded: 0,
  },
];
 
const ProfessorSpace = ({ user }) => {
  const firstName = user?.firstName ?? "Professeur";
 
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
 
      {/* Sidebar */}
      <Sidebar user={user} profilePic={profPicture} />
 
      {/* Main */}
      <main className="flex-1 overflow-y-auto">
 
        {/* Top bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-8 sticky top-0 z-10">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Bonjour, {firstName} 👋
            </p>
            <p className="text-xs text-slate-400">Session Hiver 2025</p>
          </div>
        </div>
 
        <div className="p-8 flex flex-col gap-8">
 
          {/* ── Stats ── */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <span className="text-xs text-slate-400 uppercase tracking-wide font-medium">Cours dispensés</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{MOCK_COURSES.length}</p>
              <span className="text-xs text-slate-400">cette session</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <span className="text-xs text-slate-400 uppercase tracking-wide font-medium">Étudiants encadrés</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {MOCK_COURSES.reduce((acc, c) => acc + c.students, 0)}
              </p>
              <span className="text-xs text-slate-400">tous groupes confondus</span>
            </div>
            <div className="bg-white border border-blue-200 rounded-xl p-5">
              <span className="text-xs text-slate-400 uppercase tracking-wide font-medium">Notes à saisir</span>
              <p className="text-2xl font-bold text-blue-800 mt-1">
                {MOCK_COURSES.reduce((acc, c) => acc + (c.students - c.graded), 0)}
              </p>
              <span className="text-xs text-slate-400">entrées manquantes</span>
            </div>
          </div>
 
          {/* ── Cours ── */}
          <section>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
              Mes cours
            </h2>
            <div className="flex flex-col gap-4">
              {MOCK_COURSES.map((course) => {
                const progress = Math.round((course.graded / course.students) * 100);
                const allGraded = course.graded === course.students;
 
                return (
                  <div
                    key={course.sigle}
                    className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-4"
                  >
                    {/* Header cours */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                          <RiGraduationCapFill className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{course.name}</p>
                          <p className="text-xs text-slate-400">
                            {course.sigle} · {course.group} · {course.schedule}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0">{course.students} étudiants</span>
                    </div>
 
                    {/* Barre de progression notes */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                        <span>Notes saisies</span>
                        <span>{course.graded} / {course.students}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${allGraded ? "bg-green-500" : "bg-blue-700"}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
 
                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <a
                        href={`/professor/grades`}
                        state={{ classeCourse: { courseSigle: course.sigle } }}
                        className="flex items-center gap-1.5 text-xs font-medium bg-blue-800 hover:bg-blue-900 text-white px-3 py-2 rounded-lg transition-colors"
                      >
                        <HiPencilAlt className="w-3.5 h-3.5" />
                        Saisir les notes
                      </a>
                      <a
                        href={`/professor/courses`}
                        className="flex items-center gap-1.5 text-xs font-medium border border-slate-200 hover:border-blue-700 hover:text-blue-800 text-slate-600 px-3 py-2 rounded-lg transition-colors"
                      >
                        <HiEye className="w-3.5 h-3.5" />
                        Voir le cours
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
 
        </div>
      </main>
    </div>
  );
};
 
export default ProfessorSpace;