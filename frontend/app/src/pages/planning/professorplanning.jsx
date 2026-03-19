import Sidebar from "../sidebar/sidebar";
import userPicture from "../../assets/img/User_Icon.png";
import { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { getClassesCoursesS } from "../../services/course.service";

const DAYS  = ["Lun", "Mar", "Mer", "Jeu", "Ven"];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8);
const DAY_MAP = { lundi:0, mardi:1, mercredi:2, jeudi:3, vendredi:4, lun:0, mar:1, mer:2, jeu:3, ven:4 };
const COLORS  = [
  "bg-blue-100 border-blue-300 text-blue-900",
  "bg-violet-100 border-violet-300 text-violet-900",
  "bg-teal-100 border-teal-300 text-teal-900",
  "bg-amber-100 border-amber-300 text-amber-900",
  "bg-rose-100 border-rose-300 text-rose-900",
];

const parseTime = (t) => { if (!t) return 0; const [h,m] = t.replace("h",":").split(":").map(Number); return h + (m||0)/60; };
const getMondayOf = (d) => { const r=new Date(d); const day=r.getDay(); r.setDate(r.getDate()+(day===0?-6:1-day)); r.setHours(0,0,0,0); return r; };
const addDays = (d,n) => { const r=new Date(d); r.setDate(r.getDate()+n); return r; };
const fmtDate = (d) => d.toLocaleDateString("fr-CA",{day:"numeric",month:"short"});

export const ProfessorAcademicPlanning = ({ employeeCo }) => {
  const [courses, setCourses]     = useState([]);
  const [weekStart, setWeekStart] = useState(getMondayOf(new Date()));
  const today = new Date();

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res  = await getClassesCoursesS("");
      const all  = Array.isArray(res) ? res : res?.courses ?? res?.data ?? [];
      setCourses(all.filter((c) => c.professorCode === employeeCo?.code || c.professorCode === employeeCo?.userCode));
    } catch (e) { console.error(e); }
  };

  const colorMap = {};
  [...new Set(courses.map((c) => c.courseSigle))].forEach((s,i) => { colorMap[s] = COLORS[i % COLORS.length]; });

  const weekDays = DAYS.map((_,i) => addDays(weekStart,i));
  const isToday  = (d) => d.toDateString() === today.toDateString();

  const getBlock = (c, dayIdx) => {
    const di = DAY_MAP[(c.jours??"").toLowerCase().trim()] ?? -1;
    if (di !== dayIdx) return null;
    const s = parseTime(c.startTime), e = parseTime(c.endTime);
    if (!s||!e||s<8||e>21) return null;
    return { top:(s-8)*56, height:(e-s)*56 };
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar userCo={employeeCo} profilePic={userPicture} />
      <main className="flex-1 flex flex-col overflow-hidden">

        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div>
            <p className="text-sm font-semibold text-slate-900">Mes cours — planning académique</p>
            <p className="text-xs text-slate-400">{courses.length} cours assigné{courses.length>1?"s":""} cette session</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setWeekStart(addDays(weekStart,-7))} className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-700 transition-colors"><HiChevronLeft className="w-4 h-4 text-slate-600"/></button>
            <span className="text-sm font-medium text-slate-700 min-w-[160px] text-center">{fmtDate(weekStart)} – {fmtDate(addDays(weekStart,4))}</span>
            <button onClick={()=>setWeekStart(addDays(weekStart,7))} className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-700 transition-colors"><HiChevronRight className="w-4 h-4 text-slate-600"/></button>
            <button onClick={()=>setWeekStart(getMondayOf(new Date()))} className="text-xs font-medium text-blue-700 border border-blue-200 hover:border-blue-400 px-3 py-1.5 rounded-lg transition-colors">Aujourd'hui</button>
          </div>
        </div>

        {courses.length > 0 && (
          <div className="px-8 py-2 bg-white border-b border-slate-100 flex flex-wrap gap-2 shrink-0">
            {Object.entries(colorMap).map(([sigle, color]) => (
              <span key={sigle} className={`text-xs font-mono font-medium border px-2.5 py-1 rounded-full ${color}`}>{sigle}</span>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-auto px-6 py-4">
          <div className="min-w-[640px]">
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
                    return (
                      <div key={`${c.id??ci}-${dayIdx}`} style={{top:block.top,height:Math.max(block.height,28)}}
                        className={`absolute left-0.5 right-0.5 rounded-md border px-2 py-1 overflow-hidden ${color}`}>
                        <p className="text-xs font-bold leading-tight truncate">{c.courseSigle}</p>
                        {block.height>40&&<p className="text-xs opacity-75 truncate">{c.classeName}</p>}
                        {block.height>60&&<p className="text-xs opacity-60">{c.startTime}–{c.endTime}</p>}
                      </div>
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
            {courses.length===0&&<p className="text-sm text-slate-400 text-center mt-8">Aucun cours assigné pour cette session.</p>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfessorAcademicPlanning;