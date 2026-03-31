import Sidebar from "../../sidebar/sidebar";
import adminPicture from "../../../assets/img/Admin.jpg";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiCheck, HiX, HiPlus, HiPencil, HiExclamation } from "react-icons/hi";
import { createCourseS, getCoursesS } from "../../../services/course.service";
import { getProgramsS } from "../../../services/program.service";

// ── Helpers ───────────────────────────────────────────────────────────────────
const inputCls = "border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition w-full";

const Field = ({ label, error, hint, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
    {children}
    {hint  && <p className="text-xs text-slate-400">{hint}</p>}
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

// Badge session Oui/Non
const SessionBadge = ({ value }) =>
  value == 1 || value === true ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full">
      <HiCheck className="w-3 h-3" /> Oui
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full">
      <HiX className="w-3 h-3" /> Non
    </span>
  );

// Toggle Oui/Non pour le formulaire
const SessionToggle = ({ label, name, register, error }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
    <div className="flex gap-4">
      <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
        <input type="radio" value="1" {...register(name, { required: "Requis" })} className="accent-blue-700" />
        Oui
      </label>
      <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
        <input type="radio" value="0" {...register(name, { required: "Requis" })} className="accent-blue-700" />
        Non
      </label>
    </div>
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

// ── Page principale ───────────────────────────────────────────────────────────
const Class = ({ user }) => {
  const [courseList, setCourseList]   = useState([]);
  const [programs, setPrograms]       = useState([]);
  const [programTitle, setProgramTitle] = useState("");
  const [panel, setPanel]             = useState(null);   // null | "create" | "edit"
  const [selected, setSelected]       = useState(null);
  const [alert, setAlert]             = useState(null);
  const [isLoading, setIsLoading]     = useState(false);
  const [filterProgram, setFilterProgram] = useState(""); // filtre liste

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: { sigle: "", fullName: "", price: "", credits: "", winter: "", summer: "", autumn: "" },
  });

  useEffect(() => { getCourses(); getPrograms(); }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const getCourses = async () => {
    try { setCourseList(await getCoursesS()); } catch (e) { console.error(e); }
  };

  const getPrograms = async () => {
    try { setPrograms(await getProgramsS()); } catch (e) { console.error(e); }
  };

  const openCreate = () => {
    reset({ sigle: "", fullName: "", price: "", credits: "", winter: "", summer: "", autumn: "" });
    setProgramTitle("");
    setSelected(null);
    setPanel("create");
  };

  const openEdit = (course) => {
    setSelected(course);
    setValue("sigle",    course.sigle);
    setValue("fullName", course.fullName);
    setValue("price",    course.price);
    setValue("credits",  String(course.credits));
    setValue("winter",   String(course.winter));
    setValue("summer",   String(course.summer));
    setValue("autumn",   String(course.autumn));
    setProgramTitle(course.programTitle);
    setPanel("edit");
  };

  const closePanel = () => { setPanel(null); setSelected(null); };

  const onSubmit = async (data) => {
    // Vérif doublon sigle (création seulement)
    if (panel === "create" && courseList.some((c) => c.sigle === data.sigle)) {
      showAlert("error", `Le sigle "${data.sigle}" existe déjà.`);
      return;
    }
    setIsLoading(true);
    try {
      const payload = { ...data, employeeCode: user?.code, programTitle };
      const result  = await createCourseS(payload);
      if (result) {
        showAlert("success", panel === "create" ? `Cours "${data.sigle}" créé avec succès.` : `Cours "${data.sigle}" modifié.`);
        await getCourses();
        closePanel();
      } else {
        showAlert("error", "Une erreur est survenue.");
      }
    } catch {
      showAlert("warning", "Impossible de contacter le serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filtre liste par programme
  const displayed = filterProgram
    ? courseList.filter((c) => c.programTitle === filterProgram)
    : courseList;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar user={user} profilePic={adminPicture} />

      <main className="flex-1 flex overflow-hidden">

        {/* ── Colonne liste ── */}
        <div className={`flex flex-col overflow-hidden transition-all duration-200 ${panel ? "w-1/2 border-r border-slate-200" : "w-full"}`}>

          {/* Top bar */}
          <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
            <div>
              <p className="text-sm font-semibold text-slate-900">Cours du programme</p>
              <p className="text-xs text-slate-400">{courseList.length} cours enregistré{courseList.length > 1 ? "s" : ""}</p>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <HiPlus className="w-4 h-4" />
              Nouveau cours
            </button>
          </div>

          {alert && <div className="px-8 pt-4"><Alert type={alert.type} message={alert.message} /></div>}

          {/* Filtre programme */}
          <div className="px-8 pt-4 shrink-0">
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white w-64"
            >
              <option value="">Tous les programmes</option>
              {programs.map((p) => (
                <option key={p.title} value={p.title}>{p.title} — {p.programName}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto px-8 py-4">
            {displayed.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
                Aucun cours trouvé.
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {["Programme", "Sigle", "Intitulé", "Prix", "Crédits", "Hiver", "Été", "Automne", ""].map((h) => (
                        <th key={h} className="text-left py-3 px-4 text-xs text-slate-400 font-medium uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.map((course, i) => (
                      <tr
                        key={course.sigle}
                        className={`border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${
                          selected?.sigle === course.sigle ? "bg-blue-50/40" : i % 2 === 1 ? "bg-slate-50/40" : ""
                        }`}
                      >
                        <td className="py-3 px-4 text-xs text-slate-500 max-w-[120px] truncate">{course.programTitle}</td>
                        <td className="py-3 px-4 font-mono text-xs font-bold text-slate-800">{course.sigle}</td>
                        <td className="py-3 px-4 text-slate-700 max-w-[160px] truncate">{course.fullName}</td>
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{course.price} $</td>
                        <td className="py-3 px-4 text-center text-slate-600">{course.credits}</td>
                        <td className="py-3 px-4"><SessionBadge value={course.winter} /></td>
                        <td className="py-3 px-4"><SessionBadge value={course.summer} /></td>
                        <td className="py-3 px-4"><SessionBadge value={course.autumn} /></td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => openEdit(course)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-700 hover:text-blue-800 text-slate-400 transition-colors"
                            title="Modifier"
                          >
                            <HiPencil className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ── Panneau latéral ── */}
        {panel && (
          <div className="w-1/2 flex flex-col overflow-hidden bg-white">
            <div className="h-16 border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
              <p className="text-sm font-semibold text-slate-900">
                {panel === "create" ? "Nouveau cours" : `Modifier — ${selected?.sigle}`}
              </p>
              <button onClick={closePanel} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <HiX className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

                {/* Programme */}
                <Field label="Programme">
                  <select
                    value={programTitle}
                    onChange={(e) => setProgramTitle(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Sélectionner un programme</option>
                    {programs.map((p) => (
                      <option key={p.title} value={p.title}>
                        {p.title} — {p.grade} : {p.programName}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Sigle" error={errors.sigle?.message}>
                    <input
                      type="text"
                      placeholder="ex. INF3405"
                      className={inputCls}
                      disabled={panel === "edit"}
                      {...register("sigle", { required: "Le sigle est requis." })}
                    />
                  </Field>
                  <Field label="Crédits" error={errors.credits?.message}>
                    <div className="flex gap-3 flex-wrap pt-1">
                      {[1, 2, 3, 45].map((v) => (
                        <label key={v} className="flex items-center gap-1.5 cursor-pointer text-sm text-slate-700">
                          <input
                            type="radio"
                            value={String(v)}
                            {...register("credits", { required: "Requis." })}
                            className="accent-blue-700"
                          />
                          {v}
                        </label>
                      ))}
                    </div>
                    {errors.credits && <p className="text-xs text-red-600">{errors.credits.message}</p>}
                  </Field>
                </div>

                <Field label="Intitulé complet" error={errors.fullName?.message}>
                  <input
                    type="text"
                    placeholder="ex. Réseaux informatiques"
                    className={inputCls}
                    {...register("fullName", { required: "L'intitulé est requis." })}
                  />
                </Field>

                <Field label="Prix ($)" error={errors.price?.message}>
                  <input
                    type="number"
                    placeholder="ex. 450"
                    className={inputCls}
                    {...register("price", { required: "Le prix est requis." })}
                  />
                </Field>

                {/* Sessions — la partie clé pour la modif */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                    Sessions disponibles
                    {panel === "edit" && (
                      <span className="ml-2 font-normal text-blue-700 normal-case">modifiable si le cours ne peut plus être offert</span>
                    )}
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <SessionToggle label="Hiver"   name="winter" register={register} error={errors.winter?.message} />
                    <SessionToggle label="Été"     name="summer" register={register} error={errors.summer?.message} />
                    <SessionToggle label="Automne" name="autumn" register={register} error={errors.autumn?.message} />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
                  >
                    {isLoading ? "Enregistrement..." : panel === "create" ? "Créer le cours" : "Enregistrer les modifications"}
                  </button>
                  <button
                    type="button"
                    onClick={closePanel}
                    className="px-4 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-lg text-sm transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Class;