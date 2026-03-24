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
  const [cartToDrop, setCartToDrop]                 = useState([]);

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

  const activeUserCourses = userCourses.filter(
    (uc) => !cartToDrop.find((ctd) => ctd.ccourseId === uc.id)
  );

  // Calcul du label du bouton
  const getSubmitButtonLabel = () => {
    if (cart.length > 0 && cartToDrop.length > 0) return "Confirmer les modifications";
    if (cartToDrop.length > 0) return "Confirmer l'abandon";
    return "Confirmer l'inscription";
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

  const dropCourse = (course) => {
    setCartToDrop((prev) => [...prev, {
      ccourseId: course.id,
      sigle: course.sigle,
      fullName: course.fullName,
      credits: course.credits,
      jours: course.jours,
      startTime: course.startTime,
      endTime: course.endTime,
    }])
  }

  const removeFromDropCart = (ccourseId) => {
    setCartToDrop((prev) => prev.filter((c) => c.ccourseId !== ccourseId));
  };

  const registerCourses = async () => {
    if (cart.length === 0 && cartToDrop.length === 0) return;
    try {
      const res = await enrollStudentsInCoursesS({
        cCourseIdsToAdd: cart.map((c) => c.ccourseId) || null,
        cCourseIdsToDrop: cartToDrop.map((ctd) => ctd.ccourseId) || null,
        permanentCodes: [userCo.permanentCode],
        programTitle: selectedProgram || programs[0].title
      });
      if (res.success) {
        addAlert("success", "Inscription confirmée.");
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
  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
    <p className="text-sm font-semibold text-slate-900">Mes cours inscrits</p>
    <span className="text-xs font-medium text-slate-500">{activeUserCourses.length} / {MAX_COURSES}</span>
  </div>
  {activeUserCourses.length === 0 ? (
    <p className="px-5 py-8 text-center text-sm text-slate-400">Aucun cours actif.</p>
  ) : (
    <table className="w-full text-sm">
      <tbody className="divide-y divide-slate-100">
        {activeUserCourses.map((c) => (
          <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
            <td className="py-3 px-5 font-mono text-xs font-bold text-blue-700 w-24">{c.courseSigle}</td>
            <td className="py-3 px-5 text-slate-600">{c.classeName}</td>
            <td className="py-3 px-5 text-slate-400 text-xs">{c.jours} · {c.startTime}–{c.endTime}</td>
            <td className="py-3 px-5 text-right">
              <button 
                onClick={() => dropCourse(c)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Abandonner ce cours"
              >
                <HiTrash className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>

{/* ── 2. SECTION ABANDON (À AFFICHER SEULEMENT SI CARTTODROP > 0) ── */}
{cartToDrop.length > 0 && (
  <div className="bg-red-50 border border-red-100 rounded-xl overflow-hidden ring-1 ring-red-200">
    <div className="px-5 py-3 border-b border-red-100 flex items-center gap-2">
      <HiExclamation className="text-red-500 w-4 h-4" />
      <p className="text-sm font-bold text-red-800">Cours à abandonner</p>
    </div>
    <table className="w-full text-sm">
      <tbody>
        {cartToDrop.map((c) => (
          <tr key={c.ccourseId} className="bg-red-50/30">
            <td className="py-3 px-5 font-mono text-xs font-bold text-red-700 w-24 line-through opacity-60">{c.sigle}</td>
            <td className="py-3 px-5 text-red-800/70 text-xs italic">La désinscription sera effective après confirmation.</td>
            <td className="py-3 px-5 text-right">
              <button 
                onClick={() => removeFromDropCart(c.ccourseId)}
                className="text-xs font-semibold text-red-800 underline hover:no-underline"
              >
                Annuler l'abandon
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

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
              <div className="bg-white border-2 border-blue-100 rounded-xl overflow-hidden shadow-sm">
  <div className="px-5 py-4 border-b border-slate-100 bg-blue-50/30">
    <p className="text-sm font-semibold text-slate-900">Résumé des modifications</p>
  </div>
  
  {/* Liste des nouveaux cours à ajouter */}
  {cart.length > 0 ? (
     <div className="divide-y divide-slate-50">
        {cart.map((c) => (
          <div key={c.ccourseId} className="px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded">AJOUT</span>
              <span className="font-mono text-xs font-bold">{c.sigle}</span>
              <span className="text-xs text-slate-500">{c.fullName}</span>
            </div>
            <button onClick={() => removeFromCart(c.ccourseId)} className="text-slate-300 hover:text-red-500">
              <HiX className="w-4 h-4" />
            </button>
          </div>
        ))}
     </div>
  ) : cartToDrop.length === 0 && (
    <p className="px-5 py-6 text-center text-sm text-slate-400 italic">Aucune modification en attente.</p>
  )}

  <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
    <div className="text-xs text-slate-500">
      {cart.length > 0 && <span>+{cart.length} inscription(s) </span>}
      {cartToDrop.length > 0 && <span className="text-red-600 ml-2">-{cartToDrop.length} abandon(s)</span>}
    </div>
    <button
      onClick={registerCourses}
      disabled={cart.length === 0 && cartToDrop.length === 0}
      className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-bold px-6 py-2.5 rounded-lg transition-all shadow-md"
    >
      <HiCheck className="w-4 h-4" />
      {getSubmitButtonLabel()}
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