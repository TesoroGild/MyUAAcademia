import Sidebar from "../../sidebar/sidebar";
import adminPicture from "../../../assets/img/Admin.jpg";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiCheck, HiPencil, HiTrash, HiPlus, HiX, HiExclamation } from "react-icons/hi";
import { createProgramS, getProgramsS } from "../../../services/program.service";

// ── Options formulaire ────────────────────────────────────────────────────────
const GRADES = ["Certificat", "BTS", "Baccalauréat", "Master", "Doctorat"];
const DEPARTMENTS = [
  "Art visuel et médiatique", "Enseignement", "Informatique",
  "Mathématiques", "Ressources Humaines",
];
const FACULTIES = [
  "Arts", "Communication", "Développement durable", "Éducation",
  "Gestion", "Langues", "Santé", "Science politique et droit",
  "Sciences", "Sciences humaines",
];

// ── Champ formulaire réutilisable ─────────────────────────────────────────────
const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
    {children}
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

const inputCls = "border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition w-full";

// ── Alert inline ──────────────────────────────────────────────────────────────
const Alert = ({ type, message }) => {
  const s = {
    success: "bg-green-50 border-green-200 text-green-700",
    error:   "bg-red-50 border-red-200 text-red-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
  }[type];
  const Icon = type === "success" ? HiCheck : type === "warning" ? HiExclamation : HiX;
  return (
    <div className={`flex items-center gap-2 border rounded-lg px-4 py-3 text-sm ${s}`}>
      <Icon className="w-4 h-4 shrink-0" />
      {message}
    </div>
  );
};

