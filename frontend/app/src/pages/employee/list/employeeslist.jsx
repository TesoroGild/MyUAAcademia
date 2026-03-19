import Sidebar from "../../sidebar/sidebar";
import adminPicture from "../../../assets/img/Admin.jpg";
import { Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiSearch, HiX, HiExternalLink, HiCheck, HiEye, HiChevronDown, HiChevronUp } from "react-icons/hi";
import { activeEmployeeAccountS, getEmployeesS, validateEmployeeS } from "../../../services/employee.service";

// ── Note : ajoute validateEmployeeS dans employee.service.js ──
// export const validateEmployeeS = async (payload) => {
//   const response = await axios.post("/employee/validate", payload);
//   return response.data;
// };

const ROLE_BADGE = {
  admin:     "bg-purple-50 text-purple-700 border-purple-100",
  professor: "bg-blue-50 text-blue-700 border-blue-100",
  employee:  "bg-slate-100 text-slate-600 border-slate-200",
};

const EmployeesList = ({ employeeCo }) => {
  const navigate = useNavigate();
  const [employees, setEmployees]                 = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [search, setSearch]                       = useState("");
  const [deptFilter, setDeptFilter]               = useState("");
  const [loadingCode, setLoadingCode]             = useState(null);
  const [validatingCode, setValidatingCode]       = useState(null);
  const [pendingOpen, setPendingOpen]             = useState(true); // section dépliée par défaut

  useEffect(() => { getEmployees(); }, []);

  useEffect(() => {
    // On filtre uniquement les employés validés pour la table principale
    let list = employees.filter((e) => e.userStatus == 1);
    if (deptFilter) list = list.filter((e) => e.department === deptFilter);
    if (search)     list = list.filter((e) =>
      e.code?.toUpperCase().includes(search.toUpperCase())     ||
      e.lastName?.toUpperCase().includes(search.toUpperCase()) ||
      e.firstName?.toUpperCase().includes(search.toUpperCase())
    );
    setFilteredEmployees(list);
  }, [search, deptFilter, employees]);

  const getEmployees = async () => {
    try {
      const list = await getEmployeesS();
      setEmployees(Array.isArray(list) ? list : []);
    } catch (e) { console.error(e); }
  };

  const activeEmployeeAccount = async (code, activate) => {
    setLoadingCode(code);
    try {
      const res = await activeEmployeeAccountS({ code, isActivate: activate });
      if (res) await getEmployees();
    } catch (e) { console.error(e); }
    finally { setLoadingCode(null); }
  };

  const validateEmployee = async (code) => {
    setValidatingCode(code);
    try {
      const res = await validateEmployeeS({ code, isValidated: true });
      if (res) await getEmployees();
    } catch (e) { console.error(e); }
    finally { setValidatingCode(null); }
  };

  const departments  = [...new Set(employees.filter((e) => e.userStatus == 1).map((e) => e.department).filter(Boolean))].sort();
  const pendingList  = employees.filter((e) => e.userStatus != 1);
  const activeCount  = employees.filter((e) => e.userStatus == 1 && e.isActivated == 1).length;
  const inactiveCount = employees.filter((e) => e.userStatus == 1 && e.isActivated != 1).length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar userCo={employeeCo} profilePic={adminPicture} />

      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div>
            <p className="text-sm font-semibold text-slate-900">Liste des employés</p>
            <p className="text-xs text-slate-400">{employees.filter((e) => e.userStatus == 1).length} employé(s) validé(s)</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-green-700">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              {activeCount} actif{activeCount > 1 ? "s" : ""}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />
              {inactiveCount} inactif{inactiveCount > 1 ? "s" : ""}
            </div>
            <button
              onClick={() => navigate("/employee/employee/create")}
              className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + Nouvel employé
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* ── Section dossiers en attente ── */}
          {pendingList.length > 0 && (
            <div className="mx-8 mt-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
                {/* Header cliquable */}
                <button
                  onClick={() => setPendingOpen(!pendingOpen)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-amber-200 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-amber-800">{pendingList.length}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-amber-900">Dossiers en attente de validation</p>
                      <p className="text-xs text-amber-700 mt-0.5">Ces dossiers ont été créés et attendent votre vérification</p>
                    </div>
                  </div>
                  {pendingOpen
                    ? <HiChevronUp className="w-4 h-4 text-amber-600 shrink-0" />
                    : <HiChevronDown className="w-4 h-4 text-amber-600 shrink-0" />
                  }
                </button>

                {/* Liste des dossiers en attente */}
                {pendingOpen && (
                  <div className="border-t border-amber-200">
                    {pendingList.map((emp, i) => (
                      <div
                        key={emp.code}
                        className={`flex items-center justify-between gap-4 px-5 py-4 ${i < pendingList.length - 1 ? "border-b border-amber-100" : ""}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Initiales */}
                          <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-amber-800">
                              {emp.firstName?.[0]}{emp.lastName?.[0]}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{emp.firstName} {emp.lastName}</p>
                            <p className="text-xs text-slate-500 font-mono">{emp.code} · {emp.job}</p>
                            <p className="text-xs text-slate-400">{emp.department} · {emp.faculty}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => navigate(`/employee/${emp.code}`)}
                            className="flex items-center gap-1.5 text-xs font-medium border border-slate-200 hover:border-slate-300 text-slate-600 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <HiEye className="w-3.5 h-3.5" />
                            Voir le dossier
                          </button>
                          <button
                            onClick={() => validateEmployee(emp.code)}
                            disabled={validatingCode === emp.code}
                            className="flex items-center gap-1.5 text-xs font-medium bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <HiCheck className="w-3.5 h-3.5" />
                            {validatingCode === emp.code ? "Validation..." : "Valider"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Filtres ── */}
          <div className="px-8 py-4 shrink-0 flex flex-wrap items-center gap-3">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par code, nom ou prénom..."
                className="pl-9 pr-8 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 transition w-72 bg-white"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  <HiX className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setDeptFilter("")}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${!deptFilter ? "bg-blue-800 text-white border-blue-800" : "bg-white text-slate-600 border-slate-200 hover:border-blue-700"}`}>
                Tous
              </button>
              {departments.map((d) => {
                const count = employees.filter((e) => e.userStatus == 1 && e.department === d).length;
                return (
                  <button key={d} onClick={() => setDeptFilter(deptFilter === d ? "" : d)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${deptFilter === d ? "bg-blue-800 text-white border-blue-800" : "bg-white text-slate-600 border-slate-200 hover:border-blue-700"}`}>
                    {d} ({count})
                  </button>
                );
              })}
            </div>
            {(search || deptFilter) && (
              <p className="text-xs text-slate-400 ml-auto">{filteredEmployees.length} résultat{filteredEmployees.length > 1 ? "s" : ""}</p>
            )}
          </div>

          {/* ── Table employés validés ── */}
          <div className="px-8 pb-8">
            {filteredEmployees.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
                Aucun employé trouvé.
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {["Code", "Nom", "Prénom", "Email", "Poste", "Département / Faculté", "Statut", "Compte", "Dossier"].map((h) => (
                        <th key={h} className="text-left py-3 px-4 text-xs text-slate-400 font-medium uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp, i) => {
                      const isActive   = emp.isActivated == 1;
                      const isToggling = loadingCode === emp.code;
                      return (
                        <tr key={emp.code}
                          className={`border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer ${i % 2 === 1 ? "bg-slate-50/30" : ""}`}
                          onClick={() => navigate(`/employee/${emp.code}`)}>
                          <td className="py-3 px-4 font-mono text-xs font-bold text-slate-800">{emp.code}</td>
                          <td className="py-3 px-4 font-medium text-slate-900">{emp.lastName}</td>
                          <td className="py-3 px-4 text-slate-700">{emp.firstName}</td>
                          <td className="py-3 px-4 text-slate-500 text-xs">{emp.professionalEmail}</td>
                          <td className="py-3 px-4">
                            <span className={`text-xs font-medium border px-2 py-0.5 rounded-full ${ROLE_BADGE[emp.userRole?.toLowerCase()] ?? ROLE_BADGE.employee}`}>
                              {emp.job || emp.userRole}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-xs text-slate-600">{emp.faculty}</p>
                            <p className="text-xs text-slate-400">{emp.department}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`text-xs font-medium border px-2 py-0.5 rounded-full ${
                              isActive
                                ? "bg-green-50 text-green-700 border-green-100"
                                : "bg-slate-100 text-slate-500 border-slate-200"
                            }`}>
                              {isActive ? "En poste" : "Hors poste"}
                            </span>
                          </td>
                          <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-2">
                              <Switch checked={isActive} loading={isToggling}
                                onChange={(checked) => activeEmployeeAccount(emp.code, checked)} size="small" />
                              <span className={`text-xs font-medium ${isActive ? "text-green-700" : "text-slate-400"}`}>
                                {isActive ? "Actif" : "Inactif"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => navigate(`/employee/${emp.code}`)}
                              className="flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-900 transition-colors">
                              <HiExternalLink className="w-3.5 h-3.5" />
                              Ouvrir
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeesList;