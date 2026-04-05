import Sidebar from "../sidebar/sidebar";
import userPicture from "../../assets/img/User_Icon.png";
import { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { getStudentSessionCoursesS } from "../../services/course.service";

// ── Config ───────────────────────────────────────────────────────────────────
const today = new Date();
const year  = today.getFullYear();

const PERIODS = [
  { session: "Hiver",   start: new Date("2026-01-05"), end: new Date("2026-04-27") },
  { session: "Été",     start: new Date("2026-05-02"), end: new Date("2026-08-15") },
  { session: "Automne", start: new Date("2025-09-02"), end: new Date("2025-12-20") },
];

const DAYS   = ["Lun", "Mar", "Mer", "Jeu", "Ven"];
const HOURS  = Array.from({ length: 13 }, (_, i) => i + 8); // 8h → 20h

// Correspondance jours texte → index (0 = lundi)
const DAY_MAP = {
  lundi: 0, mardi: 1, mercredi: 2, jeudi: 3, vendredi: 4,
  monday: 0, tuesday: 1, wednesday: 2, thursday: 3, friday: 4,
  lun: 0, mar: 1, mer: 2, jeu: 3, ven: 4,
};

const parseTime = (t) => {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h + (m || 0) / 60;
};

const getActiveSession = () =>
  PERIODS.find((p) => p.start <= today && today <= p.end) ?? null;

// Lundi de la semaine contenant `date`
const getMondayOf = (date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 = dimanche
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

const fmtDate = (date) =>
  date.toLocaleDateString("fr-CA", { day: "numeric", month: "short" });

// Couleurs des cours (rotation)
const COLORS = [
  "bg-blue-100 border-blue-300 text-blue-800",
  "bg-violet-100 border-violet-300 text-violet-800",
  "bg-teal-100 border-teal-300 text-teal-800",
  "bg-amber-100 border-amber-300 text-amber-800",
  "bg-rose-100 border-rose-300 text-rose-800",
];

// ── Composant principal ───────────────────────────────────────────────────────
const StudentPlanning = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [weekStart, setWeekStart] = useState(() => {
    const session = getActiveSession();
    const base    = session ? new Date(Math.max(session.start, today)) : today;
    return getMondayOf(base);
  });

  const activeSession = getActiveSession();

  useEffect(() => {
    if (activeSession) loadCourses(activeSession.session);
  }, []);

  const loadCourses = async (session) => {
    try {
      const res = await getStudentSessionCoursesS({
        permanentCode: user.permanentCode,
        yearCourse: year + "",
        sessionCourse: session,
      });
      if (res.success) setCourses(res.courses);
    } catch (e) { console.error(e); }
  };

  // Bornes de navigation
  const sessionStart = activeSession ? getMondayOf(activeSession.start) : getMondayOf(today);
  const sessionEnd   = activeSession ? activeSession.end                 : addDays(today, 90);

  const canPrev = weekStart > sessionStart;
  const canNext = addDays(weekStart, 7) <= sessionEnd;

  const prevWeek = () => canPrev && setWeekStart(addDays(weekStart, -7));
  const nextWeek = () => canNext && setWeekStart(addDays(weekStart, 7));

  // Jours affichés (lun → ven)
  const weekDays = DAYS.map((_, i) => addDays(weekStart, i));
  const isToday  = (date) => date.toDateString() === today.toDateString();

  // Mapping cours → couleur fixe
  const colorMap = Object.fromEntries(
    courses.map((c, i) => [c.courseSigle, COLORS[i % COLORS.length]])
  );

  // Positionne un cours dans la grille
  const getCourseBlock = (course, dayIdx) => {
    const dayKey  = (course.jours ?? "").toLowerCase().trim();
    const cDayIdx = DAY_MAP[dayKey] ?? -1;
    if (cDayIdx !== dayIdx) return null;

    const start = parseTime(course.startTime);
    const end   = parseTime(course.endTime);
    if (!start || !end || start < 8 || end > 21) return null;

    const top    = (start - 8) * 56; // 56px par heure
    const height = (end - start) * 56;
    return { top, height };
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar user={user} profilePic={userPicture} />

      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <p className="text-sm font-semibold text-slate-900">Calendrier</p>
            <p className="text-xs text-slate-400">
              {activeSession
                ? `${activeSession.session} ${year} · ${fmtDate(activeSession.start)} – ${fmtDate(activeSession.end)}`
                : "Aucune session active"}
            </p>
          </div>
          {/* Navigation semaine */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevWeek}
              disabled={!canPrev}
              className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <HiChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <span className="text-sm font-medium text-slate-700 min-w-[180px] text-center">
              {fmtDate(weekStart)} – {fmtDate(addDays(weekStart, 4))}
            </span>
            <button
              onClick={nextWeek}
              disabled={!canNext}
              className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <HiChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        {!activeSession && (
          <div className="p-8">
            <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-5 py-4 text-sm">
              Aucune session active en ce moment. Le calendrier sera disponible à l'ouverture de la prochaine session.
            </div>
          </div>
        )}

        {activeSession && (
          <div className="p-6 overflow-x-auto">
            <div className="min-w-[640px]">

              {/* ── En-têtes jours ── */}
              <div className="grid grid-cols-[56px_repeat(5,1fr)] mb-1">
                <div /> {/* colonne heures */}
                {weekDays.map((d, i) => (
                  <div
                    key={i}
                    className={`text-center py-2 text-xs font-semibold rounded-lg mx-0.5 ${
                      isToday(d)
                        ? "bg-blue-800 text-white"
                        : "text-slate-500"
                    }`}
                  >
                    <div>{DAYS[i]}</div>
                    <div className={`text-base font-bold mt-0.5 ${isToday(d) ? "text-white" : "text-slate-800"}`}>
                      {d.getDate()}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Grille ── */}
              <div className="grid grid-cols-[56px_repeat(5,1fr)] border border-slate-200 rounded-xl overflow-hidden bg-white">

                {/* Colonne heures */}
                <div className="border-r border-slate-100">
                  {HOURS.map((h) => (
                    <div key={h} className="h-14 flex items-start justify-end pr-3 pt-1">
                      <span className="text-xs text-slate-400">{h}h</span>
                    </div>
                  ))}
                </div>

                {/* Colonnes jours */}
                {weekDays.map((_, dayIdx) => (
                  <div key={dayIdx} className="relative border-r border-slate-100 last:border-0">

                    {/* Lignes horizontales */}
                    {HOURS.map((h) => (
                      <div key={h} className="h-14 border-b border-slate-50 last:border-0" />
                    ))}

                    {/* Blocs de cours */}
                    {courses.map((course) => {
                      const block = getCourseBlock(course, dayIdx);
                      if (!block) return null;
                      const color = colorMap[course.courseSigle];
                      return (
                        <div
                          key={course.courseSigle}
                          style={{ top: block.top, height: block.height }}
                          className={`absolute left-0.5 right-0.5 rounded-md border px-2 py-1 overflow-hidden ${color}`}
                        >
                          <p className="text-xs font-bold leading-tight truncate">{course.courseSigle}</p>
                          {block.height > 40 && (
                            <p className="text-xs leading-tight truncate opacity-80 mt-0.5">{course.fullName}</p>
                          )}
                          {block.height > 60 && (
                            <p className="text-xs opacity-60 mt-0.5">{course.startTime}–{course.endTime}</p>
                          )}
                        </div>
                      );
                    })}

                    {/* Ligne "maintenant" */}
                    {isToday(weekDays[dayIdx]) && (() => {
                      const now = today.getHours() + today.getMinutes() / 60;
                      if (now < 8 || now > 21) return null;
                      return (
                        <div
                          style={{ top: (now - 8) * 56 }}
                          className="absolute left-0 right-0 flex items-center z-10"
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0 -ml-1" />
                          <div className="flex-1 h-px bg-blue-500" />
                        </div>
                      );
                    })()}
                  </div>
                ))}
              </div>

              {/* ── Légende cours ── */}
              {courses.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {courses.map((c) => (
                    <div key={c.courseSigle} className={`flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs font-medium ${colorMap[c.courseSigle]}`}>
                      <span className="font-mono font-bold">{c.courseSigle}</span>
                      <span className="opacity-70">{c.fullName}</span>
                    </div>
                  ))}
                </div>
              )}

              {courses.length === 0 && (
                <p className="mt-6 text-sm text-slate-400 text-center">
                  Aucun cours inscrit pour cette session.
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentPlanning;