import Sidebar from "../../sidebar/sidebar";
import adminPicture from "../../../assets/img/Admin.jpg";
import React, { useEffect, useState } from "react";
import { HiCheck, HiExclamation, HiX, HiSearch, HiPlus } from "react-icons/hi";
import { getProgramStudentsS } from "../../../services/user.service";
import { enrollStudentsInCoursesS, getProgramSessionCoursesS } from "../../../services/course.service";
import { getProgramsS } from "../../../services/program.service";

const GRADE_BADGE = {
  "Certificat":   "bg-slate-100 text-slate-600 border-slate-200",
  "BTS":          "bg-teal-50 text-teal-700 border-teal-100",
  "Baccalauréat": "bg-blue-50 text-blue-700 border-blue-100",
  "Master":       "bg-violet-50 text-violet-700 border-violet-100",
  "Doctorat":     "bg-amber-50 text-amber-700 border-amber-100",
};

const Alert = ({ type, message }) => {
  const s = { success: "bg-green-50 border-green-200 text-green-700", error: "bg-red-50 border-red-200 text-red-700", warning: "bg-amber-50 border-amber-200 text-amber-700" }[type];
  const Icon = type === "success" ? HiCheck : type === "warning" ? HiExclamation : HiX;
  return (
    <div className={`flex items-center gap-2 border rounded-xl px-4 py-3 text-sm ${s}`}>
      <Icon className="w-4 h-4 shrink-0" />{message}
    </div>
  );
};

