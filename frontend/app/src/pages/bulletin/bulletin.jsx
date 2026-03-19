import Sidebar from "../sidebar/sidebar";
import userPicture from "../../assets/img/User_Icon.png";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { HiChevronDown, HiAcademicCap, HiInformationCircle, HiX } from "react-icons/hi";
import { getStudentBulletinS } from "../../services/bulletin.service";
import { getStudentProgramsS } from "../../services/program.service";

// ── Table des mentions ────────────────────────────────────────────────────────
const MENTIONS = [
  { code: "A+, A, A-, tA", label: "Excellent" },
  { code: "B+, B, B-, tB", label: "Très bien" },
  { code: "C+, C, C-, tC", label: "Bien" },
  { code: "D+, D",         label: "Passable" },
  { code: "E",             label: "Échec" },
  { code: "EXE",           label: "Exemption" },
  { code: "H",             label: "Hors programme" },
  { code: "I",             label: "Incomplet" },
  { code: "K",             label: "Exemption (reconnaissance des acquis)" },
  { code: "L",             label: "Échoué, repris et réussi" },
  { code: "R",             label: "Résultat reporté" },
  { code: "S",             label: "Exigence satisfaite" },
  { code: "*",             label: "Résultat non disponible" },
  { code: "**",            label: "Activité sans crédit universitaire" },
  { code: "#",             label: "Délai autorisé pour la remise du résultat" },
];

const GPA_TABLE = [
  ["A+ = 4.3", "A = 4.0",  "A− = 3.7"],
  ["B+ = 3.3", "B = 3.0",  "B− = 2.7"],
  ["C+ = 2.3", "C = 2.0",  "C− = 1.7"],
  ["D+ = 1.3", "D = 1.0",  ""],
  ["S = Exigence satisfaite", "", ""],
];

// ── Badge mention ─────────────────────────────────────────────────────────────
const MentionBadge = ({ mention }) => {
  if (!mention) return <span className="text-slate-400 text-xs">—</span>;
  const isFailure = mention === "E";
  const isGood    = ["A+","A","A-","B+","B","B-"].includes(mention);
  const cls = isFailure
    ? "bg-red-50 text-red-700 border-red-100"
    : isGood
    ? "bg-green-50 text-green-700 border-green-100"
    : "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span className={`text-xs font-semibold border px-2 py-0.5 rounded-full ${cls}`}>{mention}</span>
  );
};

// ── Modal légende ─────────────────────────────────────────────────────────────
const LegendModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-base font-semibold text-slate-900">Signification des notes et mentions</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <HiX className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-6">
          {/* Mentions */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Notes et mentions</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 px-3 text-xs text-slate-500 font-medium">Code</th>
                  <th className="text-left py-2 px-3 text-xs text-slate-500 font-medium">Signification</th>
                </tr>
              </thead>
              <tbody>
                {MENTIONS.map((m, i) => (
                  <tr key={i} className={`border-b border-slate-50 ${i % 2 === 1 ? "bg-slate-50" : ""}`}>
                    <td className="py-2.5 px-3 font-mono text-xs font-semibold text-slate-800">{m.code}</td>
                    <td className="py-2.5 px-3 text-xs text-slate-600">{m.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Valeur GPA */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Valeur en points (GPA)</p>
            <table className="w-full text-sm">
              <tbody>
                {GPA_TABLE.map((row, i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-slate-50" : ""}>
                    {row.map((cell, j) => (
                      <td key={j} className="py-2 px-3 text-xs font-mono text-slate-700">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
        <span>{selected ?? "Choisir un programme"}</span>
        <HiChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-slate-200 rounded-xl shadow-lg min-w-[220px] py-1">
          {programs.map((p) => (
            <button
              key={p}
              onClick={() => { onSelect(p); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 ${selected === p ? "text-blue-800 font-medium" : "text-slate-700"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Page principale ───────────────────────────────────────────────────────────
const Bulletin = ({ userCo }) => {
  const location = useLocation();
  const studentDisplay = location.state?.studentToShow;

  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [allBulletins, setAllBulletins] = useState({}); // { programTitle: bulletins[] }
  const [average, setAverage] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [legendOpen, setLegendOpen] = useState(false);

  const targetCode = studentDisplay || userCo?.permanentCode;

  useEffect(() => {
    if (targetCode) fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      // Récupère les programmes inscrits
      const progRes = await getStudentProgramsS(targetCode);
      if (progRes.success) {
        const enrolled = progRes.programs.filter((p) => p.isEnrolled).map((p) => p.title);
        setPrograms(enrolled);
        if (enrolled.length > 0) {
          setSelectedProgram(enrolled[0]);
          await loadBulletin(enrolled[0]);
        }
      } else {
        // Fallback : bulletin sans filtre programme
        await loadBulletin(null);
      }
    } catch {
      await loadBulletin(null);
    }
  };

  const loadBulletin = async (programTitle) => {
    try {
      const res = await getStudentBulletinS(targetCode);
      const bulletins = res.bulletins ?? [];
      const filtered = programTitle
        ? bulletins.filter((b) => !b.programTitle || b.programTitle === programTitle)
        : bulletins;

      const credits = filtered.reduce((acc, b) => {
        if (b.mention && b.mention !== "E") return acc + (b.credits || 0);
        return acc;
      }, 0);

      setAllBulletins((prev) => ({ ...prev, [programTitle ?? "_"]: filtered }));
      setTotalCredit(credits);
      setAverage(res.average ?? 0);
    } catch (e) { console.error(e); }
  };

  const handleProgramSelect = async (title) => {
    setSelectedProgram(title);
    if (!allBulletins[title]) await loadBulletin(title);
  };

  const currentBulletins = allBulletins[selectedProgram ?? "_"] ?? [];
  const cumulativeAverage = (average * 5 / 100).toFixed(2);

  // Regroupement par session/année
  const grouped = currentBulletins.reduce((acc, b) => {
    const key = `${b.sessionCourse} ${b.yearCourse}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(b);
    return acc;
  }, {});

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar userCo={userCo} profilePic={userPicture} />

      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <p className="text-sm font-semibold text-slate-900">Bulletin académique</p>
            {selectedProgram && <p className="text-xs text-slate-400">{selectedProgram}</p>}
          </div>
          <div className="flex items-center gap-3">
            {programs.length > 1 && (
              <ProgramDropdown programs={programs} selected={selectedProgram} onSelect={handleProgramSelect} />
            )}
            <button
              onClick={() => setLegendOpen(true)}
              className="flex items-center gap-1.5 border border-slate-200 hover:border-blue-700 hover:text-blue-800 text-slate-600 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
            >
              <HiInformationCircle className="w-4 h-4" />
              Légende
            </button>
          </div>
        </div>

        <div className="p-8 flex flex-col gap-6 max-w-5xl">

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <span className="text-xs text-slate-400 uppercase tracking-wide font-medium">Crédits réussis</span>
              <p className="text-3xl font-bold text-slate-900 mt-1">{totalCredit}</p>
            </div>
            <div className="bg-white border border-blue-200 rounded-xl p-5">
              <span className="text-xs text-slate-400 uppercase tracking-wide font-medium">Moyenne cumulative</span>
              <p className="text-3xl font-bold text-blue-800 mt-1">{cumulativeAverage} <span className="text-base font-normal text-slate-400">/ 5.0</span></p>
            </div>
          </div>

          {/* ── Tableau bulletin ── */}
          {Object.keys(grouped).length === 0 ? (
            <div className="text-sm text-slate-400">Aucun résultat disponible.</div>
          ) : (
            Object.entries(grouped).map(([session, courses]) => (
              <div key={session} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{session}</p>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 px-5 text-xs text-slate-400 font-medium uppercase tracking-wide">Sigle</th>
                      <th className="text-left py-3 px-5 text-xs text-slate-400 font-medium uppercase tracking-wide">Titre</th>
                      <th className="text-center py-3 px-5 text-xs text-slate-400 font-medium uppercase tracking-wide">Crédits</th>
                      <th className="text-center py-3 px-5 text-xs text-slate-400 font-medium uppercase tracking-wide">Note</th>
                      <th className="text-center py-3 px-5 text-xs text-slate-400 font-medium uppercase tracking-wide">Mention</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((r, i) => (
                      <tr key={i} className={`border-b border-slate-50 last:border-0 ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                        <td className="py-3 px-5 font-mono text-xs font-semibold text-slate-700">{r.sigle}</td>
                        <td className="py-3 px-5 text-slate-700">{r.fullName}</td>
                        <td className="py-3 px-5 text-center text-slate-600">{r.credits ?? "—"}</td>
                        <td className="py-3 px-5 text-center font-semibold text-slate-900">{r.grade ?? "—"}</td>
                        <td className="py-3 px-5 text-center"><MentionBadge mention={r.mention} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      </main>

      <LegendModal open={legendOpen} onClose={() => setLegendOpen(false)} />
    </div>
  );
};

export default Bulletin;