import Sidebar from "../sidebar/sidebar";
import userPicture from "../../assets/img/User_Icon.png";
import React, { useEffect, useState } from "react";
import { HiChevronDown, HiCheck, HiClock, HiAcademicCap } from "react-icons/hi";
import { getProgramCoursesS, getStudentCoursesS } from "../../services/course.service";
import { getStudentProgramsS } from "../../services/program.service";
import { getCourseGradeS } from "../../services/bulletin.service"

// ── Statut d'un cours ────────────────────────────────────────────────────────
// "done"    = réussi (mention != E et != null)
// "ongoing" = inscrit mais pas encore de mention
// "pending" = pas encore pris
const getCourseStatus = (sigle, studentCourses) => {
  const found = studentCourses.find((c) => c.sigle === sigle);
  if (!found) return "pending";
  //const grade = getCourseGradeS({ code: user.permanentCode, course: sigle });
  if (found.mention && found.mention !== "E") return "done";
  return "ongoing";
};

const STATUS_STYLE = {
  done:    { card: "bg-green-50 border-green-200", badge: "bg-green-100 text-green-700", label: "Réussi",    dot: "bg-green-500" },
  ongoing: { card: "bg-slate-100 border-slate-300", badge: "bg-slate-200 text-slate-600", label: "En cours", dot: "bg-slate-400" },
  pending: { card: "bg-white border-slate-200",     badge: "bg-white text-slate-400 border border-slate-200", label: "À prendre", dot: "bg-slate-200" },
};

// ── Barre de progression ─────────────────────────────────────────────────────
const ProgressBar = ({ done, ongoing, total }) => {
  const pctDone    = total ? Math.round((done / total) * 100) : 0;
  const pctOngoing = total ? Math.round((ongoing / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
        <span>{done} cours réussi{done > 1 ? "s" : ""} sur {total}</span>
        <span className="font-semibold text-slate-700">{pctDone}%</span>
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
        <div className="h-full bg-green-500 rounded-l-full transition-all" style={{ width: `${pctDone}%` }} />
        <div className="h-full bg-slate-400 transition-all" style={{ width: `${pctOngoing}%` }} />
      </div>
      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />Réussi</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />En cours</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-200 border border-slate-300 inline-block" />À prendre</span>
      </div>
    </div>
  );
};

// ── Dropdown programme ───────────────────────────────────────────────────────
const ProgramDropdown = ({ programs, selected, onSelect }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-700 text-sm font-medium text-slate-700 px-4 py-2.5 rounded-lg transition-colors"
      >
        <HiAcademicCap className="w-4 h-4 text-blue-700" />
        <span>{selected?.title ?? "Choisir un programme"}</span>
        <HiChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-slate-200 rounded-xl shadow-lg min-w-[260px] py-1">
          {programs.map((p) => (
            <button
              key={p.title}
              onClick={() => { onSelect(p); setOpen(false); }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-slate-50 ${
                selected?.title === p.title ? "text-blue-800 font-medium" : "text-slate-700"
              }`}
            >
              <p className="font-medium">{p.title}</p>
              <p className="text-xs text-slate-400">{p.programName}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Page principale ──────────────────────────────────────────────────────────
const Progress = ({ user }) => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programCourses, setProgramCourses] = useState([]);
  const [studentCourses, setStudentCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchInitial();
  }, []);

  useEffect(() => {
    if (selectedProgram) loadProgramCourses(selectedProgram.title);
  }, [selectedProgram]);

  const fetchInitial = async () => {
    try {
      const [progRes, coursRes] = await Promise.all([
        getStudentProgramsS(user.permanentCode),
        getStudentCoursesS(user.permanentCode),
      ]);

      if (progRes.success) {
        const enrolled = progRes.programs.filter((p) => p.isEnrolled);
        setPrograms(enrolled);
        if (enrolled.length > 0) setSelectedProgram(enrolled[0]);
      }

      if (coursRes.success) setStudentCourses(coursRes.courses);
    } catch (e) { console.error(e); }
  };

  const loadProgramCourses = async (title) => {
    setIsLoading(true);
    try {
      const courses = await getProgramCoursesS({ programsTitles: [title]});
      setProgramCourses(courses);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  // Regroupement par obligatoire/optionnel si disponible, sinon affichage plat
  const grouped = programCourses.reduce((acc, c) => {
    const key = c.courseType || c.programTitle || "Cours";
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  const done    = programCourses.filter((c) => getCourseStatus(c.sigle, studentCourses) === "done").length;
  const ongoing = programCourses.filter((c) => getCourseStatus(c.sigle, studentCourses) === "ongoing").length;
  const total   = programCourses.length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar user={user} profilePic={userPicture} />

      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <p className="text-sm font-semibold text-slate-900">Cheminement académique</p>
            <p className="text-xs text-slate-400">Progression dans ton programme</p>
          </div>
          {programs.length > 1 && (
            <ProgramDropdown
              programs={programs}
              selected={selectedProgram}
              onSelect={setSelectedProgram}
            />
          )}
        </div>

        <div className="p-8 flex flex-col gap-6 max-w-6xl">

          {/* ── En-tête programme sélectionné ── */}
          {selectedProgram && (
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Programme actif</p>
                  <h2 className="text-lg font-bold text-slate-900">{selectedProgram.title}</h2>
                  <p className="text-sm text-slate-500 mt-0.5">{selectedProgram.programName} · {selectedProgram.faculty}</p>
                </div>
                <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-full">
                  {selectedProgram.grade}
                </span>
              </div>
              <ProgressBar done={done} ongoing={ongoing} total={total} />
            </div>
          )}

          {/* ── Grille de cours ── */}
          {isLoading ? (
            <div className="text-sm text-slate-400">Chargement des cours...</div>
          ) : (
            Object.entries(grouped).map(([group, courses]) => (
              <div key={group}>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">{group}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {courses.map((course, i) => {
                    const status = getCourseStatus(course.sigle, studentCourses);
                    const s = STATUS_STYLE[status];
                    return (
                      <div
                        key={i}
                        className={`border rounded-xl p-4 flex flex-col gap-2 transition-all ${s.card}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-slate-700 font-mono">{course.sigle}</span>
                          <div className={`w-2 h-2 rounded-full shrink-0 mt-0.5 ${s.dot}`} />
                        </div>
                        <p className="text-xs text-slate-600 leading-snug line-clamp-3">{course.fullName}</p>
                        <div className="mt-auto pt-1">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.badge}`}>
                            {status === "done" && <span className="inline-flex items-center gap-1"><HiCheck className="w-3 h-3" />{s.label}</span>}
                            {status === "ongoing" && <span className="inline-flex items-center gap-1"><HiClock className="w-3 h-3" />{s.label}</span>}
                            {status === "pending" && s.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          {!isLoading && programCourses.length === 0 && (
            <div className="text-sm text-slate-400">Aucun cours trouvé pour ce programme.</div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Progress;