const CourseEnrollment = ({ employeeCo }) => {
  const [programs, setPrograms]                     = useState([]);
  const [students, setStudents]                     = useState([]);
  const [filteredStudents, setFilteredStudents]     = useState([]);
  const [classesCourses, setClassesCourses]         = useState([]);
  const [filteredCourses, setFilteredCourses]       = useState([]);
  const [searchStudent, setSearchStudent]           = useState("");
  const [searchCourse, setSearchCourse]             = useState("");
  const [sessionCourse, setSessionCourse]           = useState("");
  const [programTitle, setProgramTitle]             = useState("");
  const [selectedStudents, setSelectedStudents]     = useState([]);
  const [selectedCourses, setSelectedCourses]       = useState([]);
  const [alert, setAlert]                           = useState(null);
  const [isLoading, setIsLoading]                   = useState(false);
  const [programGradeFilter, setProgramGradeFilter] = useState("");
  const [programSearch, setProgramSearch]           = useState("");

  useEffect(() => { getPrograms(); }, []);

  useEffect(() => {
    if (sessionCourse && programTitle) getProgramSessionCourses();
  }, [sessionCourse, programTitle]);

  const showAlert = (type, message) => { setAlert({ type, message }); setTimeout(() => setAlert(null), 5000); };

  const getPrograms = async () => { try { setPrograms(await getProgramsS()); } catch (e) { console.error(e); } };

  const getProgramSessionCourses = async () => {
    try {
        const res     = await getProgramSessionCoursesS({ programTitle, sessionCourse });
        const courses = Array.isArray(res) ? res : res?.courses ?? res?.data ?? [];
        setClassesCourses(courses);
        setFilteredCourses(courses);
    } catch (e) { console.error(e); }
  };

  const handleProgramChange = async (title) => {
    setProgramTitle(title);
    setSelectedStudents([]);
    setStudents([]);
    setFilteredStudents([]);
    if (!title) return;
    try {
        const res  = await getProgramStudentsS(title);
        // Normalise selon ce que ton API retourne
        const list = Array.isArray(res) ? res : res?.students ?? res?.data ?? [];
        setStudents(list);
        setFilteredStudents(list);
    } catch (e) { console.error(e); }
  };

  const handleStudentSearch = (e) => {
    const term = e.target.value;
    setSearchStudent(term);
    setFilteredStudents(students.filter((s) =>
      s.permanentCode.toUpperCase().includes(term.toUpperCase()) ||
      s.lastName?.toUpperCase().includes(term.toUpperCase()) ||
      s.firstName?.toUpperCase().includes(term.toUpperCase())
    ));
  };

  const handleCourseSearch = (e) => {
    const term = e.target.value;
    setSearchCourse(term);
    setFilteredCourses(classesCourses.filter((c) =>
      c.courseSigle?.toUpperCase().includes(term.toUpperCase()) ||
      c.classeName?.toUpperCase().includes(term.toUpperCase())
    ));
  };

  const addStudent    = (s)  => { if (!selectedStudents.find((x) => x.permanentCode === s.permanentCode)) setSelectedStudents((p) => [...p, s]); };
  const removeStudent = (pc) => setSelectedStudents((p) => p.filter((s) => s.permanentCode !== pc));
  const addCourse     = (c)  => { if (!selectedCourses.find((x) => x.id === c.id)) setSelectedCourses((p) => [...p, c]); };
  const removeCourse  = (id) => setSelectedCourses((p) => p.filter((c) => c.id !== id));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourses.length || !selectedStudents.length) return;
    setIsLoading(true);
    try {
      const res = await enrollStudentsInCoursesS({
        cCourseIds:     selectedCourses.map((c) => c.id),
        permanentCodes: selectedStudents.map((s) => s.permanentCode),
        programTitle: programTitle
      });
      if (res.success) {
        showAlert("success", `${selectedStudents.length} étudiant(s) inscrit(s) à ${selectedCourses.length} cours.`);
        setSelectedStudents([]);
        setSelectedCourses([]);
      } else {
        showAlert("error", res.message);
      }
    } catch { showAlert("warning", "Impossible de contacter le serveur."); }
    finally { setIsLoading(false); }
  };

  const inputCls = "w-full text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 transition";
  const canSubmit = selectedStudents.length > 0 && selectedCourses.length > 0;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar userCo={employeeCo} profilePic={adminPicture} />
      <main className="flex-1 overflow-y-auto">
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-8 sticky top-0 z-10 shrink-0">
          <div>
            <p className="text-sm font-semibold text-slate-900">Inscription aux cours</p>
            <p className="text-xs text-slate-400">Inscrire des étudiants à des cours de session</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-8 max-w-7xl flex flex-col gap-6">
          {alert && <Alert type={alert.type} message={alert.message} />}

          {/* ── Filtres contexte ── */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Contexte d'inscription</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Session</label>
                <select value={sessionCourse} onChange={(e) => setSessionCourse(e.target.value)}
                  className={`${inputCls} px-3 py-2.5 bg-white`}>
                  <option value="">Sélectionner une session</option>
                  <option value="Hiver">Hiver</option>
                  <option value="Été">Été</option>
                  <option value="Automne">Automne</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Programme</label>
                {/* Pills niveau */}
                    <div className="flex gap-2 flex-wrap">
                      <button type="button" onClick={() => setProgramGradeFilter("")}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${!programGradeFilter ? "bg-blue-800 text-white border-blue-800" : "bg-white text-slate-600 border-slate-200 hover:border-blue-700"}`}>
                        Tous
                      </button>
                      {[...new Set(programs.map((p) => p.grade).filter(Boolean))].map((g) => (
                        <button type="button" key={g} onClick={() => setProgramGradeFilter(programGradeFilter === g ? "" : g)}
                          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${programGradeFilter === g ? "bg-blue-800 text-white border-blue-800" : "bg-white text-slate-600 border-slate-200 hover:border-blue-700"}`}>
                          {g}
                        </button>
                      ))}
                    </div>
 
                    {/* Recherche */}
                    <div className="relative">
                      <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" value={programSearch} onChange={(e) => setProgramSearch(e.target.value)}
                        placeholder="Rechercher un programme..."
                        className="w-full pl-9 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 transition" />
                    </div>
                {/* Liste */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                      {programs
                        .filter((p) => (!programGradeFilter || p.grade === programGradeFilter) &&
                          (!programSearch || p.title.toLowerCase().includes(programSearch.toLowerCase()) || p.programName.toLowerCase().includes(programSearch.toLowerCase())))
                        .map((p) => (
                          <button type="button" key={p.title} onClick={() => handleProgramChange(p.title)}
                            className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left border-b border-slate-50 last:border-0 hover:bg-blue-50 transition-colors">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold border px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border-slate-200 shrink-0">{p.grade}</span>
                                <p className="text-sm font-medium text-slate-900 truncate">{p.title}</p>
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5 truncate">{p.programName}</p>
                            </div>
                          </button>
                        ))}
                    </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">

            {/* ── Étudiants ── */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <p className="text-sm font-semibold text-slate-900">Étudiants</p>
                <p className="text-xs text-slate-400 mt-0.5">{selectedStudents.length} sélectionné(s)</p>
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                {/* Sélectionnés */}
                {selectedStudents.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    {selectedStudents.map((s) => (
                      <div key={s.permanentCode} className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{s.firstName} {s.lastName}</p>
                          <p className="text-xs text-slate-400 font-mono">{s.permanentCode}</p>
                        </div>
                        <button type="button" onClick={() => removeStudent(s.permanentCode)} className="text-slate-400 hover:text-red-600 transition-colors ml-2 shrink-0">
                          <HiX className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <div className="border-t border-slate-100 pt-2" />
                  </div>
                )}
                {/* Recherche */}
                <div className="relative">
                  <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={searchStudent} onChange={handleStudentSearch}
                    placeholder={programTitle ? "Rechercher dans ce programme..." : "Choisir d'abord un programme"}
                    disabled={!programTitle}
                    className={`${inputCls} pl-9 py-2.5 ${!programTitle ? "opacity-50 cursor-not-allowed bg-slate-50" : ""}`} />
                </div>
                {/* Liste */}
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                  {!programTitle ? (
                    <p className="text-sm text-slate-400 text-center py-6">Sélectionnez un programme pour voir les étudiants.</p>
                  ) : filteredStudents.filter((s) => !selectedStudents.find((x) => x.permanentCode === s.permanentCode)).length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-6">Aucun étudiant trouvé.</p>
                  ) : (
                    filteredStudents
                      .filter((s) => !selectedStudents.find((x) => x.permanentCode === s.permanentCode))
                      .map((student) => (
                        <button type="button" key={student.permanentCode} onClick={() => addStudent(student)}
                          className="w-full flex items-center justify-between px-4 py-3 text-left border-b border-slate-50 last:border-0 hover:bg-blue-50 transition-colors">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{student.firstName} {student.lastName}</p>
                            <p className="text-xs text-slate-400 font-mono">{student.permanentCode}</p>
                          </div>
                          <HiPlus className="w-4 h-4 text-slate-300 shrink-0" />
                        </button>
                      ))
                  )}
                </div>
              </div>
            </div>

            {/* ── Cours ── */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <p className="text-sm font-semibold text-slate-900">Cours disponibles</p>
                <p className="text-xs text-slate-400 mt-0.5">{selectedCourses.length} sélectionné(s)</p>
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                {/* Sélectionnés */}
                {selectedCourses.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    {selectedCourses.map((c) => (
                      <div key={c.id} className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                        <div>
                          <p className="text-xs font-semibold text-slate-800 font-mono">{c.courseSigle}</p>
                          <p className="text-xs text-slate-400">{c.classeName} · {c.jours} {c.startTime}–{c.endTime}</p>
                        </div>
                        <button type="button" onClick={() => removeCourse(c.id)} className="text-slate-400 hover:text-red-600 transition-colors ml-2 shrink-0">
                          <HiX className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <div className="border-t border-slate-100 pt-2" />
                  </div>
                )}
                {/* Recherche cours */}
                <div className="relative">
                  <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={searchCourse} onChange={handleCourseSearch}
                    placeholder={sessionCourse && programTitle ? "Rechercher par sigle ou salle..." : "Choisir session et programme"}
                    disabled={!sessionCourse || !programTitle}
                    className={`${inputCls} pl-9 py-2.5 ${(!sessionCourse || !programTitle) ? "opacity-50 cursor-not-allowed bg-slate-50" : ""}`} />
                </div>
                {/* Liste cours */}
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                  {!sessionCourse || !programTitle ? (
                    <p className="text-sm text-slate-400 text-center py-6">Sélectionnez session + programme pour voir les cours.</p>
                  ) : filteredCourses.filter((c) => !selectedCourses.find((x) => x.id === c.id)).length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-6">Aucun cours trouvé.</p>
                  ) : (
                    filteredCourses
                      .filter((c) => !selectedCourses.find((x) => x.id === c.id))
                      .map((course) => (
                        <button type="button" key={course.id} onClick={() => addCourse(course)}
                          className="w-full flex items-center justify-between px-4 py-3 text-left border-b border-slate-50 last:border-0 hover:bg-blue-50 transition-colors">
                          <div>
                            <p className="text-sm font-semibold text-slate-900 font-mono">{course.courseSigle}</p>
                            <p className="text-xs text-slate-400">{course.classeName} · {course.jours} · {course.startTime}–{course.endTime}</p>
                          </div>
                          <HiPlus className="w-4 h-4 text-slate-300 shrink-0" />
                        </button>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Récap + Submit */}
          {canSubmit && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">{selectedStudents.length} étudiant(s)</span> seront inscrits à <span className="font-semibold">{selectedCourses.length} cours</span> pour la session <span className="font-semibold">{sessionCourse}</span>.
              </p>
              <button type="submit" disabled={isLoading}
                className="shrink-0 flex items-center gap-2 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
                <HiCheck className="w-4 h-4" />
                {isLoading ? "Inscription..." : "Confirmer"}
              </button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default CourseEnrollment;