// ── Page principale ───────────────────────────────────────────────────────────
const ProgramCreate = ({ user }) => {
  const [programs, setPrograms]   = useState([]);
  const [panel, setPanel]         = useState(null);   // null | "create" | "edit" | "delete"
  const [selected, setSelected]   = useState(null);   // programme sélectionné pour edit/delete
  const [alert, setAlert]         = useState(null);   // { type, message }
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: "", programName: "", descriptions: "",
      grade: "", department: "", faculty: "",
      employeeCode: user?.code ?? "",
    },
  });

  useEffect(() => { getPrograms(); }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const getPrograms = async () => {
    try {
      const list = await getProgramsS();
      setPrograms(list);
    } catch (e) { console.error(e); }
  };

  const openCreate = () => {
    reset({ title: "", programName: "", descriptions: "", grade: "", department: "", faculty: "", employeeCode: user?.code ?? "" });
    setSelected(null);
    setPanel("create");
  };

  const openEdit = (program) => {
    setSelected(program);
    setValue("title",        program.title);
    setValue("programName",  program.programName);
    setValue("descriptions", program.descriptions);
    setValue("grade",        program.grade);
    setValue("department",   program.department);
    setValue("faculty",      program.faculty);
    setPanel("edit");
  };

  const openDelete = (program) => {
    setSelected(program);
    setPanel("delete");
  };

  const closePanel = () => { setPanel(null); setSelected(null); };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await createProgramS(data);
      if (result) {
        showAlert("success", `Programme "${data.title}" créé avec succès.`);
        reset();
        setPanel(null);
        await getPrograms();
      } else {
        showAlert("error", "Une erreur est survenue lors de la création.");
      }
    } catch (e) {
      console.error(e);
      showAlert("warning", "Impossible de contacter le serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  const GRADE_BADGE = {
    "Certificat":   "bg-slate-100 text-slate-600 border-slate-200",
    "BTS":          "bg-teal-50 text-teal-700 border-teal-100",
    "Baccalauréat": "bg-blue-50 text-blue-700 border-blue-100",
    "Master":       "bg-violet-50 text-violet-700 border-violet-100",
    "Doctorat":     "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar user={user} profilePic={adminPicture} />

      <main className="flex-1 flex overflow-hidden">

        {/* ── Colonne liste ── */}
        <div className={`flex flex-col overflow-hidden transition-all duration-200 ${panel ? "w-1/2 border-r border-slate-200" : "w-full"}`}>

          {/* Top bar */}
          <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
            <div>
              <p className="text-sm font-semibold text-slate-900">Gestion des programmes</p>
              <p className="text-xs text-slate-400">{programs.length} programme{programs.length > 1 ? "s" : ""}</p>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <HiPlus className="w-4 h-4" />
              Nouveau programme
            </button>
          </div>

          {/* Alertes */}
          {alert && (
            <div className="px-8 pt-4">
              <Alert type={alert.type} message={alert.message} />
            </div>
          )}

          {/* Liste */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {programs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm">
                Aucun programme enregistré.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {programs.map((p) => (
                  <div
                    key={p.title}
                    className={`bg-white border rounded-xl px-5 py-4 flex items-center justify-between gap-4 transition-colors ${
                      selected?.title === p.title ? "border-blue-300 bg-blue-50/30" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-semibold border px-2 py-0.5 rounded-full shrink-0 ${GRADE_BADGE[p.grade] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                          {p.grade}
                        </span>
                        <p className="text-sm font-semibold text-slate-900 truncate">{p.title}</p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 truncate">{p.programName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{p.faculty} · {p.department}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-2 rounded-lg border border-slate-200 hover:border-blue-700 hover:text-blue-800 text-slate-500 transition-colors"
                        title="Modifier"
                      >
                        <HiPencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDelete(p)}
                        className="p-2 rounded-lg border border-slate-200 hover:border-red-300 hover:text-red-600 text-slate-500 transition-colors"
                        title="Supprimer"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Panneau latéral ── */}
        {panel && (
          <div className="w-1/2 flex flex-col overflow-hidden bg-white">

            {/* En-tête panneau */}
            <div className="h-16 border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
              <p className="text-sm font-semibold text-slate-900">
                {panel === "create" && "Nouveau programme"}
                {panel === "edit"   && `Modifier — ${selected?.title}`}
                {panel === "delete" && "Supprimer un programme"}
              </p>
              <button onClick={closePanel} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <HiX className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6">

              {/* ── Formulaire Créer / Modifier ── */}
              {(panel === "create" || panel === "edit") && (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

                  <Field label="Titre" error={errors.title?.message}>
                    <input
                      type="text"
                      placeholder="ex. INF-BACC"
                      className={inputCls}
                      {...register("title", { required: "Le titre est requis." })}
                    />
                  </Field>

                  <Field label="Nom du programme" error={errors.programName?.message}>
                    <input
                      type="text"
                      placeholder="ex. Baccalauréat en informatique"
                      className={inputCls}
                      {...register("programName", { required: "Le nom est requis." })}
                    />
                  </Field>

                  <Field label="Description" error={errors.descriptions?.message}>
                    <textarea
                      rows={3}
                      placeholder="Décrivez le programme..."
                      className={inputCls}
                      {...register("descriptions", { required: "La description est requise." })}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Niveau d'étude" error={errors.grade?.message}>
                      <select className={inputCls} {...register("grade", { required: "Le niveau est requis." })}>
                        <option value="" disabled>Sélectionner</option>
                        {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </Field>

                    <Field label="Département" error={errors.department?.message}>
                      <select className={inputCls} {...register("department", { required: "Le département est requis." })}>
                        <option value="" disabled>Sélectionner</option>
                        {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </Field>
                  </div>

                  <Field label="Faculté" error={errors.faculty?.message}>
                    <select className={inputCls} {...register("faculty", { required: "La faculté est requise." })}>
                      <option value="" disabled>Sélectionner</option>
                      {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </Field>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
                    >
                      {isLoading ? "Enregistrement..." : panel === "create" ? "Créer le programme" : "Enregistrer les modifications"}
                    </button>
                    <button type="button" onClick={closePanel} className="px-4 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-lg text-sm transition-colors">
                      Annuler
                    </button>
                  </div>
                </form>
              )}

              {/* ── Confirmation suppression ── */}
              {panel === "delete" && selected && (
                <div className="flex flex-col gap-6">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                    <p className="text-sm font-semibold text-red-800 mb-1">Confirmer la suppression</p>
                    <p className="text-sm text-red-700">
                      Vous êtes sur le point de supprimer le programme <strong>{selected.title}</strong> — {selected.programName}.
                      Cette action est irréversible.
                    </p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-2">
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Détails</p>
                    <p className="text-sm text-slate-700"><span className="text-slate-400">Niveau :</span> {selected.grade}</p>
                    <p className="text-sm text-slate-700"><span className="text-slate-400">Faculté :</span> {selected.faculty}</p>
                    <p className="text-sm text-slate-700"><span className="text-slate-400">Département :</span> {selected.department}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        // TODO : brancher ton service de suppression ici
                        showAlert("success", `Programme "${selected.title}" supprimé.`);
                        setPrograms((prev) => prev.filter((p) => p.title !== selected.title));
                        closePanel();
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
                    >
                      Confirmer la suppression
                    </button>
                    <button onClick={closePanel} className="px-4 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-lg text-sm transition-colors">
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProgramCreate;