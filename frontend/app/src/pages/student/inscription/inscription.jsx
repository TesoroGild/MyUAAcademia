import Sidebar from "../../sidebar/sidebar";
import adminPicture from "../../../assets/img/Admin.jpg";
import React, { useEffect, useState } from "react";
import { HiCheck, HiExclamation, HiX, HiSearch, HiPlus, HiTrash } from "react-icons/hi";
import { getProgramsS, programRegistrationS } from "../../../services/program.service";
import { getStudentsS } from "../../../services/user.service";

// ── Helpers ───────────────────────────────────────────────────────────────────
const GRADES = ["Certificat", "BTS", "Baccalauréat", "Master", "Doctorat"];
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

const Inscription = ({ user }) => {
  const [programs, setPrograms]                         = useState([]);
  const [students, setStudents]                         = useState([]);
  const [filteredStudents, setFilteredStudents]         = useState([]);
  const [searchStudent, setSearchStudent]               = useState("");
  const [selectedProgram, setSelectedProgram]           = useState(null);
  const [gradeFilter, setGradeFilter]                   = useState("");
  const [programSearch, setProgramSearch]               = useState("");
  const [selectedStudents, setSelectedStudents]         = useState([]); // { permanentCode, firstName, lastName }
  const [alert, setAlert]                               = useState(null);
  const [isLoading, setIsLoading]                       = useState(false);

  useEffect(() => { getPrograms(); getStudents(); }, []);

  const showAlert = (type, message) => { setAlert({ type, message }); setTimeout(() => setAlert(null), 5000); };

  const getPrograms = async () => { try { setPrograms(await getProgramsS()); } catch (e) { console.error(e); } };
  const getStudents = async () => {
    try {
      const result = await getStudentsS();
      setStudents(result);
      setFilteredStudents(result);
    } catch { showAlert("warning", "Impossible de contacter le serveur."); }
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

  const addStudent = (student) => {
    if (!selectedStudents.find((s) => s.permanentCode === student.permanentCode))
      setSelectedStudents((prev) => [...prev, student]);
  };

  const removeStudent = (pc) => setSelectedStudents((prev) => prev.filter((s) => s.permanentCode !== pc));

  const filteredPrograms = programs.filter((p) => {
    const matchGrade  = !gradeFilter || p.grade === gradeFilter;
    const matchSearch = !programSearch || p.title.toLowerCase().includes(programSearch.toLowerCase()) || p.programName.toLowerCase().includes(programSearch.toLowerCase());
    return matchGrade && matchSearch;
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProgram || selectedStudents.length === 0) return;
    setIsLoading(true);
    try {
      const result = await programRegistrationS({ title: selectedProgram.title, permanentCodes: selectedStudents.map((s) => s.permanentCode) });
      if (result !== null && result !== undefined) {
        showAlert("success", `${selectedStudents.length} étudiant(s) inscrit(s) au programme ${selectedProgram.title}.`);
        setSelectedStudents([]);
        setSelectedProgram(null);
        await getStudents();
      } else {
        showAlert("error", "Une erreur est survenue.");
      }
    } catch { showAlert("warning", "Impossible de contacter le serveur."); }
    finally { setIsLoading(false); }
  };

  const canSubmit = selectedProgram && selectedStudents.length > 0;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar user={user} profilePic={adminPicture} />
      <main className="flex-1 overflow-y-auto">
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-8 sticky top-0 z-10 shrink-0">
          <div>
            <p className="text-sm font-semibold text-slate-900">Inscription à un programme</p>
            <p className="text-xs text-slate-400">Inscrire un ou plusieurs étudiants à un programme</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-8 max-w-6xl flex flex-col gap-6">
          {alert && <Alert type={alert.type} message={alert.message} />}

          <div className="grid lg:grid-cols-2 gap-6">

            {/* ── Colonne Programme ── */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <p className="text-sm font-semibold text-slate-900">Programme cible</p>
                <p className="text-xs text-slate-400 mt-0.5">Sélectionnez le programme d'inscription</p>
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                {selectedProgram ? (
                  <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-semibold border px-2 py-0.5 rounded-full ${GRADE_BADGE[selectedProgram.grade] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>{selectedProgram.grade}</span>
                        <p className="text-sm font-semibold text-slate-900">{selectedProgram.title}</p>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{selectedProgram.programName} · {selectedProgram.faculty}</p>
                    </div>
                    <button type="button" onClick={() => setSelectedProgram(null)} className="text-slate-400 hover:text-red-600 transition-colors ml-3 shrink-0">
                      <HiX className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Filtre niveau */}
                    <div className="flex gap-2 flex-wrap">
                      <button type="button" onClick={() => setGradeFilter("")}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${!gradeFilter ? "bg-blue-800 text-white border-blue-800" : "bg-white text-slate-600 border-slate-200 hover:border-blue-700"}`}>
                        Tous
                      </button>
                      {GRADES.map((g) => (
                        <button type="button" key={g} onClick={() => setGradeFilter(gradeFilter === g ? "" : g)}
                          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${gradeFilter === g ? "bg-blue-800 text-white border-blue-800" : "bg-white text-slate-600 border-slate-200 hover:border-blue-700"}`}>
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
                    {/* Liste programmes */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                      {filteredPrograms.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-6">Aucun programme trouvé.</p>
                      ) : filteredPrograms.map((p) => (
                        <button type="button" key={p.title} onClick={() => setSelectedProgram(p)}
                          className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left border-b border-slate-50 last:border-0 hover:bg-blue-50 transition-colors">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-semibold border px-2 py-0.5 rounded-full shrink-0 ${GRADE_BADGE[p.grade] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>{p.grade}</span>
                              <p className="text-sm font-medium text-slate-900 truncate">{p.title}</p>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 truncate">{p.programName} · {p.faculty}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400">{filteredPrograms.length} programme{filteredPrograms.length > 1 ? "s" : ""}</p>
                  </>
                )}
              </div>
            </div>

            {/* ── Colonne Étudiants ── */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <p className="text-sm font-semibold text-slate-900">Étudiants à inscrire</p>
                <p className="text-xs text-slate-400 mt-0.5">{selectedStudents.length} étudiant(s) sélectionné(s)</p>
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                {/* Sélectionnés */}
                {selectedStudents.length > 0 && (
                  <div className="flex flex-col gap-1.5 mb-1">
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
                  </div>
                )}
                {/* Recherche étudiant */}
                <div className="relative">
                  <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={searchStudent} onChange={handleStudentSearch}
                    placeholder="Rechercher par code, nom ou prénom..."
                    className="w-full pl-9 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 transition" />
                </div>
                {/* Liste étudiants */}
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                  {filteredStudents.filter((s) => !selectedStudents.find((sel) => sel.permanentCode === s.permanentCode)).length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-6">Aucun étudiant trouvé.</p>
                  ) : (
                    filteredStudents
                      .filter((s) => !selectedStudents.find((sel) => sel.permanentCode === s.permanentCode))
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
          </div>

          {/* Récap + Submit */}
          {canSubmit && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">{selectedStudents.length} étudiant(s)</span> seront inscrits au programme <span className="font-semibold">{selectedProgram.title}</span>.
              </p>
              <button type="submit" disabled={isLoading}
                className="shrink-0 flex items-center gap-2 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
                <HiCheck className="w-4 h-4" />
                {isLoading ? "Inscription..." : "Confirmer l'inscription"}
              </button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default Inscription;