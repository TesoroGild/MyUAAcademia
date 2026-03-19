import Sidebar from "../sidebar/sidebar";
import userPicture from "../../assets/img/User_Icon.png";
import React, { useEffect, useState } from "react";
import { HiCheck, HiExclamation, HiX, HiPlus, HiTrash, HiChevronDown, HiAcademicCap } from "react-icons/hi";
import { getAvailableCoursesS, getStudentSessionCoursesS, enrollStudentsInCoursesS } from "../../services/course.service";
import { getStudentProgramsS } from "../../services/program.service";

// ── Périodes d'inscription (testing) ─────────────────────────────────────────
const today = new Date();
const year  = today.getFullYear();
const PERIODS = [
  { session: "Hiver",   start: new Date("2026-01-05"), end: new Date("2026-04-27") },
  { session: "Été",     start: new Date("2026-05-02"), end: new Date("2026-08-15") },
  { session: "Automne", start: new Date("2025-09-02"), end: new Date("2025-12-20") },
];
const MAX_COURSES = 5;

const getActiveSessions = () => PERIODS.filter((p) => p.start <= today && today <= p.end);

// ── Toast inline ──────────────────────────────────────────────────────────────
const InlineAlert = ({ type, message, onClose }) => {
  const styles = {
    error:   "bg-red-50 border-red-200 text-red-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
    success: "bg-green-50 border-green-200 text-green-700",
  };
  const icons = {
    error:   <HiX className="w-4 h-4 shrink-0" />,
    warning: <HiExclamation className="w-4 h-4 shrink-0" />,
    success: <HiCheck className="w-4 h-4 shrink-0" />,
  };
  return (
    <div className={`flex items-center gap-2 border rounded-lg px-4 py-3 text-sm ${styles[type]}`}>
      {icons[type]}
      <span className="flex-1">{message}</span>
      {onClose && <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><HiX className="w-3.5 h-3.5" /></button>}
    </div>
  );
};

// ── Dropdown programme ────────────────────────────────────────────────────────
const ProgramDropdown = ({ programs, selected, onSelect }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-700 text-sm font-medium text-slate-700 px-4 py-2.5 rounded-lg transition-colors"
      >
        <HiAcademicCap className="w-4 h-4 text-blue-700" />
        <span>{selected?.title ?? "Tous les programmes"}</span>
        <HiChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-slate-200 rounded-xl shadow-lg min-w-[240px] py-1">
          <button
            onClick={() => { onSelect(null); setOpen(false); }}
            className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 ${!selected ? "text-blue-800 font-medium" : "text-slate-700"}`}
          >
            Tous les programmes
          </button>
          {programs.map((p) => (
            <button
              key={p.title}
              onClick={() => { onSelect(p); setOpen(false); }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-slate-50 ${selected?.title === p.title ? "text-blue-800 font-medium" : "text-slate-700"}`}
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

// ── Page principale ───────────────────────────────────────────────────────────
const Subscribe = ({ userCo }) => {
  const activeSessions = getActiveSessions();

  const [coursesAvailable, setCoursesAvailable]     = useState([]);
  const [filteredCourses, setFilteredCourses]       = useState([]);
  const [userCourses, setUserCourses]               = useState([]);
  const [programs, setPrograms]                     = useState([]); // objets { title, programName }
  const [selectedProgram, setSelectedProgram]       = useState(null); // objet ou null
  const [cart, setCart]                             = useState([]);      // { ccourseId, sigle, fullName, credits, jours, startTime, endTime }
  const [alerts, setAlerts]                         = useState([]);      // { id, type, message }
  const [isLoading, setIsLoading]                   = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterByProgram(selectedProgram);
  }, [selectedProgram, coursesAvailable]);

  const addAlert = (type, message) => {
    const id = Date.now();
    setAlerts((a) => [...a, { id, type, message }]);
    setTimeout(() => setAlerts((a) => a.filter((x) => x.id !== id)), 5000);
  };
  const removeAlert = (id) => setAlerts((a) => a.filter((x) => x.id !== id));

  const loadData = async () => {
    setIsLoading(true);
    try {
      const sc = activeSessions[0]?.session;
      if (sc) {
        const res = await getStudentSessionCoursesS({
          permanentCode: userCo.permanentCode,
          yearCourse: year + "",
          sessionCourse: sc,
        });
        if (res.success) setUserCourses(res.courses);
      }

      // Programmes inscrits (pour la dropdown)
      const progRes = await getStudentProgramsS(userCo.permanentCode);
      if (progRes.success) {
        const enrolled = progRes.programs.filter((p) => p.isEnrolled);
        setPrograms(enrolled);
        // Sélectionne le premier programme par défaut si plusieurs
        if (enrolled.length > 1) setSelectedProgram(enrolled[0]);
      }

      const availablePeriods = {
        winter: activeSessions.some((p) => p.session === "Hiver"),
        summer: activeSessions.some((p) => p.session === "Été"),
        autumn: activeSessions.some((p) => p.session === "Automne"),
      };

      const response = await getAvailableCoursesS(availablePeriods, userCo.permanentCode);
      setCoursesAvailable(response);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const filterByProgram = (program) => {
    if (!program) { setFilteredCourses(coursesAvailable); return; }
    setFilteredCourses(
      coursesAvailable.filter((c) =>
        c.programTitle?.toLowerCase() === program.title?.toLowerCase()
      )
    );
  };

  const addToCart = (course) => {
    if (userCourses.length + cart.length >= MAX_COURSES) {
      addAlert("error", `Maximum de ${MAX_COURSES} cours atteint pour cette session.`);
      return;
    }
    // Conflit horaire
    const conflict = cart.find((c) => c.jours === course.jours && c.startTime === course.startTime);
    if (conflict) {
      addAlert("error", `Conflit d'horaire avec ${conflict.sigle} (${conflict.jours} ${conflict.startTime}).`);
      return;
    }
    setCart((prev) => [...prev, {
      ccourseId: course.id,
      sigle: course.sigle,
      fullName: course.fullName,
      credits: course.credits,
      jours: course.jours,
      startTime: course.startTime,
      endTime: course.endTime,
    }]);
  };

  const removeFromCart = (ccourseId) => {
    setCart((prev) => prev.filter((c) => c.ccourseId !== ccourseId));
  };

  const registerCourses = async () => {
    if (cart.length === 0) return;
    try {
      const res = await enrollStudentsInCoursesS({
        cCourseIds: cart.map((c) => c.ccourseId),
        permanentCodes: [userCo.permanentCode],
      });
      if (res.success) {
        addAlert("success", "Inscription confirmée avec succès.");
        setCart([]);
        loadData();
      } else {
        addAlert("error", res.message);
      }
    } catch {
      addAlert("warning", "Impossible de contacter le serveur. Veuillez réessayer.");
    }
  };

  const displayedCourses = filteredCourses.filter(
    (c) =>
      !userCourses.find((uc) => uc.courseSigle === c.sigle) &&
      !cart.find((cc) => cc.sigle === c.sigle)
  );

  const totalCartCredits = cart.reduce((acc, c) => acc + (c.credits || 0), 0);
  const canEnroll        = userCourses.length < MAX_COURSES;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar userCo={userCo} profilePic={userPicture} />

      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-8 sticky top-0 z-10">
          <div>
            <p className="text-sm font-semibold text-slate-900">Inscription aux cours</p>
            <p className="text-xs text-slate-400">Session {activeSessions[0]?.session ?? "—"} {year}</p>
          </div>
        </div>

        <div className="p-8 flex flex-col gap-6 max-w-6xl">

          {/* ── Alertes ── */}
          {alerts.length > 0 && (
            <div className="flex flex-col gap-2">
              {alerts.map((a) => (
                <InlineAlert key={a.id} type={a.type} message={a.message} onClose={() => removeAlert(a.id)} />
              ))}
            </div>
          )}

          {/* ── Indicateurs de session ── */}
          <div className="flex gap-3 flex-wrap">
            {PERIODS.map((p) => {
              const active = p.start <= today && today <= p.end;
              return (
                <div
                  key={p.session}
                  className={`flex items-center gap-2 border rounded-lg px-4 py-2 text-sm font-medium ${
                    active
                      ? "bg-blue-50 border-blue-200 text-blue-800"
                      : "bg-white border-slate-200 text-slate-400"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${active ? "bg-blue-600" : "bg-slate-300"}`} />
                  {p.session}
                  {active && <span className="text-xs font-normal text-blue-600">Inscriptions ouvertes</span>}
                </div>
              );
            })}
          </div>

          {/* ── Hors période ── */}
          {activeSessions.length === 0 && (
            <InlineAlert type="warning" message="Les inscriptions aux cours ne sont pas ouvertes en ce moment." />
          )}

          {/* ── Mes cours actuels ── */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Mes cours — {activeSessions[0]?.session ?? "session en cours"}</p>
              <span className={`text-xs font-medium border px-2 py-0.5 rounded-full ${
                userCourses.length >= MAX_COURSES
                  ? "bg-red-50 text-red-700 border-red-100"
                  : "bg-slate-100 text-slate-500 border-slate-200"
              }`}>
                {userCourses.length} / {MAX_COURSES} cours
              </span>
            </div>
            {userCourses.length === 0 ? (
              <p className="px-5 py-4 text-sm text-slate-400">Aucun cours inscrit pour cette session.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-5 text-xs text-slate-400 font-medium uppercase tracking-wide">Sigle</th>
                    <th className="text-left py-3 px-5 text-xs text-slate-400 font-medium uppercase tracking-wide">Cours</th>
                    <th className="text-left py-3 px-5 text-xs text-slate-400 font-medium uppercase tracking-wide">Salle</th>
                    <th className="text-left py-3 px-5 text-xs text-slate-400 font-medium uppercase tracking-wide">Horaire</th>
                  </tr>
                </thead>
                <tbody>
                  {userCourses.map((c, i) => (
                    <tr key={i} className={`border-b border-slate-50 last:border-0 ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                      <td className="py-3 px-5 font-mono text-xs font-semibold text-slate-700">{c.courseSigle}</td>
                      <td className="py-3 px-5 text-slate-700">{c.fullName}</td>
                      <td className="py-3 px-5 text-slate-500">{c.classeName}</td>
                      <td className="py-3 px-5 text-slate-500">{c.jours} · {c.startTime}–{c.endTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ── Section inscription ── */}
          {canEnroll && activeSessions.length > 0 && (
            <>
              {/* Filtre programme — dropdown si plusieurs programmes */}
              {programs.length > 1 && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-medium">Programme :</span>
                  <ProgramDropdown
                    programs={programs}
                    selected={selectedProgram}
                    onSelect={setSelectedProgram}
                  />
                </div>
              )}

              {/* Table cours disponibles */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">Cours disponibles</p>
                  <p className="text-xs text-slate-400 mt-0.5">Cliquez sur + pour ajouter un cours à votre sélection.</p>
                </div>
                {isLoading ? (
                  <p className="px-5 py-4 text-sm text-slate-400">Chargement...</p>
                ) : displayedCourses.length === 0 ? (
                  <p className="px-5 py-4 text-sm text-slate-400">Aucun cours disponible.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-3 px-5 text-xs text-slate-400 font-medium uppercase tracking-wide">Sigle</th>
                        <th className="text-left py-3 px-5 text-xs text-slate-400 font-medium uppercase tracking-wide">Titre</th>
                        <th className="text-center py-3 px-5 text-xs text-slate-400 font-medium uppercase tracking-wide">Crédits</th>
                        <th className="text-left py-3 px-5 text-xs text-slate-400 font-medium uppercase tracking-wide">Horaire</th>
                        <th className="py-3 px-5" />
                      </tr>
                    </thead>
                    <tbody>
                      {displayedCourses.map((c, i) => (
                        <tr key={i} className={`border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${i % 2 === 1 ? "bg-slate-50/40" : ""}`}>
                          <td className="py-3 px-5 font-mono text-xs font-semibold text-slate-700">{c.sigle}</td>
                          <td className="py-3 px-5 text-slate-700">{c.fullName}</td>
                          <td className="py-3 px-5 text-center text-slate-500">{c.credits}</td>
                          <td className="py-3 px-5 text-slate-500 text-xs">{c.jours} · {c.startTime}–{c.endTime}</td>
                          <td className="py-3 px-5 text-right">
                            <button
                              onClick={() => addToCart(c)}
                              className="flex items-center gap-1 ml-auto text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 hover:bg-blue-800 hover:text-white hover:border-blue-800 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <HiPlus className="w-3.5 h-3.5" />
                              Ajouter
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* ── Panier ── */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Ma sélection</p>
                    <p className="text-xs text-slate-400 mt-0.5">{cart.length} cours · {totalCartCredits} crédit{totalCartCredits > 1 ? "s" : ""}</p>
                  </div>
                </div>

                {cart.length === 0 ? (
                  <p className="px-5 py-4 text-sm text-slate-400">Aucun cours ajouté.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-3 px-5 text-xs text-slate-400 font-medium uppercase tracking-wide">Sigle</th>
                        <th className="text-left py-3 px-5 text-xs text-slate-400 font-medium uppercase tracking-wide">Titre</th>
                        <th className="text-center py-3 px-5 text-xs text-slate-400 font-medium uppercase tracking-wide">Crédits</th>
                        <th className="text-left py-3 px-5 text-xs text-slate-400 font-medium uppercase tracking-wide">Horaire</th>
                        <th className="py-3 px-5" />
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((c, i) => (
                        <tr key={i} className={`border-b border-slate-50 last:border-0 ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                          <td className="py-3 px-5 font-mono text-xs font-semibold text-slate-700">{c.sigle}</td>
                          <td className="py-3 px-5 text-slate-700">{c.fullName}</td>
                          <td className="py-3 px-5 text-center text-slate-500">{c.credits}</td>
                          <td className="py-3 px-5 text-slate-500 text-xs">{c.jours} · {c.startTime}–{c.endTime}</td>
                          <td className="py-3 px-5 text-right">
                            <button
                              onClick={() => removeFromCart(c.ccourseId)}
                              className="flex items-center gap-1 ml-auto text-xs font-medium text-red-600 hover:text-red-800 transition-colors"
                            >
                              <HiTrash className="w-3.5 h-3.5" />
                              Retirer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <div className="px-5 py-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={registerCourses}
                    disabled={cart.length === 0}
                    className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                  >
                    <HiCheck className="w-4 h-4" />
                    Confirmer l'inscription
                  </button>
                </div>
              </div>
            </>
          )}

          {!canEnroll && (
            <InlineAlert type="warning" message={`Vous avez atteint le maximum de ${MAX_COURSES} cours pour cette session.`} />
          )}

        </div>
      </main>
    </div>
  );
};

export default Subscribe;