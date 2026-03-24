import Sidebar from "../../sidebar/sidebar";
import adminPicture from "../../../assets/img/Admin.jpg";
import React, { useEffect, useState } from "react";
import { HiSearch, HiX, HiCheck, HiExclamation, HiAcademicCap, HiUser } from "react-icons/hi";
import { getProgramsS } from "../../../services/program.service";
import { getClassesCoursesByProgramS, assignProfessorToClasseCourseS } from "../../../services/course.service";
import { getEmployeesS } from "../../../services/employee.service";

// ── Helpers ───────────────────────────────────────────────────────────────────
const inputCls = "w-full text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 transition bg-white";

const Alert = ({ type, message }) => {
  const s = { success: "bg-green-50 border-green-200 text-green-700", error: "bg-red-50 border-red-200 text-red-700", warning: "bg-amber-50 border-amber-200 text-amber-700" }[type];
  const Icon = type === "success" ? HiCheck : type === "warning" ? HiExclamation : HiX;
  return (
    <div className={`flex items-center gap-2 border rounded-xl px-4 py-3 text-sm ${s}`}>
      <Icon className="w-4 h-4 shrink-0" />{message}
    </div>
  );
};

// ── Page principale ───────────────────────────────────────────────────────────
const AssignProfessor = ({ employeeCo }) => {
  const [programs, setPrograms]               = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programSearch, setProgramSearch]     = useState("");
  const [gradeFilter, setGradeFilter]         = useState("");

  const [classesCourses, setClassesCourses]   = useState([]);
  const [courseSearch, setCourseSearch]       = useState("");

  const [professors, setProfessors]           = useState([]);
  const [profSearch, setProfSearch]           = useState("");

  // État de l'assignation : { classCourseId → { prof, saving, saved } }
  const [assignments, setAssignments]         = useState({});
  const [alert, setAlert]                     = useState(null);

  useEffect(() => { loadInitial(); }, []);
  useEffect(() => { if (selectedProgram) loadCourses(selectedProgram.title); }, [selectedProgram]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const loadInitial = async () => {
    try {
      const [progs, emps] = await Promise.all([getProgramsS(), getEmployeesS()]);
      setPrograms(Array.isArray(progs) ? progs : []);
      const profs = (Array.isArray(emps) ? emps : []).filter(
        (e) => e.userRole?.toLowerCase() === "professor"
      );
      setProfessors(profs);
    } catch (e) { console.error(e); }
  };

  const loadCourses = async (title) => {
    try {
      const res     = await getClassesCoursesByProgramS(title);
      const courses = Array.isArray(res) ? res : res?.courses ?? res?.data ?? [];
      setClassesCourses(courses);
      // Pré-remplir les assignations existantes
      const init = {};
      courses.forEach((c) => {
        if (c.professorCode) init[c.id] = { profCode: c.professorCode, profName: c.professorName ?? c.professorCode, saved: true, saving: false };
      });
      setAssignments(init);
    } catch (e) { console.error(e); }
  };

  const assignProf = async (classCourse, prof) => {
    setAssignments((prev) => ({ ...prev, [classCourse.id]: { profCode: prof.code, profName: `${prof.firstName} ${prof.lastName}`, saving: true, saved: false } }));
    try {
      await assignProfessorToClasseCourseS({ classCourseId: classCourse.id, professorCode: prof.code });
      setAssignments((prev) => ({ ...prev, [classCourse.id]: { profCode: prof.code, profName: `${prof.firstName} ${prof.lastName}`, saving: false, saved: true } }));
      showAlert("success", `${prof.firstName} ${prof.lastName} assigné(e) à ${classCourse.courseSigle}.`);
    } catch {
      setAssignments((prev) => { const n = { ...prev }; delete n[classCourse.id]; return n; });
      showAlert("error", "Impossible d'assigner ce professeur.");
    }
  };

  const removeAssignment = (courseId) => {
    setAssignments((prev) => { const n = { ...prev }; delete n[courseId]; return n; });
  };

  // Filtrages
  const grades = [...new Set(programs.map((p) => p.grade).filter(Boolean))];

  const filteredPrograms = programs.filter((p) => {
    const matchGrade  = !gradeFilter || p.grade === gradeFilter;
    const matchSearch = !programSearch || p.title.toLowerCase().includes(programSearch.toLowerCase()) || p.programName.toLowerCase().includes(programSearch.toLowerCase());
    return matchGrade && matchSearch;
  });

  const filteredCourses = classesCourses.filter((c) =>
    !courseSearch ||
    c.courseSigle?.toUpperCase().includes(courseSearch.toUpperCase()) ||
    c.classeName?.toUpperCase().includes(courseSearch.toUpperCase()) ||
    c.jours?.toUpperCase().includes(courseSearch.toUpperCase())
  );

  const filteredProfs = professors.filter((p) =>
    !profSearch ||
    p.code?.toUpperCase().includes(profSearch.toUpperCase()) ||
    p.lastName?.toUpperCase().includes(profSearch.toUpperCase()) ||
    p.firstName?.toUpperCase().includes(profSearch.toUpperCase())
  );

  const assignedCount = Object.keys(assignments).length;
  const totalCount    = classesCourses.length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar userCo={employeeCo} profilePic={adminPicture} />

      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-8 sticky top-0 z-10">
          <div>
            <p className="text-sm font-semibold text-slate-900">Attribution des professeurs</p>
            <p className="text-xs text-slate-400">Associer un professeur à chaque séance de cours</p>
          </div>
        </div>

        <div className="p-8 flex flex-col gap-6 max-w-7xl">

          {alert && <Alert type={alert.type} message={alert.message} />}

          {/* ── Étape 1 : Choisir un programme ── */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Programme</p>
                <p className="text-xs text-slate-400 mt-0.5">Sélectionnez le programme pour voir ses séances</p>
              </div>
              {selectedProgram && totalCount > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-200 rounded-full h-1.5">
                    <div className="h-1.5 bg-blue-700 rounded-full transition-all" style={{ width: `${(assignedCount / totalCount) * 100}%` }} />
                  </div>
                  <span className="text-xs text-slate-500">{assignedCount}/{totalCount} assignés</span>
                </div>
              )}
            </div>
            <div className="p-5">
              {selectedProgram ? (
                <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold border px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border-blue-200">{selectedProgram.grade}</span>
                      <p className="text-sm font-semibold text-slate-900">{selectedProgram.title}</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{selectedProgram.programName} · {selectedProgram.faculty}</p>
                  </div>
                  <button onClick={() => { setSelectedProgram(null); setClassesCourses([]); setAssignments({}); }}
                    className="text-slate-400 hover:text-red-600 transition-colors ml-3">
                    <HiX className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {/* Pills niveau */}
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setGradeFilter("")}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${!gradeFilter ? "bg-blue-800 text-white border-blue-800" : "bg-white text-slate-600 border-slate-200 hover:border-blue-700"}`}>
                      Tous
                    </button>
                    {grades.map((g) => (
                      <button key={g} onClick={() => setGradeFilter(gradeFilter === g ? "" : g)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${gradeFilter === g ? "bg-blue-800 text-white border-blue-800" : "bg-white text-slate-600 border-slate-200 hover:border-blue-700"}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                  {/* Recherche programme */}
                  <div className="relative max-w-sm">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={programSearch} onChange={(e) => setProgramSearch(e.target.value)}
                      placeholder="Rechercher un programme..."
                      className={`${inputCls} pl-9 py-2.5`} />
                  </div>
                  {/* Liste */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                    {filteredPrograms.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-5">Aucun programme trouvé.</p>
                    ) : filteredPrograms.map((p) => (
                      <button key={p.title} onClick={() => setSelectedProgram(p)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left border-b border-slate-50 last:border-0 hover:bg-blue-50 transition-colors">
                        <span className="text-xs font-semibold border px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border-slate-200 shrink-0">{p.grade}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{p.title}</p>
                          <p className="text-xs text-slate-400 truncate">{p.programName}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Étape 2 : Séances + assignation ── */}
          {selectedProgram && (
            <div className="grid lg:grid-cols-2 gap-6">

              {/* Colonne gauche : séances */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-sm font-semibold text-slate-900">Séances de cours</p>
                  <p className="text-xs text-slate-400 mt-0.5">{filteredCourses.length} séance{filteredCourses.length > 1 ? "s" : ""}</p>
                </div>
                <div className="p-4 flex flex-col gap-3 flex-1">
                  {/* Recherche cours */}
                  <div className="relative">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={courseSearch} onChange={(e) => setCourseSearch(e.target.value)}
                      placeholder="Sigle, salle ou jour..."
                      className={`${inputCls} pl-9 py-2.5`} />
                  </div>
                  {/* Liste séances */}
                  <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
                    {filteredCourses.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-6">Aucune séance trouvée.</p>
                    ) : filteredCourses.map((course) => {
                      const asgn = assignments[course.id];
                      return (
                        <div key={course.id}
                          className={`border rounded-xl p-4 transition-colors ${asgn?.saved ? "border-green-200 bg-green-50/40" : "border-slate-200 bg-white"}`}>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-slate-800">{course.courseSigle}</span>
                                <span className="text-xs text-slate-400">{course.sessionCourse} {course.yearCourse}</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">{course.classeName} · {course.jours} · {course.startTime}–{course.endTime}</p>
                            </div>
                            {asgn?.saved && (
                              <span className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded-full">
                                <HiCheck className="w-3 h-3" /> Assigné
                              </span>
                            )}
                          </div>

                          {/* Prof assigné ou sélecteur inline */}
                          {asgn ? (
                            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                  <HiUser className="w-3 h-3 text-blue-700" />
                                </div>
                                <p className="text-xs font-medium text-slate-800">{asgn.profName}</p>
                              </div>
                              {!asgn.saving && (
                                <button onClick={() => removeAssignment(course.id)}
                                  className="text-slate-300 hover:text-red-500 transition-colors">
                                  <HiX className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {asgn.saving && <span className="text-xs text-slate-400 animate-pulse">Enregistrement...</span>}
                            </div>
                          ) : (
                            <div className="relative">
                              <HiAcademicCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <select
                                defaultValue=""
                                onChange={(e) => {
                                  const prof = professors.find((p) => p.code === e.target.value);
                                  if (prof) assignProf(course, prof);
                                }}
                                className={`${inputCls} pl-9 py-2 text-slate-500`}
                              >
                                <option value="" disabled>Assigner un professeur...</option>
                                {professors.map((p) => (
                                  <option key={p.code} value={p.code}>
                                    {p.firstName} {p.lastName} — {p.department}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Colonne droite : annuaire des profs */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-sm font-semibold text-slate-900">Annuaire des professeurs</p>
                  <p className="text-xs text-slate-400 mt-0.5">{professors.length} professeur{professors.length > 1 ? "s" : ""} disponibles</p>
                </div>
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div className="relative">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={profSearch} onChange={(e) => setProfSearch(e.target.value)}
                      placeholder="Rechercher par code, nom ou prénom..."
                      className={`${inputCls} pl-9 py-2.5`} />
                  </div>
                  <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
                    {filteredProfs.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-6">Aucun professeur trouvé.</p>
                    ) : filteredProfs.map((prof) => {
                      const assignedCount = Object.values(assignments).filter((a) => a.profCode === prof.code && a.saved).length;
                      return (
                        <div key={prof.code} className="border border-slate-200 rounded-xl p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-blue-700">
                                  {prof.firstName?.[0]}{prof.lastName?.[0]}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{prof.firstName} {prof.lastName}</p>
                                <p className="text-xs text-slate-400 font-mono">{prof.code}</p>
                              </div>
                            </div>
                            {assignedCount > 0 && (
                              <span className="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full shrink-0">
                                {assignedCount} cours
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex gap-2 flex-wrap">
                            <span className="text-xs text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">{prof.department}</span>
                            <span className="text-xs text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">{prof.faculty}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AssignProfessor;