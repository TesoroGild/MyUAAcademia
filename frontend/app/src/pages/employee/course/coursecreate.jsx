import Sidebar from "../../sidebar/sidebar";
import adminPicture from "../../../assets/img/Admin.jpg";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiCheck, HiExclamation, HiX, HiPlus } from "react-icons/hi";
import { createClasseCourseS, getClassesCoursesS, getClassroomsS, getProgramCoursesS } from "../../../services/course.service";
import { getProgramsS } from "../../../services/program.service";

// ── Helpers ───────────────────────────────────────────────────────────────────
const inputCls = "border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition w-full bg-white";

const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
    {children}
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

const Alert = ({ type, message }) => {
  const s = {
    success: "bg-green-50 border-green-200 text-green-700",
    error:   "bg-red-50 border-red-200 text-red-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
  }[type];
  const Icon = type === "success" ? HiCheck : type === "warning" ? HiExclamation : HiX;
  return (
    <div className={`flex items-center gap-2 border rounded-lg px-4 py-3 text-sm ${s}`}>
      <Icon className="w-4 h-4 shrink-0" />{message}
    </div>
  );
};

const JOURS   = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const PLAGES  = ["09:30 - 12:30", "13:30 - 16:30", "18:00 - 21:00"];
const currentYear = new Date().getFullYear();

// ── Résumé d'une séance planifiée ─────────────────────────────────────────────
const SeanceCard = ({ seance }) => (
  <div className="bg-white border border-green-200 rounded-xl p-4 flex items-start gap-4">
    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
      <HiCheck className="w-4 h-4 text-green-600" />
    </div>
    <div className="min-w-0">
      <p className="text-sm font-semibold text-slate-900">{seance.courseSigle}</p>
      <p className="text-xs text-slate-500 mt-0.5">
        {seance.sessionCourse} {seance.yearCourse} · {seance.jours} · {seance.startTime}–{seance.endTime}
      </p>
      <p className="text-xs text-slate-400">{seance.classeName}</p>
    </div>
  </div>
);

