import Sidebar from "../../sidebar/sidebar";
import adminPicture from "../../../assets/img/Admin.jpg";
import { Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiCheck, HiExclamation, HiSearch, HiExternalLink, HiX } from "react-icons/hi";
import { activeStudentAccountS, getStudentsS, validateUserS } from "../../../services/user.service";

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

  const activeStudentAccount = async (isValidated, permanentCode, activate) => {
    if (!isValidated && activate) {
      alert("Impossible d'activer le compte : le dossier doit d'abord être validé.");
      return;
    }

    setLoadingCode(permanentCode);
    try {
      const response = await activeStudentAccountS({ code: permanentCode, isActivate: activate });
      if (response) await getStudents();
      else console.warn("Échec activation de compte");
    } catch (e) { console.error(e); }
    finally { setLoadingCode(null); }
  };

  const validateUser = async (permanentCode) => {
    setLoadingCode(permanentCode); // On réutilise le même loading pour le feedback
    try {
      // On suppose que ton service s'appelle validateStudentS
      const response = await validateUserS({ code: permanentCode, isValidated: true }); 
      if (response) {
        await getStudents(); // Rafraîchir la liste
      }
    } catch (e) {
      console.error("Erreur lors de la validation", e);
    } finally {
      setLoadingCode(null);
    }
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
  const pendingValidation = students.filter(s => !s.isValidated);

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

        {/* ── Section Attention : Dossiers à valider ── */}
        {pendingValidation.length > 0 && (
          <div className="mx-8 mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-4 shadow-sm animate-pulse-subtle">
            <div className="p-2 bg-amber-100 rounded-lg">
              <HiExclamation className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-amber-900">
                Dossiers en attente de validation ({pendingValidation.length})
              </h3>
              <p className="text-xs text-amber-700 mt-1">
                L'inscription de ces étudiants n'est pas finalisée. Veuillez vérifier leurs documents pour valider leur statut.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {pendingValidation.slice(0, 3).map(s => (
                  <span key={s.permanentCode} className="px-2 py-1 bg-white border border-amber-200 rounded text-[10px] font-medium text-amber-800">
                    {s.firstName} {s.lastName}
                  </span>
                ))}
                {pendingValidation.length > 3 && (
                  <span className="text-[10px] text-amber-600 self-center">
                    + {pendingValidation.length - 3} autres...
                  </span>
                )}
              </div>
            </div>
            <button 
                onClick={() => {
                    setSearchStudent(""); // On reset la recherche
                    setFilteredStudents(pendingValidation); // On ne montre que ceux-là
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors shrink-0"
            >
              Afficher ces dossiers
            </button>
          </div>
        )}

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
                    {["Code permanent", "Nom & Prénom", "Email", "Département", "Dossier", "Compte", ""].map((h) => (
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
                    const isValidated = student.isValidated;
                    return (
                      <tr
                        key={student.permanentCode}
                        className={`border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer ${i % 2 === 1 ? "bg-slate-50/30" : ""}`}
                        onClick={() => navigateToFiles(student.permanentCode)}
                      >
                        <td className="py-3 px-4 font-mono text-xs font-bold text-slate-800">{student.permanentCode}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">{student.lastName} {student.firstName}</span>
                            {!student.isValidated && (
                              <span className="w-fit mt-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                                À VALIDER
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-xs">{student.professionalEmail}</td>
                        <td className="py-3 px-4 text-slate-500">{student.department}</td>
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          {isValidated ? (
                            <div className="flex items-center gap-1.5 text-green-600 bg-green-50 w-fit px-2 py-1 rounded-md border border-green-100">
                              <HiCheck className="w-4 h-4" />
                              <span className="text-[11px] font-bold uppercase">Validé</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => validateUser(student.permanentCode)}
                              disabled={isToggling}
                              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-sm uppercase tracking-tight"
                            >
                              <HiCheck className="w-3.5 h-3.5" />
                              Valider le dossier
                            </button>
                          )}
                        </td>
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={isActive}
                              loading={isToggling}
                              // IMPORTANT : Désactivé si le dossier n'est pas encore validé
                              disabled={!isValidated} 
                              onChange={(checked) => activeStudentAccount(student, checked)}
                              size="small"
                            />
                            <div className="flex flex-col">
                              <span className={`text-[10px] leading-none font-bold ${isActive ? "text-green-700" : "text-slate-400"}`}>
                                {isActive ? "ACTIF" : "INACTIF"}
                              </span>
                              {!isValidated && (
                                <span className="text-[9px] text-amber-600 font-medium">Validation requise</span>
                              )}
                            </div>
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