import "./space.css";
import Sidebar from "../sidebar/sidebar";
import adminPicture from "../../assets/img/Admin.jpg";

const StatCard = ({ label, value, sub, accent }) => (
  <div className={`bg-white border rounded-xl p-5 flex flex-col gap-1 ${accent ? "border-blue-200" : "border-slate-200"}`}>
    <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</span>
    <span className={`text-2xl font-bold ${accent ? "text-blue-800" : "text-slate-900"}`}>{value}</span>
    {sub && <span className="text-xs text-slate-400">{sub}</span>}
  </div>
);

const QuickAction = ({ label, to, icon: Icon }) => (
  <a
    href={to}
    className="flex items-center gap-3 border border-slate-200 hover:border-blue-700 hover:bg-blue-50 rounded-xl px-4 py-3 transition-all group"
  >
    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 group-hover:bg-blue-800 group-hover:text-white transition-colors shrink-0">
      <Icon className="w-4 h-4" />
    </div>
    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-800 transition-colors">
      {label}
    </span>
  </a>
);

// Données fictives — à brancher sur ton API
const RECENT_STUDENTS = [
  { name: "Marie Dupont",   code: "DUPM12345678", program: "Licence Informatique",   status: "Actif" },
  { name: "Jean Tremblay",  code: "TREJ87654321", program: "Master Gestion",         status: "Actif" },
  { name: "Amina Koné",     code: "KONA11223344", program: "BTS Comptabilité",       status: "En attente" },
  { name: "Lucas Bernard",  code: "BERL99887766", program: "Doctorat Sciences",      status: "Actif" },
];

const STATUS_STYLE = {
  "Actif":      "bg-green-50 text-green-700 border-green-100",
  "En attente": "bg-amber-50 text-amber-700 border-amber-100",
  "Suspendu":   "bg-red-50 text-red-700 border-red-100",
};

import {
  HiAcademicCap, HiUserAdd, HiClipboardList,
  HiPencilAlt, HiUserGroup, HiCalendar,
} from "react-icons/hi";

const AdminSpace = ({ employeeCo }) => {
  const firstName = employeeCo?.firstName ?? "Administrateur";

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* Sidebar */}
      <Sidebar userCo={employeeCo} profilePic={adminPicture} />

      {/* Main */}
      <main className="flex-1 overflow-y-auto">

        {/* Top bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-8 sticky top-0 z-10">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Bonjour, {firstName} 👋
            </p>
            <p className="text-xs text-slate-400">Tableau de bord — Administration</p>
          </div>
        </div>

        <div className="p-8 flex flex-col gap-8">

          {/* ── Stats ── */}
          <section>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
              Vue d'ensemble
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Étudiants inscrits"  value="3 214"  sub="cette session" accent />
              <StatCard label="Employés actifs"      value="187"    sub="dont 142 profs" />
              <StatCard label="Programmes actifs"    value="42"     sub="toutes filières" />
              <StatCard label="Cours en session"     value="318"    sub="Hiver 2025" />
            </div>
          </section>

          <div className="grid lg:grid-cols-3 gap-6">

            {/* ── Étudiants récents ── */}
            <section className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-900">Dossiers récents</h2>
                <a href="/employee/student/list" className="text-xs text-blue-700 hover:underline">
                  Voir tout →
                </a>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
                    <th className="text-left pb-3 font-medium">Étudiant</th>
                    <th className="text-left pb-3 font-medium">Programme</th>
                    <th className="text-left pb-3 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {RECENT_STUDENTS.map((s) => (
                    <tr key={s.code} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3">
                        <p className="font-medium text-slate-900">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.code}</p>
                      </td>
                      <td className="py-3 text-slate-600 text-xs">{s.program}</td>
                      <td className="py-3">
                        <span className={`text-xs font-medium border px-2 py-0.5 rounded-full ${STATUS_STYLE[s.status]}`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* ── Actions rapides ── */}
            <section className="bg-white border border-slate-200 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Actions rapides</h2>
              <div className="flex flex-col gap-3">
                <QuickAction label="Créer un dossier étudiant" to="/employee/student/create"      icon={HiUserAdd} />
                <QuickAction label="Inscrire à un programme"   to="/employee/student/inscription" icon={HiAcademicCap} />
                <QuickAction label="Attribuer un professeur"   to="/employee/employee/assign-course" icon={HiPencilAlt} />
                <QuickAction label="Gérer les programmes"      to="/employee/program/program"     icon={HiClipboardList} />
                <QuickAction label="Liste des employés"        to="/employee/employee/list"       icon={HiUserGroup} />
                <QuickAction label="Planning"                  to="/adminplanning"                icon={HiCalendar} />
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSpace;