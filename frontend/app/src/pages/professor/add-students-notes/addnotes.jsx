import Sidebar from "../../sidebar/sidebar";
import profPicture from "../../../assets/img/Professor.jpg";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { HiChevronRight, HiArrowLeft, HiCheck, HiExclamation, HiX, HiUpload } from "react-icons/hi";
import { RiGraduationCapFill } from "react-icons/ri";
import { getStudentsInProgramS } from "../../../services/user.service";
import { addNotesS } from "../../../services/bulletin.service";
import { getProfCourseS } from "../../../services/course.service";

// ── Helpers ───────────────────────────────────────────────────────────────────
const MENTION_OPTIONS = ["A+","A","A-","B+","B","B-","C+","C","C-","D+","D","E","EXE","I","S","R","*"];

const MENTION_COLOR = {
  "A+":"text-green-700","A":"text-green-700","A-":"text-green-700",
  "B+":"text-blue-700","B":"text-blue-700","B-":"text-blue-700",
  "C+":"text-amber-700","C":"text-amber-700","C-":"text-amber-700",
  "D+":"text-orange-700","D":"text-orange-700",
  "E":"text-red-700",
};

const Alert = ({ type, message }) => {
  const s = { success:"bg-green-50 border-green-200 text-green-700", error:"bg-red-50 border-red-200 text-red-700", warning:"bg-amber-50 border-amber-200 text-amber-700" }[type];
  const Icon = type==="success" ? HiCheck : type==="warning" ? HiExclamation : HiX;
  return (
    <div className={`flex items-center gap-2 border rounded-xl px-4 py-3 text-sm ${s}`}>
      <Icon className="w-4 h-4 shrink-0"/>{message}
    </div>
  );
};

const Breadcrumb = ({ items, onNavigate }) => (
  <div className="flex items-center gap-1.5 text-xs text-slate-400 flex-wrap">
    {items.map((item, i) => (
      <span key={i} className="flex items-center gap-1.5">
        {i > 0 && <HiChevronRight className="w-3 h-3 shrink-0"/>}
        {i < items.length - 1
          ? <button onClick={() => onNavigate(i)} className="hover:text-blue-700 transition-colors">{item}</button>
          : <span className="text-slate-700 font-medium">{item}</span>
        }
      </span>
    ))}
  </div>
);

// ── Page principale ───────────────────────────────────────────────────────────
const AddStudentsNotes = ({ user }) => {
  const location     = useLocation();
  const directCourse = location.state?.classeCourse; // accès direct depuis ProfessorSpace

  const [view, setView]                       = useState(directCourse ? "notes" : "grade");
  const [allCourses, setAllCourses]           = useState([]);
  const [selectedGrade, setSelectedGrade]     = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedCourse, setSelectedCourse]   = useState(directCourse ?? null);
  const [students, setStudents]               = useState([]);
  const [alert, setAlert]                     = useState(null);
  const [isLoading, setIsLoading]             = useState(false);
  const [isSaving, setIsSaving]               = useState(false);

  useEffect(() => { loadCourses(); }, []);
  useEffect(() => { if (directCourse) loadStudents(directCourse.id); }, []);

  const showAlert = (type, message) => { setAlert({type,message}); setTimeout(()=>setAlert(null),5000); };

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      const res  = await getProfCourseS(user?.code);
      const all  = Array.isArray(res) ? res : res?.courses ?? res?.data ?? [];
      const mine = all.filter((c) => c.taughtBy === user?.code);
      setAllCourses(mine);
    } catch(e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const loadStudents = async (ccId) => {
    setIsLoading(true);
    try {
      const res = await getStudentsInProgramS(ccId);
      if (res.success) setStudents(res.students);
      else showAlert("error", res.message);
    } catch(e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  // Données dérivées
  const grades   = [...new Set(allCourses.map((c) => c.grade ?? c.programGrade).filter(Boolean))];
  const programs = [...new Set(allCourses.filter((c) => (c.grade??c.programGrade)===selectedGrade).map((c) => c.programTitle).filter(Boolean))];
  const courses  = allCourses.filter((c) => c.programTitle === selectedProgram);

  // Navigation
  const selectGrade = (g) => { setSelectedGrade(g); setSelectedProgram(null); setSelectedCourse(null); setView("program"); };
  const selectProgram = (p) => { setSelectedProgram(p); setSelectedCourse(null); setView("courses"); };
  const selectCourse = async (c) => { setSelectedCourse(c); await loadStudents(c.id); setView("notes"); };

  const navigateBreadcrumb = (idx) => {
    if (idx===0) { setView("grade"); setSelectedGrade(null); setSelectedProgram(null); setSelectedCourse(null); setStudents([]); }
    if (idx===1) { setView("program"); setSelectedProgram(null); setSelectedCourse(null); setStudents([]); }
    if (idx===2) { setView("courses"); setSelectedCourse(null); setStudents([]); }
  };

  const breadcrumbs = ["Saisie des notes"];
  if (selectedGrade)   breadcrumbs.push(selectedGrade);
  if (selectedProgram) breadcrumbs.push(selectedProgram);
  if (selectedCourse)  breadcrumbs.push(selectedCourse.courseSigle ?? selectedCourse.id);

  const handleChange = (permanentCode, field, value) => {
    setStudents((prev) => prev.map((s) => s.permanentCode === permanentCode ? {...s, [field]: value} : s));
  };

  const addNotes = async (e) => {
    e.preventDefault();
    const mentions = students.map((s) => s.mention);
    const hasOne   = mentions.some((m) => m?.trim());
    const hasEmpty = mentions.some((m) => !m?.trim());
    if (hasOne && hasEmpty) { showAlert("error", "Si une mention est remplie, toutes doivent l'être."); return; }

    setIsSaving(true);
    try {
      const payload = students.map((s) => ({
        permanentCode: s.permanentCode,
        grade:         s.grade,
        mention:       s.mention,
        sigle:         selectedCourse?.courseSigle,
      }));
      const res = await addNotesS(payload);
      if (res.success) { showAlert("success", "Notes enregistrées avec succès."); await loadStudents(selectedCourse.id); }
      else showAlert("error", res.message);
    } catch { showAlert("warning", "Impossible de contacter le serveur."); }
    finally { setIsSaving(false); }
  };

  // CSV upload (parsing basique)
  const handleCsvUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split("\n").filter(Boolean);
      const updated = [...students];
      lines.forEach((line) => {
        const [code, grade, mention] = line.split(",").map((s) => s.trim());
        const idx = updated.findIndex((s) => s.permanentCode === code);
        if (idx !== -1) { updated[idx] = {...updated[idx], grade: grade ?? "", mention: mention ?? ""}; }
      });
      setStudents(updated);
      showAlert("success", "Fichier CSV importé. Vérifiez les données avant de sauvegarder.");
    };
    reader.readAsText(file);
  };

  const completion = students.length > 0
    ? Math.round((students.filter((s) => s.mention?.trim()).length / students.length) * 100)
    : 0;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar user={user} profilePic={profPicture} />

      <main className="flex-1 overflow-y-auto">

        {/* Top bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {view !== "grade" && !directCourse && (
              <button onClick={() => navigateBreadcrumb(breadcrumbs.length - 2)}
                className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-700 hover:text-blue-800 text-slate-500 transition-colors">
                <HiArrowLeft className="w-4 h-4"/>
              </button>
            )}
            <div>
              <p className="text-sm font-semibold text-slate-900">Saisie des notes</p>
              {!directCourse && <Breadcrumb items={breadcrumbs} onNavigate={navigateBreadcrumb}/>}
            </div>
          </div>
        </div>

        <div className="p-8 max-w-5xl flex flex-col gap-6">

          {alert && <Alert type={alert.type} message={alert.message}/>}
          {isLoading && <p className="text-sm text-slate-400">Chargement...</p>}

          {/* ── Vue 1 : Niveaux ── */}
          {!isLoading && view==="grade" && (
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Sélectionnez un niveau d'études</p>
              {grades.length===0 ? <p className="text-sm text-slate-400">Aucun cours assigné.</p> : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {grades.map((grade) => (
                    <button key={grade} onClick={() => selectGrade(grade)}
                      className="group bg-white border border-slate-200 hover:border-blue-700 rounded-xl p-6 text-left transition-all hover:shadow-md">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 group-hover:bg-blue-800 group-hover:text-white transition-colors mb-4">
                        <RiGraduationCapFill className="w-5 h-5"/>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-800 transition-colors">{grade}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {[...new Set(allCourses.filter((c)=>(c.grade??c.programGrade)===grade).map((c)=>c.programTitle))].length} programme(s)
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Vue 2 : Programmes ── */}
          {!isLoading && view==="program" && (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Programmes — {selectedGrade}</p>
              {programs.map((prog) => (
                <button key={prog} onClick={() => selectProgram(prog)}
                  className="group bg-white border border-slate-200 hover:border-blue-700 rounded-xl px-6 py-5 text-left flex items-center justify-between transition-all hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 group-hover:bg-blue-800 group-hover:text-white transition-colors shrink-0">
                      <RiGraduationCapFill className="w-4 h-4"/>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-800 transition-colors">{prog}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{allCourses.filter((c)=>c.programTitle===prog).length} cours</p>
                    </div>
                  </div>
                  <HiChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-700 transition-colors"/>
                </button>
              ))}
            </div>
          )}

          {/* ── Vue 3 : Cours ── */}
          {!isLoading && view==="courses" && (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Cours — {selectedProgram}</p>
              {courses.map((course) => (
                <button key={course.id} onClick={() => selectCourse(course)}
                  className="group bg-white border border-slate-200 hover:border-blue-700 rounded-xl px-6 py-5 text-left flex items-center justify-between transition-all hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 group-hover:bg-blue-800 group-hover:text-white transition-colors shrink-0">
                      <RiGraduationCapFill className="w-4 h-4"/>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700">{course.courseSigle}</span>
                        <span className="text-xs text-slate-400">{course.sessionCourse} {course.yearCourse}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{course.classeName} · {course.jours} · {course.startTime}–{course.endTime}</p>
                    </div>
                  </div>
                  <HiChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-700 transition-colors"/>
                </button>
              ))}
            </div>
          )}

          {/* ── Vue 4 : Saisie des notes ── */}
          {!isLoading && view==="notes" && selectedCourse && (
            <>
              {/* Récap cours */}
              <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-800 flex items-center justify-center shrink-0">
                    <RiGraduationCapFill className="w-5 h-5 text-white"/>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800">{selectedCourse.courseSigle}</span>
                      <span className="text-xs text-slate-400">{selectedCourse.sessionCourse} {selectedCourse.yearCourse}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{selectedCourse.classeName} · {selectedCourse.jours} · {selectedCourse.startTime}–{selectedCourse.endTime}</p>
                  </div>
                </div>
                {/* Barre progression */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-24 bg-slate-200 rounded-full h-1.5">
                    <div className="h-1.5 bg-blue-700 rounded-full transition-all" style={{width:`${completion}%`}}/>
                  </div>
                  <span className="text-xs text-slate-500">{completion}% saisi</span>
                </div>
              </div>

              {/* Import CSV */}
              <div className="bg-white border border-dashed border-slate-300 rounded-xl p-5">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <HiUpload className="w-4 h-4 text-slate-500"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700">Importer via CSV</p>
                    <p className="text-xs text-slate-400 mt-0.5">Format attendu : <span className="font-mono">code_permanent, note, mention</span> — une ligne par étudiant</p>
                  </div>
                  <label className="shrink-0 flex items-center gap-1.5 text-xs font-medium border border-slate-200 hover:border-blue-700 hover:text-blue-800 text-slate-600 px-3 py-2 rounded-lg cursor-pointer transition-colors">
                    <HiUpload className="w-3.5 h-3.5"/>
                    Choisir un fichier
                    <input type="file" accept=".csv,.txt" className="hidden" onChange={handleCsvUpload}/>
                  </label>
                </div>
              </div>

              {/* Table de saisie */}
              <form onSubmit={addNotes} className="flex flex-col gap-4">
                {students.length === 0 ? (
                  <p className="text-sm text-slate-400">Aucun étudiant inscrit à cette séance.</p>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100">
                          {["Code permanent","Nom","Prénom","Note (chiffre)","Mention"].map((h)=>(
                            <th key={h} className="text-left py-3 px-4 text-xs text-slate-400 font-medium uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student, i) => (
                          <tr key={student.permanentCode} className={`border-b border-slate-50 last:border-0 ${i%2===1?"bg-slate-50/40":""}`}>
                            <td className="py-3 px-4 font-mono text-xs font-bold text-slate-700">{student.permanentCode}</td>
                            <td className="py-3 px-4 font-medium text-slate-900">{student.lastName}</td>
                            <td className="py-3 px-4 text-slate-700">{student.firstName}</td>
                            <td className="py-2 px-4">
                              <input
                                type="text"
                                value={student.grade ?? ""}
                                onChange={(e) => handleChange(student.permanentCode, "grade", e.target.value)}
                                placeholder="ex. 78"
                                className="w-24 border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <select
                                value={student.mention ?? ""}
                                onChange={(e) => handleChange(student.permanentCode, "mention", e.target.value)}
                                className={`border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 transition bg-white font-medium ${MENTION_COLOR[student.mention] ?? "text-slate-700"}`}
                              >
                                <option value="">—</option>
                                {MENTION_OPTIONS.map((m) => (
                                  <option key={m} value={m} className={MENTION_COLOR[m] ?? ""}>{m}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {students.length > 0 && (
                  <div className="flex justify-end">
                    <button type="submit" disabled={isSaving}
                      className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors">
                      <HiCheck className="w-4 h-4"/>
                      {isSaving ? "Enregistrement..." : "Enregistrer les notes"}
                    </button>
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AddStudentsNotes;