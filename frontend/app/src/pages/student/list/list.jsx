import Sidebar from "../../sidebar/sidebar";
import adminPicture from "../../../assets/img/Admin.jpg";
import { Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiSearch, HiExternalLink, HiX } from "react-icons/hi";
import { activeStudentAccountS, getStudentsS } from "../../../services/user.service";

const StudentsList = ({ employeeCo }) => {
  const navigate = useNavigate();
  const [students, setStudents]               = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchStudent, setSearchStudent]     = useState("");
  const [loadingCode, setLoadingCode]         = useState(null); // code du compte en cours de toggle

  useEffect(() => { getStudents(); }, []);

  const getStudents = async () => {
    try {
      const list = await getStudentsS();
      setStudents(list);
      setFilteredStudents(list);
    } catch (e) { console.error(e); }
  };

  const activeStudentAccount = async (permanentCode, activate) => {
    setLoadingCode(permanentCode);
    try {
      const response = await activeStudentAccountS({ code: permanentCode, isActivate: activate });
      if (response) await getStudents();
      else console.warn("Échec activation de compte");
    } catch (e) { console.error(e); }
    finally { setLoadingCode(null); }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchStudent(term);
    setFilteredStudents(
      students.filter((s) =>
        s.permanentCode.toUpperCase().includes(term.toUpperCase()) ||
        s.lastName?.toUpperCase().includes(term.toUpperCase())     ||
        s.firstName?.toUpperCase().includes(term.toUpperCase())
      )
    );
  };

  const clearSearch = () => {
    setSearchStudent("");
    setFilteredStudents(students);
  };

  const navigateToFiles = (permanentCode) => navigate(`/student/${permanentCode}`);

  // Stats rapides
  const activeCount   = students.filter((s) => s.isActivated == 1).length;
  const inactiveCount = students.length - activeCount;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar userCo={employeeCo} profilePic={adminPicture} />

      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div>
            <p className="text-sm font-semibold text-slate-900">Dossiers étudiants</p>
            <p className="text-xs text-slate-400">{students.length} étudiant{students.length > 1 ? "s" : ""} enregistré{students.length > 1 ? "s" : ""}</p>
          </div>
          {/* Stats rapides */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-green-700">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              {activeCount} actif{activeCount > 1 ? "s" : ""}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />
              {inactiveCount} inactif{inactiveCount > 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="px-8 py-4 bg-white border-b border-slate-100 shrink-0">
          <div className="relative max-w-md">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchStudent}
              onChange={handleSearch}
              placeholder="Rechercher par code permanent, nom ou prénom..."
              className="w-full pl-9 pr-9 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
            />
            {searchStudent && (
              <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                <HiX className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchStudent && (
            <p className="text-xs text-slate-400 mt-2">
              {filteredStudents.length} résultat{filteredStudents.length > 1 ? "s" : ""} pour « {searchStudent} »
            </p>
          )}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto px-8 py-4">
          {filteredStudents.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
              Aucun étudiant trouvé.
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {["Code permanent", "Nom", "Prénom", "Email", "Département / Faculté", "Compte", "Dossier"].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-xs text-slate-400 font-medium uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, i) => {
                    const isActive  = student.isActivated == 1;
                    const isToggling = loadingCode === student.permanentCode;
                    return (
                      <tr
                        key={student.permanentCode}
                        className={`border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer ${i % 2 === 1 ? "bg-slate-50/30" : ""}`}
                        onClick={() => navigateToFiles(student.permanentCode)}
                      >
                        <td className="py-3 px-4 font-mono text-xs font-bold text-slate-800">
                          {student.permanentCode}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900">{student.lastName}</td>
                        <td className="py-3 px-4 text-slate-700">{student.firstName}</td>
                        <td className="py-3 px-4 text-slate-500 text-xs">{student.email}</td>
                        <td className="py-3 px-4">
                          <p className="text-xs text-slate-600">{student.faculty}</p>
                          <p className="text-xs text-slate-400">{student.department}</p>
                        </td>
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={isActive}
                              loading={isToggling}
                              onChange={(checked) => activeStudentAccount(student.permanentCode, checked)}
                              size="small"
                            />
                            <span className={`text-xs font-medium ${isActive ? "text-green-700" : "text-slate-400"}`}>
                              {isActive ? "Actif" : "Inactif"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => navigateToFiles(student.permanentCode)}
                            className="flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-900 transition-colors"
                          >
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
      </main>
    </div>
  );
};

export default StudentsList;