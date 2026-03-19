import Sidebar from "../sidebar/sidebar";
import adminPicture from "../../assets/img/Admin.jpg";
import { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight, HiSearch, HiX } from "react-icons/hi";
import { getClassesCoursesS, getClassroomsS } from "../../services/course.service";
import { getEmployeesS } from "../../services/employee.service";

const DAYS  = ["Lun", "Mar", "Mer", "Jeu", "Ven"];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8);
const DAY_MAP = { lundi:0, mardi:1, mercredi:2, jeudi:3, vendredi:4, lun:0, mar:1, mer:2, jeu:3, ven:4 };
const COLORS  = [
  "bg-blue-100 border-blue-300 text-blue-900",
  "bg-violet-100 border-violet-300 text-violet-900",
  "bg-teal-100 border-teal-300 text-teal-900",
  "bg-amber-100 border-amber-300 text-amber-900",
  "bg-rose-100 border-rose-300 text-rose-900",
  "bg-green-100 border-green-300 text-green-900",
];

const parseTime = (t) => { if(!t) return 0; const [h,m]=t.replace("h",":").split(":").map(Number); return h+(m||0)/60; };
const getMondayOf = (d) => { const r=new Date(d); const day=r.getDay(); r.setDate(r.getDate()+(day===0?-6:1-day)); r.setHours(0,0,0,0); return r; };
const addDays = (d,n) => { const r=new Date(d); r.setDate(r.getDate()+n); return r; };
const fmtDate = (d) => d.toLocaleDateString("fr-CA",{day:"numeric",month:"short"});

const AdminPlanning = ({ employeeCo }) => {
  const [mode, setMode]               = useState("prof");
  const [professors, setProfessors]   = useState([]);
  const [rooms, setRooms]             = useState([]);
  const [allCourses, setAllCourses]   = useState([]);
  const [search, setSearch]           = useState("");
  const [selected, setSelected]       = useState(null);
  const [weekStart, setWeekStart]     = useState(getMondayOf(new Date()));
  const [selectedBlock, setSelectedBlock] = useState(null);
  const today = new Date();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [emps, rms, courses] = await Promise.all([getEmployeesS(), getClassroomsS(), getClassesCoursesS("")]);
      const empList = Array.isArray(emps) ? emps : [];
      setProfessors(empList.filter((e) => e.userRole?.toLowerCase() === "professor"));
      setRooms(Array.isArray(rms) ? rms : []);
      setAllCourses(Array.isArray(courses) ? courses : courses?.courses ?? courses?.data ?? []);
    } catch (e) { console.error(e); }
  };

  const courses = selected
    ? mode === "prof"
      ? allCourses.filter((c) => c.professorCode === selected.code)
      : allCourses.filter((c) => c.classeName   === selected.classeName)
    : [];

  const colorMap = {};
  [...new Set(courses.map((c) => c.courseSigle))].forEach((s,i) => { colorMap[s] = COLORS[i%COLORS.length]; });

  const list = mode === "prof"
    ? professors.filter((p) => !search || p.lastName?.toUpperCase().includes(search.toUpperCase()) || p.firstName?.toUpperCase().includes(search.toUpperCase()) || p.code?.toUpperCase().includes(search.toUpperCase()))
    : rooms.filter((r) => !search || r.classeName?.toUpperCase().includes(search.toUpperCase()));

  const weekDays = DAYS.map((_,i) => addDays(weekStart,i));
  const isToday  = (d) => d.toDateString() === today.toDateString();

  const getBlock = (c, dayIdx) => {
    const di = DAY_MAP[(c.jours??"").toLowerCase().trim()] ?? -1;
    if (di!==dayIdx) return null;
    const s=parseTime(c.startTime), e=parseTime(c.endTime);
    if (!s||!e||s<8||e>21) return null;
    return { top:(s-8)*56, height:(e-s)*56 };
  };

  const handleSelect = (item) => {
    setSelected(selected?.code===item.code || selected?.classeName===item.classeName ? null : item);
    setSelectedBlock(null);
  };

  const switchMode = (m) => { setMode(m); setSelected(null); setSearch(""); setSelectedBlock(null); };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar userCo={employeeCo} profilePic={adminPicture} />
      <main className="flex-1 flex overflow-hidden">

        {/* ── Panneau gauche ── */}
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-100 shrink-0">
            <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
              {["prof","room"].map((m)=>(
                <button key={m} onClick={()=>switchMode(m)}
                  className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${mode===m?"bg-white text-slate-900 shadow-sm":"text-slate-500 hover:text-slate-700"}`}>
                  {m==="prof"?"Professeur":"Salle"}
                </button>
              ))}
            </div>
          </div>
          <div className="px-4 py-3 border-b border-slate-100 shrink-0">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"/>
              <input type="text" value={search} onChange={e=>setSearch(e.target.value)}
                placeholder={mode==="prof"?"Rechercher un prof...":"Rechercher une salle..."}
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 transition"/>
              {search&&<button onClick={()=>setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"><HiX className="w-3.5 h-3.5"/></button>}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {list.length===0
              ? <p className="text-xs text-slate-400 text-center py-6">Aucun résultat.</p>
              : list.map((item)=>{
                const isActive = mode==="prof" ? selected?.code===item.code : selected?.classeName===item.classeName;
                return (
                  <button key={item.code??item.classeName} onClick={()=>handleSelect(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${isActive?"bg-blue-50 border-l-2 border-l-blue-700":""}`}>
                    {mode==="prof"?(
                      <>
                        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-blue-700">{item.firstName?.[0]}{item.lastName?.[0]}</span>
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate ${isActive?"text-blue-800":"text-slate-900"}`}>{item.firstName} {item.lastName}</p>
                          <p className="text-xs text-slate-400 font-mono truncate">{item.code}</p>
                        </div>
                      </>
                    ):(
                      <>
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-slate-500">{item.classeName?.slice(0,2)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate ${isActive?"text-blue-800":"text-slate-900"}`}>{item.classeName}</p>
                          <p className="text-xs text-slate-400">{item.typeOfClasse} · {item.capacity} pl.</p>
                        </div>
                      </>
                    )}
                  </button>
                );
              })
            }
          </div>
        </div>

        {/* ── Zone grille ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
            <div>
              {selected ? (
                <>
                  <p className="text-sm font-semibold text-slate-900">
                    {mode==="prof" ? `${selected.firstName} ${selected.lastName}` : selected.classeName}
                  </p>
                  <p className="text-xs text-slate-400">{courses.length} cours planifié{courses.length>1?"s":""}</p>
                </>
              ) : (
                <p className="text-sm text-slate-400">Sélectionnez un{mode==="prof"?" professeur":"e salle"} pour voir son planning</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={()=>setWeekStart(addDays(weekStart,-7))} className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-700 transition-colors"><HiChevronLeft className="w-4 h-4 text-slate-600"/></button>
              <span className="text-sm font-medium text-slate-700 min-w-[150px] text-center">{fmtDate(weekStart)} – {fmtDate(addDays(weekStart,4))}</span>
              <button onClick={()=>setWeekStart(addDays(weekStart,7))} className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-700 transition-colors"><HiChevronRight className="w-4 h-4 text-slate-600"/></button>
              <button onClick={()=>setWeekStart(getMondayOf(new Date()))} className="text-xs font-medium text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors">Aujourd'hui</button>
            </div>
          </div>

          {courses.length>0&&(
            <div className="px-6 py-2 bg-white border-b border-slate-100 flex flex-wrap gap-2 shrink-0">
              {Object.entries(colorMap).map(([sigle,color])=>(
                <span key={sigle} className={`text-xs font-mono font-medium border px-2.5 py-1 rounded-full ${color}`}>{sigle}</span>
              ))}
            </div>
          )}

          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                <HiSearch className="w-7 h-7 text-slate-300"/>
              </div>
              <p className="text-sm">Sélectionnez un{mode==="prof"?" professeur":"e salle"} dans le panneau gauche</p>
            </div>
          ) : (
            <div className="flex-1 overflow-auto px-6 py-4">
              <div className="min-w-[560px]">
                <div className="grid grid-cols-[56px_repeat(5,1fr)] mb-1">
                  <div/>
                  {weekDays.map((d,i)=>(
                    <div key={i} className={`text-center py-2 text-xs font-semibold rounded-lg mx-0.5 ${isToday(d)?"bg-blue-800 text-white":"text-slate-500"}`}>
                      <div>{DAYS[i]}</div>
                      <div className={`text-base font-bold mt-0.5 ${isToday(d)?"text-white":"text-slate-800"}`}>{d.getDate()}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-[56px_repeat(5,1fr)] border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <div className="border-r border-slate-100">
                    {HOURS.map(h=><div key={h} className="h-14 flex items-start justify-end pr-3 pt-1"><span className="text-xs text-slate-400">{h}h</span></div>)}
                  </div>
                  {weekDays.map((_,dayIdx)=>(
                    <div key={dayIdx} className="relative border-r border-slate-100 last:border-0">
                      {HOURS.map(h=><div key={h} className="h-14 border-b border-slate-50 last:border-0"/>)}
                      {courses.map((c,ci)=>{
                        const block=getBlock(c,dayIdx);
                        if(!block) return null;
                        const color=colorMap[c.courseSigle]??COLORS[0];
                        const isSel=selectedBlock?.id===c.id;
                        return (
                          <button key={`${c.id??ci}-${dayIdx}`} style={{top:block.top,height:Math.max(block.height,28)}}
                            onClick={()=>setSelectedBlock(isSel?null:c)}
                            className={`absolute left-0.5 right-0.5 rounded-md border px-2 py-1 overflow-hidden text-left hover:z-10 hover:shadow-md transition-all ${color} ${isSel?"ring-2 ring-blue-500 z-10":""}`}>
                            <p className="text-xs font-bold leading-tight truncate">{c.courseSigle}</p>
                            {block.height>40&&<p className="text-xs opacity-75 truncate">{c.classeName}</p>}
                            {block.height>60&&<p className="text-xs opacity-60">{c.startTime}–{c.endTime}</p>}
                          </button>
                        );
                      })}
                      {isToday(weekDays[dayIdx])&&(()=>{
                        const now=today.getHours()+today.getMinutes()/60;
                        if(now<8||now>21) return null;
                        return <div style={{top:(now-8)*56}} className="absolute left-0 right-0 flex items-center z-10"><div className="w-2 h-2 rounded-full bg-blue-600 -ml-1"/><div className="flex-1 h-px bg-blue-500"/></div>;
                      })()}
                    </div>
                  ))}
                </div>
                {courses.length===0&&<p className="text-sm text-slate-400 text-center mt-8">Aucun cours planifié pour cette période.</p>}
              </div>
            </div>
          )}

          {selectedBlock&&(
            <div className="bg-white border-t border-slate-200 px-6 py-3 shrink-0 flex items-center gap-6">
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div><p className="text-xs text-slate-400 uppercase tracking-wide">Cours</p><p className="text-sm font-semibold font-mono text-slate-900">{selectedBlock.courseSigle}</p></div>
                <div><p className="text-xs text-slate-400 uppercase tracking-wide">Salle</p><p className="text-sm text-slate-700">{selectedBlock.classeName}</p></div>
                <div><p className="text-xs text-slate-400 uppercase tracking-wide">Horaire</p><p className="text-sm text-slate-700">{selectedBlock.jours} · {selectedBlock.startTime}–{selectedBlock.endTime}</p></div>
                <div><p className="text-xs text-slate-400 uppercase tracking-wide">Programme</p><p className="text-sm text-slate-700">{selectedBlock.programTitle}</p></div>
              </div>
              <button onClick={()=>setSelectedBlock(null)} className="text-slate-400 hover:text-slate-700 shrink-0 text-lg">✕</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPlanning;