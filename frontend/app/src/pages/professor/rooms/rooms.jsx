import Sidebar from "../../sidebar/sidebar";
import profPicture from "../../../assets/img/Professor.jpg";
import { useEffect, useState } from "react";
import { HiSearch, HiX, HiCheck } from "react-icons/hi";
import { getClassroomsS, getClassesCoursesS } from "../../../services/course.service";

const DAYS   = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const PLAGES = ["09:30–12:30", "13:30–16:30", "18:00–21:00"];
const SESSIONS = ["Hiver", "Été", "Automne"];

const parseTime = (t) => {
  if (!t) return 0;
  const [h, m] = t.replace("h", ":").split(":").map(Number);
  return h + (m || 0) / 60;
};

const plageOverlaps = (plage, courseStart, courseEnd) => {
  const [ps, pe] = plage.split("–").map(parseTime);
  const cs = parseTime(courseStart);
  const ce = parseTime(courseEnd);
  return cs < pe && ce > ps;
};

const ProfessorRooms = ({ employeeCo }) => {
  const [rooms, setRooms]               = useState([]);
  const [allCourses, setAllCourses]     = useState([]);
  const [search, setSearch]             = useState("");
  const [filterType, setFilterType]     = useState("");
  const [selectedDay, setSelectedDay]   = useState("");
  const [selectedPlage, setSelectedPlage] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [isLoading, setIsLoading]       = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [rms, courses] = await Promise.all([getClassroomsS(), getClassesCoursesS("")]);
      setRooms(Array.isArray(rms) ? rms : []);
      setAllCourses(Array.isArray(courses) ? courses : courses?.courses ?? courses?.data ?? []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const types = [...new Set(rooms.map((r) => r.typeOfClasse).filter(Boolean))];

  // Vérifie si une salle est occupée au créneau sélectionné
  const isOccupied = (room) => {
    if (!selectedDay || !selectedPlage || !selectedSession) return null; // pas encore filtré
    return allCourses.some((c) =>
      c.classeName === room.classeName &&
      c.jours?.toLowerCase() === selectedDay.toLowerCase() &&
      c.sessionCourse === selectedSession &&
      plageOverlaps(selectedPlage, c.startTime, c.endTime)
    );
  };

  // Cours qui occupent cette salle au créneau
  const getOccupant = (room) => {
    if (!selectedDay || !selectedPlage || !selectedSession) return null;
    return allCourses.find((c) =>
      c.classeName === room.classeName &&
      c.jours?.toLowerCase() === selectedDay.toLowerCase() &&
      c.sessionCourse === selectedSession &&
      plageOverlaps(selectedPlage, c.startTime, c.endTime)
    );
  };

  const filteredRooms = rooms.filter((r) => {
    const matchSearch = !search || r.classeName?.toUpperCase().includes(search.toUpperCase());
    const matchType   = !filterType || r.typeOfClasse === filterType;
    return matchSearch && matchType;
  });

  const hasFilter    = selectedDay && selectedPlage && selectedSession;
  const availableCount = hasFilter ? filteredRooms.filter((r) => !isOccupied(r)).length : null;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar userCo={employeeCo} profilePic={profPicture} />

      <main className="flex-1 overflow-y-auto">

        {/* Top bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <p className="text-sm font-semibold text-slate-900">Disponibilité des salles</p>
            <p className="text-xs text-slate-400">
              {hasFilter
                ? `${availableCount} salle${availableCount > 1 ? "s" : ""} disponible${availableCount > 1 ? "s" : ""} — ${selectedDay} · ${selectedPlage} · ${selectedSession}`
                : "Choisissez un créneau pour voir les disponibilités"}
            </p>
          </div>
        </div>

        <div className="p-8 max-w-5xl flex flex-col gap-6">

          {/* ── Filtres créneau ── */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Choisir un créneau</p>
            <div className="grid sm:grid-cols-3 gap-4">

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Session</label>
                <div className="flex gap-2 flex-wrap">
                  {SESSIONS.map((s) => (
                    <button key={s} onClick={() => setSelectedSession(selectedSession === s ? "" : s)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${selectedSession === s ? "bg-blue-800 text-white border-blue-800" : "bg-white text-slate-600 border-slate-200 hover:border-blue-700"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Jour</label>
                <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white">
                  <option value="">Tous les jours</option>
                  {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Plage horaire</label>
                <select value={selectedPlage} onChange={(e) => setSelectedPlage(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white">
                  <option value="">Toutes les plages</option>
                  {PLAGES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

            </div>
          </div>

          {/* ── Filtres salles ── */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une salle..."
                className="pl-9 pr-8 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 transition w-56" />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"><HiX className="w-4 h-4" /></button>}
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setFilterType("")}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${!filterType ? "bg-blue-800 text-white border-blue-800" : "bg-white text-slate-600 border-slate-200 hover:border-blue-700"}`}>
                Tous les types
              </button>
              {types.map((t) => (
                <button key={t} onClick={() => setFilterType(filterType === t ? "" : t)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${filterType === t ? "bg-blue-800 text-white border-blue-800" : "bg-white text-slate-600 border-slate-200 hover:border-blue-700"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* ── Grille des salles ── */}
          {isLoading ? (
            <p className="text-sm text-slate-400">Chargement...</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRooms.map((room) => {
                const occupied  = isOccupied(room);
                const occupant  = getOccupant(room);
                const statusKnown = hasFilter;

                return (
                  <div key={room.classeName}
                    className={`bg-white border rounded-xl p-5 flex flex-col gap-3 transition-colors ${
                      !statusKnown  ? "border-slate-200" :
                      occupied      ? "border-red-200 bg-red-50/30" :
                                      "border-green-200 bg-green-50/30"
                    }`}>

                    {/* Header salle */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900 font-mono">{room.classeName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{room.typeOfClasse}</p>
                      </div>
                      {statusKnown && (
                        <span className={`text-xs font-semibold border px-2 py-0.5 rounded-full shrink-0 ${
                          occupied
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}>
                          {occupied ? "Occupée" : "Disponible"}
                        </span>
                      )}
                    </div>

                    {/* Capacité */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="font-medium text-slate-700">{room.capacity}</span> places
                    </div>

                    {/* Occupant si occupée */}
                    {statusKnown && occupied && occupant && (
                      <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                        <p className="text-xs font-semibold text-red-700">{occupant.courseSigle}</p>
                        <p className="text-xs text-red-500 mt-0.5">{occupant.programTitle}</p>
                        <p className="text-xs text-red-400">{occupant.startTime}–{occupant.endTime}</p>
                      </div>
                    )}

                    {/* Disponible */}
                    {statusKnown && !occupied && (
                      <div className="flex items-center gap-1.5 text-xs text-green-700 font-medium">
                        <HiCheck className="w-3.5 h-3.5" />
                        Libre à ce créneau
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default ProfessorRooms;