// ── Page principale ───────────────────────────────────────────────────────────
const CourseCreate = ({ employeeCo }) => {
  const [programs, setPrograms]       = useState([]);
  const [courses, setCourses]         = useState([]);
  const [classrooms, setClassrooms]   = useState([]);
  const [classCourses, setClassCourses] = useState([]);
  const [session, setSession]         = useState("");
  const [programTitle, setProgramTitle] = useState("");
  const [alert, setAlert]             = useState(null);
  const [isLoading, setIsLoading]     = useState(false);
  const [recentSeances, setRecentSeances] = useState([]); // séances ajoutées cette session

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      yearCourse: "", classeName: "", courseSigle: "",
      jours: "", horaire: "", startTime: "", endTime: "",
    },
  });

  const watchYear    = watch("yearCourse");
  const watchCourse  = watch("courseSigle");
  const watchJour    = watch("jours");
  const watchHoraire = watch("horaire");

  useEffect(() => { getPrograms(); getClassrooms(); getClassesCourses(); }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const getPrograms    = async () => { try { setPrograms(await getProgramsS()); } catch (e) { console.error(e); } };
  const getClassrooms  = async () => { try { setClassrooms(await getClassroomsS()); } catch (e) { console.error(e); } };
  const getClassesCourses = async () => { try { setClassCourses(await getClassesCoursesS(programTitle)); } catch (e) { console.error(e); } };

  const handleProgramChange = async (title) => {
    setProgramTitle(title);
    setValue("courseSigle", "");
    if (!title) { setCourses([]); return; }
    try { setCourses(await getProgramCoursesS(title)); } catch (e) { console.error(e); }
  };

  const onSubmit = async (data) => {
    const [start, end] = data.horaire.split(" - ");
    const payload = {
      classeName:    data.classeName,
      sessionCourse: session,
      courseSigle:   data.courseSigle,
      jours:         data.jours,
      startTime:     start,
      endTime:       end,
      yearCourse:    data.yearCourse,
      employeeCode:  employeeCo?.code,
    };

    // Doublon
    const exists = classCourses.find((c) =>
      c.classeName    === payload.classeName    &&
      c.sessionCourse === payload.sessionCourse &&
      c.yearCourse    === payload.yearCourse    &&
      c.jours         === payload.jours         &&
      c.startTime     === payload.startTime     &&
      c.endTime       === payload.endTime
    );
    if (exists) { showAlert("error", "Cette salle est déjà occupée à cette plage horaire."); return; }

    setIsLoading(true);
    try {
      const result = await createClasseCourseS(payload);
      if (result) {
        showAlert("success", `Séance créée — ${payload.courseSigle} · ${payload.jours} ${payload.startTime}–${payload.endTime}`);
        setRecentSeances((prev) => [{ ...payload }, ...prev]);
        await getClassesCourses();
        reset({ yearCourse: data.yearCourse, classeName: "", courseSigle: "", jours: "", horaire: "", startTime: "", endTime: "" });
        // On garde année + session + programme pour enchaîner rapidement
        setSession(session);
        setProgramTitle(programTitle);
        setValue("yearCourse", data.yearCourse);
      } else {
        showAlert("error", "Une erreur est survenue.");
      }
    } catch {
      showAlert("warning", "Impossible de contacter le serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  // Indicateur d'avancement du formulaire
  const steps = [
    { label: "Année",     done: !!watchYear },
    { label: "Session",   done: !!session },
    { label: "Programme", done: !!programTitle },
    { label: "Cours",     done: !!watchCourse },
    { label: "Jour",      done: !!watchJour },
    { label: "Horaire",   done: !!watchHoraire },
  ];
  const progress = steps.filter((s) => s.done).length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar userCo={employeeCo} profilePic={adminPicture} />

      <main className="flex-1 overflow-y-auto">

        {/* Top bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-8 sticky top-0 z-10">
          <div>
            <p className="text-sm font-semibold text-slate-900">Planification des séances</p>
            <p className="text-xs text-slate-400">Cours offerts par session</p>
          </div>
        </div>

        <div className="p-8 max-w-5xl grid lg:grid-cols-3 gap-6">

          {/* ── Formulaire (2/3) ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Barre de progression */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Progression</p>
                <p className="text-xs text-slate-400">{progress} / {steps.length} champs</p>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3">
                <div
                  className="h-1.5 bg-blue-700 rounded-full transition-all"
                  style={{ width: `${(progress / steps.length) * 100}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {steps.map((s) => (
                  <span
                    key={s.label}
                    className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                      s.done
                        ? "bg-blue-50 text-blue-700 border-blue-100"
                        : "bg-white text-slate-400 border-slate-200"
                    }`}
                  >
                    {s.done && "✓ "}{s.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Alertes */}
            {alert && <Alert type={alert.type} message={alert.message} />}

            {/* Formulaire */}
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-5">

              <p className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
                Nouvelle séance de cours
              </p>

              {/* Ligne 1 : Année + Session */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Année académique" error={errors.yearCourse?.message}>
                  <select className={inputCls} {...register("yearCourse", { required: "Requis." })}>
                    <option value="">Sélectionner</option>
                    <option value={currentYear}>{currentYear}</option>
                    <option value={currentYear + 1}>{currentYear + 1}</option>
                  </select>
                </Field>

                <Field label="Session">
                  <select
                    className={inputCls}
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                  >
                    <option value="">Sélectionner</option>
                    <option value="Hiver">Hiver</option>
                    <option value="Été">Été</option>
                    <option value="Automne">Automne</option>
                  </select>
                </Field>
              </div>

              {/* Ligne 2 : Programme + Cours */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Programme">
                  <select
                    className={inputCls}
                    value={programTitle}
                    onChange={(e) => handleProgramChange(e.target.value)}
                  >
                    <option value="">Sélectionner</option>
                    {programs.map((p) => (
                      <option key={p.title} value={p.title}>
                        {p.title} — {p.programName}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Cours" error={errors.courseSigle?.message}>
                  <select
                    className={`${inputCls} ${!programTitle ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!programTitle}
                    {...register("courseSigle", { required: "Requis." })}
                  >
                    <option value="">
                      {programTitle ? "Sélectionner" : "Choisir d'abord un programme"}
                    </option>
                    {courses.map((c) => (
                      <option key={c.sigle} value={c.sigle}>
                        {c.sigle} — {c.fullName}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Salle */}
              <Field label="Salle de classe" error={errors.classeName?.message}>
                <select className={inputCls} {...register("classeName", { required: "Requis." })}>
                  <option value="">Sélectionner une salle</option>
                  {classrooms.map((r) => (
                    <option key={r.classeName} value={r.classeName}>
                      {r.classeName} · {r.typeOfClasse} · {r.capacity} places
                    </option>
                  ))}
                </select>
              </Field>

              {/* Ligne 3 : Jour + Plage horaire */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Jour" error={errors.jours?.message}>
                  <select className={inputCls} {...register("jours", { required: "Requis." })}>
                    <option value="">Sélectionner</option>
                    {JOURS.map((j) => <option key={j} value={j}>{j}</option>)}
                  </select>
                </Field>

                <Field label="Plage horaire" error={errors.horaire?.message}>
                  <select
                    className={inputCls}
                    {...register("horaire", { required: "Requis." })}
                    onChange={(e) => {
                      setValue("horaire", e.target.value);
                      const [start, end] = e.target.value.split(" - ");
                      setValue("startTime", start);
                      setValue("endTime",   end);
                    }}
                  >
                    <option value="">Sélectionner</option>
                    {PLAGES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>
              </div>

              {/* Récapitulatif avant soumission */}
              {watchYear && session && programTitle && watchCourse && watchJour && watchHoraire && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
                  <p className="font-semibold mb-1">Récapitulatif</p>
                  <p>{watchCourse} · {session} {watchYear} · {watchJour} · {watchHoraire}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? "Enregistrement..." : (
                  <><HiPlus className="w-4 h-4" /> Créer la séance</>
                )}
              </button>
            </form>
          </div>

          {/* ── Colonne droite : séances récentes ── */}
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Séances ajoutées</p>
              <p className="text-xs text-slate-400 mb-4">Cette session de travail</p>
              {recentSeances.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">
                  Aucune séance créée pour l'instant.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {recentSeances.map((s, i) => <SeanceCard key={i} seance={s} />)}
                </div>
              )}
            </div>

            {/* Rappel des salles disponibles */}
            {classrooms.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Salles disponibles</p>
                <div className="flex flex-col gap-2">
                  {classrooms.map((r) => (
                    <div key={r.classeName} className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{r.classeName}</span>
                      <span className="text-slate-400">{r.capacity} pl. · {r.typeOfClasse}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default CourseCreate;