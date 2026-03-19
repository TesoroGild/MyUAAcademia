import "./space.css";
import Sidebar from "../sidebar/sidebar";
import userPicture from '../../assets/img/User_Icon.png';

// Données fictives — à remplacer par tes vrais appels API
const MOCK_EVENTS = [
  { date: "20 mars", label: "Examen final — INF3405", type: "exam" },
  { date: "25 mars", label: "Remise TP3 — MAT2440", type: "deadline" },
  { date: "2 avr.",  label: "Semaine de relâche", type: "info" },
];

const EVENT_STYLES = {
  exam:     "bg-red-50 text-red-700 border-red-100",
  deadline: "bg-amber-50 text-amber-700 border-amber-100",
  info:     "bg-blue-50 text-blue-700 border-blue-100",
};

const StatCard = ({ label, value, sub }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-1">
    <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</span>
    <span className="text-2xl font-bold text-slate-900">{value}</span>
    {sub && <span className="text-xs text-slate-400">{sub}</span>}
  </div>
);

const StudentSpace = ({ userCo }) => {
  const firstName = userCo?.firstName ?? "Étudiant";

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* Sidebar */}
      <Sidebar userCo={userCo} profilePic={userPicture} />

      {/* Main */}
      <main className="flex-1 overflow-y-auto">

        {/* Top bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shrink-0 sticky top-0 z-10">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Bonjour, {firstName} 👋
            </p>
            <p className="text-xs text-slate-400">Session Hiver 2025</p>
          </div>
        </div>

        <div className="p-8 flex flex-col gap-8">

          {/* ── Stats ── */}
          <section>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
              Dossier académique
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Crédits complétés"  value={userCo?.creditsCompleted ?? "—"} sub="sur 90 requis" />
              <StatCard label="Moyenne générale"   value={userCo?.gpa ?? "—"}             sub="sur 4.0" />
              <StatCard label="Cours actifs"        value={userCo?.activeCourses ?? "—"}   sub="ce trimestre" />
              <StatCard label="Statut"              value="Actif"                           sub="Inscrit au programme" />
            </div>
          </section>

          <div className="grid lg:grid-cols-3 gap-6">

            {/* ── Cours en cours ── */}
            <section className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Cours en cours</h2>
              {userCo?.courses?.length > 0 ? (
                <div className="flex flex-col divide-y divide-slate-100">
                  {userCo.courses.map((course) => (
                    <div key={course.sigle} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{course.name}</p>
                        <p className="text-xs text-slate-400">{course.sigle} · {course.professor}</p>
                      </div>
                      <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded-full">
                        {course.schedule}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-400 py-4 text-center">
                  Aucun cours chargé — connecte tes données API ici.
                </div>
              )}
            </section>

            {/* ── Événements ── */}
            <section className="bg-white border border-slate-200 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">À venir</h2>
              <div className="flex flex-col gap-3">
                {MOCK_EVENTS.map((ev) => (
                  <div
                    key={ev.label}
                    className={`flex items-start gap-3 border rounded-lg px-3 py-2.5 ${EVENT_STYLES[ev.type]}`}
                  >
                    <span className="text-xs font-semibold shrink-0 mt-0.5">{ev.date}</span>
                    <span className="text-xs leading-relaxed">{ev.label}</span>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentSpace;