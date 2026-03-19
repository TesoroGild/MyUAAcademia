import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar } from "flowbite-react";
import { logoutS } from "../../services/auth.service";

// Icons
import {
  HiChartPie, HiUser, HiCurrencyDollar, HiClipboardList,
  HiLogout, HiChevronDown, HiChevronRight, HiAcademicCap,
  HiTable, HiChatAlt2, HiOutlineClipboardList, HiPencilAlt,
} from "react-icons/hi";
import { RiGraduationCapFill } from "react-icons/ri";
import { GiPathDistance } from "react-icons/gi";

// ── Nav config par rôle ──────────────────────────────────────────────────────

const getNavItems = (userCo) => {
  const role = userCo?.userRole?.toLowerCase();
  const code = userCo?.permanentCode || "";
  const empCode = userCo?.code || "";

  if (role === "student") return [
    { label: "Tableau de bord", icon: HiChartPie, to: "/studentspace" },
    { label: "Profil",          icon: HiUser,     to: `/student/${code}` },
    { label: "Factures",        icon: HiCurrencyDollar, to: "/bill/courses" },
    {
      label: "Cours", icon: RiGraduationCapFill,
      children: [
        { label: "Inscription",  to: "/subscribe" },
        { label: "Calendrier",   to: "/calendar" },
      ],
    },
    { label: "Cheminement", icon: GiPathDistance, to: "/progress" },
    { label: "Bulletin",    icon: HiClipboardList, to: "/bulletin" },
  ];

  if (role === "professor") return [
    { label: "Tableau de bord", icon: HiChartPie, to: "/professorspace" },
    { label: "Profil",          icon: HiUser,     to: `/employee/${empCode}` },
    {
      label: "Cours", icon: RiGraduationCapFill,
      children: [
        { label: "Dispensés",  to: "/professor/courses" },
        { label: "Calendrier",   to: "/professorplanning" },
        { label: "Salles",   to: "/professor/rooms" },
      ],
    },
    { label: "Planning",   icon: HiTable,    to: "/professorplanning" },
    { label: "Saisie des notes", icon: HiPencilAlt,  to: "/professor/grades" },
  ];

  // admin
  return [
    { label: "Tableau de bord", icon: HiChartPie, to: "/adminspace" },
    { label: "Profil",          icon: HiUser,     to: `/employee/${empCode}` },
    {
      label: "Programmes", icon: HiOutlineClipboardList,
      children: [
        { label: "Programmes",        to: "/employee/program/program" },
        { label: "Cours du programme",to: "/employee/program/class" },
        { label: "Cours de session",  to: "/employee/program/course" },
        { label: "Salles",            to: "/employee/program/classroom" },
      ],
    },
    {
      label: "Étudiants", icon: HiAcademicCap,
      children: [
        { label: "Dossiers étudiants",       to: "/employee/student/list" },
        { label: "Créer un dossier",         to: "/employee/student/create" },
        { label: "Inscription programme",    to: "/employee/student/inscription" },
        { label: "Inscription cours",        to: "/employee/student/course" },
      ],
    },
    {
      label: "Employés", icon: HiUser,
      children: [
        { label: "Liste des employés",  to: "/employee/employee/list" },
        { label: "Créer un employé",    to: "/employee/employee/create" },
        { label: "Attribuer un prof",   to: "/employee/employee/assign-course" },
      ],
    },
    { label: "Planning",   icon: HiTable,    to: "/adminplanning" },
  ];
};

// ── Composant item avec collapse ─────────────────────────────────────────────

const NavItem = ({ item }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const Icon = item.icon;

  const isActive = (to) => location.pathname === to;
  const isGroupActive = item.children?.some((c) => isActive(c.to));

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
            ${isGroupActive
              ? "bg-blue-50 text-blue-800"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
        >
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          <span className="flex-1 text-left">{item.label}</span>
          {open
            ? <HiChevronDown className="w-4 h-4 shrink-0" />
            : <HiChevronRight className="w-4 h-4 shrink-0" />
          }
        </button>
        {open && (
          <div className="ml-7 mt-1 flex flex-col gap-0.5 border-l border-slate-200 pl-3">
            {item.children.map((child) => (
              <Link
                key={child.to}
                to={child.to}
                className={`text-sm py-2 px-2 rounded-md transition-colors
                  ${isActive(child.to)
                    ? "text-blue-800 font-medium bg-blue-50"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  }`}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
        ${isActive(item.to)
          ? "bg-blue-50 text-blue-800"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>{item.label}</span>
    </Link>
  );
};

// ── Composant principal ───────────────────────────────────────────────────────

const Sidebar = ({ userCo, profilePic }) => {
  const navigate = useNavigate();
  const role = userCo?.userRole?.toLowerCase();
  const navItems = getNavItems(userCo);

  const roleLabel = {
    student:   "Étudiant",
    professor: "Professeur",
    admin:     "Administrateur"
  }[role] ?? "Utilisateur";

  const loginRedirect = ["student"].includes(role)
    ? "/login/user"
    : "/login/employee";

  const logout = async () => {
    try {
      const result = await logoutS();
      if (result.success) navigate(loginRedirect);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <aside className="h-screen w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">

      {/* ── Profil ── */}
      <div className="px-4 py-5 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <Avatar img={profilePic} bordered size="md" rounded />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {userCo?.firstName} {userCo?.lastName}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {userCo?.permanentCode || userCo?.userCode || roleLabel}
            </p>
            <span className="inline-block mt-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
              {roleLabel}
            </span>
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
        {navItems.map((item) => (
          <NavItem key={item.label} item={item} />
        ))}
      </nav>

      {/* ── Déconnexion ── */}
      <div className="px-3 py-4 border-t border-slate-200 shrink-0">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <HiLogout className="w-4 h-4 shrink-0" />
          Déconnexion
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;