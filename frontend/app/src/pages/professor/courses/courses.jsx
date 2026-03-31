import Sidebar from "../../sidebar/sidebar";
import profPicture from "../../../assets/img/Professor.jpg";
import { useEffect, useState } from "react";
import { HiChevronRight, HiArrowLeft, HiAcademicCap, HiUserGroup, HiSearch, HiX } from "react-icons/hi";
import { RiGraduationCapFill } from "react-icons/ri";
import { getProfCourseS } from "../../../services/course.service";
import { getStudentsInProgramS } from "../../../services/user.service";

// ── Helpers ───────────────────────────────────────────────────────────────────
const GRADE_BADGE = {
  "Certificat":   "bg-slate-100 text-slate-600 border-slate-200",
  "BTS":          "bg-teal-50 text-teal-700 border-teal-100",
  "Baccalauréat": "bg-blue-50 text-blue-700 border-blue-100",
  "Master":       "bg-violet-50 text-violet-700 border-violet-100",
  "Doctorat":     "bg-amber-50 text-amber-700 border-amber-100",
};

// Fil d'Ariane
const Breadcrumb = ({ items, onNavigate }) => (
  <div className="flex items-center gap-1.5 text-xs text-slate-400 flex-wrap">
    {items.map((item, i) => (
      <span key={i} className="flex items-center gap-1.5">
        {i > 0 && <HiChevronRight className="w-3 h-3 shrink-0" />}
        {i < items.length - 1 ? (
          <button onClick={() => onNavigate(i)} className="hover:text-blue-700 transition-colors">{item}</button>
        ) : (
          <span className="text-slate-700 font-medium">{item}</span>
        )}
      </span>
    ))}
  </div>
);

// ── Page principale ───────────────────────────────────────────────────────────
const ProfessorCourses = ({ user }) => {
  // "grade" | "program" | "courses" | "students"
  const [view, setView]                   = useState("grade");
  const [allCourses, setAllCourses]       = useState([]);   // tous les cours assignés au prof
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedCourse, setSelectedCourse]   = useState(null);
  const [students, setStudents]           = useState([]);
  const [searchStudent, setSearchStudent] = useState("");
  const [isLoading, setIsLoading]         = useState(false);

  useEffect(() => { loadCourses(); }, []);

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      const res = await getProfCourseS(user.code);
      setAllCourses(res.courses);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const loadStudents = async (programTitle) => {
    setIsLoading(true);
    try {
      const res  = await getStudentsInProgramS(programTitle);
      const list = Array.isArray(res) ? res : res?.students ?? res?.data ?? [];
      setStudents(list);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  // Données dérivées
  const grades   = [...new Set(allCourses.map((c) => c.grade ?? c.programGrade).filter(Boolean))];
  const programs = [...new Set(
    allCourses
      .filter((c) => (c.grade ?? c.programGrade) === selectedGrade)
      .map((c) => c.programTitle)
      .filter(Boolean)
  )];
  const courses  = allCourses.filter((c) => c.programTitle === selectedProgram);

  const filteredStudents = students.filter((s) =>
    !searchStudent ||
    s.permanentCode?.toUpperCase().includes(searchStudent.toUpperCase()) ||
    s.lastName?.toUpperCase().includes(searchStudent.toUpperCase())      ||
    s.firstName?.toUpperCase().includes(searchStudent.toUpperCase())
  );

  // Navigation
  const goTo = (v) => setView(v);

  const selectGrade = (grade) => {
    setSelectedGrade(grade);
    setSelectedProgram(null);
    setSelectedCourse(null);
    goTo("program");
  };

  const selectProgram = (prog) => {
    setSelectedProgram(prog);
    setSelectedCourse(null);
    goTo("courses");
  };

  const selectCourse = async (course) => {
    setSelectedCourse(course);
    setSearchStudent("");
    await loadStudents(course.id);
    goTo("students");
  };

  const navigateBreadcrumb = (idx) => {
    if (idx === 0) { setView("grade"); setSelectedGrade(null); setSelectedProgram(null); setSelectedCourse(null); }
    if (idx === 1) { setView("program"); setSelectedProgram(null); setSelectedCourse(null); }
    if (idx === 2) { setView("courses"); setSelectedCourse(null); }
  };

  const breadcrumbs = ["Mes cours"];
  if (selectedGrade)   breadcrumbs.push(selectedGrade);
  if (selectedProgram) breadcrumbs.push(selectedProgram);
  if (selectedCourse)  breadcrumbs.push(selectedCourse.courseSigle);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar user={user} profilePic={profPicture} />

      <main className="flex-1 overflow-y-auto">

        {/* Top bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {view !== "grade" && (
              <button
                onClick={() => navigateBreadcrumb(breadcrumbs.length - 2)}
                className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-700 hover:text-blue-800 text-slate-500 transition-colors"
              >
                <HiArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <p className="text-sm font-semibold text-slate-900">Mes cours</p>
              <Breadcrumb items={breadcrumbs} onNavigate={navigateBreadcrumb} />
            </div>
          </div>
          <div className="text-xs text-slate-400">
            {allCourses.length} cours assigné{allCourses.length > 1 ? "s" : ""}
          </div>
        </div>

        <div className="p-8 max-w-5xl">

          {isLoading && <p className="text-sm text-slate-400">Chargement...</p>}

          {/* ── Vue 1 : Niveaux ── */}
          {!isLoading && view === "grade" && (
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Sélectionnez un niveau d'études
              </p>
              {grades.length === 0 ? (
                <p className="text-sm text-slate-400">Aucun cours assigné pour le moment.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {grades.map((grade) => {
                    const count = [...new Set(allCourses.filter((c) => (c.grade ?? c.programGrade) === grade).map((c) => c.programTitle))].length;
                    return (
                      <button
                        key={grade}
                        onClick={() => selectGrade(grade)}
                        className="group bg-white border border-slate-200 hover:border-blue-700 rounded-xl p-6 text-left transition-all hover:shadow-md"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 group-hover:bg-blue-800 group-hover:text-white group-hover:border-blue-800 transition-colors">
                            <HiAcademicCap className="w-5 h-5" />
                          </div>
                          <span className={`text-xs font-semibold border px-2 py-0.5 rounded-full ${GRADE_BADGE[grade] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                            {grade}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-800 transition-colors">{grade}</p>
                        <p className="text-xs text-slate-400 mt-1">{count} programme{count > 1 ? "s" : ""}</p>
                        <div className="mt-4 flex items-center gap-1 text-blue-700 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Voir les programmes <HiChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Vue 2 : Programmes ── */}
          {!isLoading && view === "program" && (
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Programmes en {selectedGrade}
              </p>
              <div className="flex flex-col gap-3">
                {programs.map((prog) => {
                  const progCourses = allCourses.filter((c) => c.programTitle === prog);
                  return (
                    <button
                      key={prog}
                      onClick={() => selectProgram(prog)}
                      className="group bg-white border border-slate-200 hover:border-blue-700 rounded-xl px-6 py-5 text-left flex items-center justify-between gap-4 transition-all hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 group-hover:bg-blue-800 group-hover:text-white transition-colors shrink-0">
                          <RiGraduationCapFill className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-800 transition-colors">{prog}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{progCourses.length} cours</p>
                        </div>
                      </div>
                      <HiChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-700 transition-colors shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Vue 3 : Cours du programme ── */}
          {!isLoading && view === "courses" && (
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Cours dispensés — {selectedProgram}
              </p>
              <div className="flex flex-col gap-3">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => selectCourse(course)}
                    className="group bg-white border border-slate-200 hover:border-blue-700 rounded-xl px-6 py-5 text-left transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 group-hover:bg-blue-800 group-hover:text-white transition-colors shrink-0 mt-0.5">
                          <RiGraduationCapFill className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-slate-700">{course.courseSigle}</span>
                            <span className="text-xs text-slate-400">{course.sessionCourse} {course.yearCourse}</span>
                          </div>
                          <p className="text-sm font-medium text-slate-700 mt-0.5 group-hover:text-blue-800 transition-colors">{course.fullName}</p>
                          <p className="text-xs text-slate-400 mt-1">{course.classeName} · {course.jours} · {course.startTime}–{course.endTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <HiUserGroup className="w-3.5 h-3.5" />
                          Voir les étudiants
                        </span>
                        <HiChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-700 transition-colors" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Vue 4 : Étudiants du cours ── */}
          {!isLoading && view === "students" && (
            <div className="flex flex-col gap-4">
              {/* Récap du cours */}
              <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-800 flex items-center justify-center shrink-0">
                  <RiGraduationCapFill className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700">{selectedCourse?.courseSigle}</span>
                    <span className="text-xs text-slate-400">{selectedCourse?.sessionCourse} {selectedCourse?.yearCourse}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedCourse?.classeName} · {selectedCourse?.jours} · {selectedCourse?.startTime}–{selectedCourse?.endTime}</p>
                </div>
                <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full shrink-0">
                  {students.length} étudiant{students.length > 1 ? "s" : ""}
                </span>
              </div>

              {/* Recherche */}
              <div className="relative max-w-sm">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  placeholder="Rechercher un étudiant..."
                  className="w-full pl-9 pr-8 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
                />
                {searchStudent && (
                  <button onClick={() => setSearchStudent("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                    <HiX className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Table étudiants */}
              {filteredStudents.length === 0 ? (
                <p className="text-sm text-slate-400">Aucun étudiant trouvé.</p>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        {["Code permanent", "Nom", "Prénom", "Email"].map((h) => (
                          <th key={h} className="text-left py-3 px-5 text-xs text-slate-400 font-medium uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((s, i) => (
                        <tr key={s.permanentCode} className={`border-b border-slate-50 last:border-0 ${i % 2 === 1 ? "bg-slate-50/40" : ""}`}>
                          <td className="py-3 px-5 font-mono text-xs font-bold text-slate-700">{s.permanentCode}</td>
                          <td className="py-3 px-5 font-medium text-slate-900">{s.lastName}</td>
                          <td className="py-3 px-5 text-slate-700">{s.firstName}</td>
                          <td className="py-3 px-5 text-slate-500 text-xs">{s.personalEmail ?? s.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default ProfessorCourses;