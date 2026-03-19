import { HiChevronDown, HiChevronUp, HiAcademicCap, HiArrowLeft } from "react-icons/hi";
import logo from "../../../assets/img/UA_Logo2.jpg";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProgramsByGradeS } from "../../../services/program.service";

const GRADE_CONFIG = {
  "Certificat":   { color: "bg-slate-100 text-slate-700 border-slate-200",   accent: "border-slate-400"   },
  "BTS":          { color: "bg-teal-50 text-teal-700 border-teal-100",        accent: "border-teal-500"    },
  "Baccalauréat": { color: "bg-blue-50 text-blue-700 border-blue-100",        accent: "border-blue-600"    },
  "Licence":      { color: "bg-blue-50 text-blue-700 border-blue-100",        accent: "border-blue-600"    },
  "Master":       { color: "bg-violet-50 text-violet-700 border-violet-100",  accent: "border-violet-600"  },
  "Doctorat":     { color: "bg-amber-50 text-amber-700 border-amber-100",     accent: "border-amber-500"   },
};

const ProgramsByGrade = () => {
  const { grade }   = useParams();
  const navigate    = useNavigate();
  const [gradePrograms, setGradePrograms] = useState([]);
  const [openId, setOpenId]               = useState(null);
  const [isLoading, setIsLoading]         = useState(false);

  const config = GRADE_CONFIG[grade] ?? GRADE_CONFIG["Certificat"];

  useEffect(() => {
    if (grade) getProgramsByGrade();
  }, [grade]);

  const getProgramsByGrade = async () => {
    setIsLoading(true);
    try {
      const result = await getProgramsByGradeS(grade);
      if (result.success) setGradePrograms(result.programs);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const toggle = (id) => setOpenId(openId === id ? null : id);

  const navigateToAdmission = (pgr) => {
    navigate("/admission", {
      state: {
        progT: {
          value: pgr.title,
          label: `${pgr.title} | ${pgr.grade} : ${pgr.programName}`,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header public ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="UA Logo" className="h-8 w-auto object-contain" />
            <span className="font-semibold text-slate-800 text-sm tracking-wide uppercase hidden sm:block">
              MyUA Academia
            </span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-800 transition-colors"
          >
            <HiArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </button>
        </div>
      </header>

      {/* ── Hero section ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <span className={`inline-block text-xs font-semibold border px-3 py-1 rounded-full mb-4 ${config.color}`}>
            {grade}
          </span>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Nos programmes en {grade}
          </h1>
          <p className="text-slate-500 text-sm">
            {isLoading ? "Chargement..." : `${gradePrograms.length} programme${gradePrograms.length > 1 ? "s" : ""} disponible${gradePrograms.length > 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {/* ── Liste des programmes ── */}
      <div className="max-w-5xl mx-auto px-6 py-10">

        {isLoading && (
          <div className="text-sm text-slate-400 text-center py-12">Chargement des programmes...</div>
        )}

        {!isLoading && gradePrograms.length === 0 && (
          <div className="text-sm text-slate-400 text-center py-12">
            Aucun programme trouvé pour ce niveau d'études.
          </div>
        )}

        {!isLoading && gradePrograms.length > 0 && (
          <div className="flex flex-col gap-3">
            {gradePrograms.map((program) => {
              const isOpen = openId === program.title;
              return (
                <div
                  key={program.title}
                  className={`bg-white border rounded-xl overflow-hidden transition-all ${
                    isOpen ? `border-l-4 ${config.accent} border-t border-r border-b border-slate-200` : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {/* En-tête accordéon */}
                  <div className="flex items-center gap-4 px-6 py-4">
                    <button
                      onClick={() => toggle(program.title)}
                      className="flex-1 flex items-center justify-between gap-4 text-left"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-semibold border px-2 py-0.5 rounded-full shrink-0 ${config.color}`}>
                            {program.title}
                          </span>
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {program.programName}
                          </p>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{program.faculty} · {program.department}</p>
                      </div>
                      {isOpen
                        ? <HiChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                        : <HiChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                      }
                    </button>

                    {/* Bouton admission toujours visible */}
                    <button
                      onClick={() => navigateToAdmission(program)}
                      className="shrink-0 flex items-center gap-1.5 bg-blue-800 hover:bg-blue-900 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      <HiAcademicCap className="w-3.5 h-3.5" />
                      Admission
                    </button>
                  </div>

                  {/* Détails (accordéon) */}
                  {isOpen && (
                    <div className="border-t border-slate-100 px-6 py-5 bg-slate-50/50">
                      <div className="grid sm:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Niveau</p>
                          <p className="text-sm text-slate-800 font-medium">{program.grade}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Faculté</p>
                          <p className="text-sm text-slate-800 font-medium">{program.faculty}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Département</p>
                          <p className="text-sm text-slate-800 font-medium">{program.department}</p>
                        </div>
                      </div>
                      {program.descriptions && (
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-2">Description</p>
                          <p className="text-sm text-slate-600 leading-relaxed">{program.descriptions}</p>
                        </div>
                      )}
                      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={() => navigateToAdmission(program)}
                          className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                        >
                          <HiAcademicCap className="w-4 h-4" />
                          Faire une demande d'admission
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramsByGrade;