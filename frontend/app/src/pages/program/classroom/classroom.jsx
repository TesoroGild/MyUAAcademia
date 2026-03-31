import Sidebar from "../../sidebar/sidebar";
import adminPicture from "../../../assets/img/Admin.jpg";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiCheck, HiExclamation, HiX, HiPlus, HiPencil, HiLockClosed } from "react-icons/hi";
import { createClassroomS, getClassroomsS } from "../../../services/course.service";

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

// Types de salle prédéfinis — à adapter selon ton établissement
const TYPES = ["Amphithéâtre", "Salle de cours", "Laboratoire informatique", "Laboratoire scientifique", "Salle de séminaire", "Salle de conférence"];

// Badge capacité
const CapacityBadge = ({ capacity }) => {
  const n = Number(capacity);
  const cls =
    n >= 100 ? "bg-purple-50 text-purple-700 border-purple-100" :
    n >= 40  ? "bg-blue-50 text-blue-700 border-blue-100"       :
               "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span className={`text-xs font-medium border px-2 py-0.5 rounded-full ${cls}`}>
      {n} places
    </span>
  );
};

// ── Page principale ───────────────────────────────────────────────────────────
const Classroom = ({ user }) => {
  const [classroomList, setClassroomList] = useState([]);
  const [panel, setPanel]       = useState(null);   // null | "create" | "edit" | "close"
  const [selected, setSelected] = useState(null);
  const [alert, setAlert]       = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState("");

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: { classeName: "", capacity: "", typeOfClasse: "" },
  });

  useEffect(() => { getClassrooms(); }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const getClassrooms = async () => {
    try { setClassroomList(await getClassroomsS()); } catch (e) { console.error(e); }
  };

  const openCreate = () => {
    reset({ classeName: "", capacity: "", typeOfClasse: "" });
    setSelected(null);
    setPanel("create");
  };

  const openEdit = (room) => {
    setSelected(room);
    setValue("classeName",   room.classeName);
    setValue("capacity",     room.capacity);
    setValue("typeOfClasse", room.typeOfClasse);
    setPanel("edit");
  };

  const openClose = (room) => {
    setSelected(room);
    setPanel("close");
  };

  const closePanel = () => { setPanel(null); setSelected(null); };

  const onSubmit = async (data) => {
    // Doublon (création seulement)
    if (panel === "create" && classroomList.some((r) => r.classeName === data.classeName)) {
      showAlert("error", `La salle "${data.classeName}" existe déjà.`);
      return;
    }
    setIsLoading(true);
    try {
      const payload = { ...data, employeeCode: user?.code };
      const result  = await createClassroomS(payload);
      if (result) {
        showAlert("success", panel === "create"
          ? `Salle "${data.classeName}" ajoutée.`
          : `Salle "${data.classeName}" mise à jour.`
        );
        await getClassrooms();
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

  const displayed = filterType
    ? classroomList.filter((r) => r.typeOfClasse === filterType)
    : classroomList;

  // Stats rapides
  const totalCapacity = classroomList.reduce((acc, r) => acc + Number(r.capacity || 0), 0);
  const types = [...new Set(classroomList.map((r) => r.typeOfClasse).filter(Boolean))];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar user={user} profilePic={adminPicture} />

      <main className="flex-1 flex overflow-hidden">

        {/* ── Colonne liste ── */}
        <div className={`flex flex-col overflow-hidden transition-all duration-200 ${panel ? "w-1/2 border-r border-slate-200" : "w-full"}`}>

          {/* Top bar */}
          <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
            <div>
              <p className="text-sm font-semibold text-slate-900">Gestion des salles</p>
              <p className="text-xs text-slate-400">{classroomList.length} salle{classroomList.length > 1 ? "s" : ""} · {totalCapacity} places au total</p>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <HiPlus className="w-4 h-4" />
              Nouvelle salle
            </button>
          </div>

          {alert && <div className="px-8 pt-4"><Alert type={alert.type} message={alert.message} /></div>}

          {/* Stats + filtre */}
          <div className="px-8 pt-4 pb-2 flex items-center gap-4 shrink-0">
            {/* Mini stats par type */}
            <div className="flex gap-2 flex-wrap flex-1">
              {types.map((t) => {
                const count = classroomList.filter((r) => r.typeOfClasse === t).length;
                return (
                  <button
                    key={t}
                    onClick={() => setFilterType(filterType === t ? "" : t)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                      filterType === t
                        ? "bg-blue-800 text-white border-blue-800"
                        : "bg-white text-slate-600 border-slate-200 hover:border-blue-700"
                    }`}
                  >
                    {t} ({count})
                  </button>
                );
              })}
              {filterType && (
                <button onClick={() => setFilterType("")} className="text-xs text-slate-400 hover:text-slate-700 px-2">
                  Réinitialiser
                </button>
              )}
            </div>
          </div>

          {/* Liste */}
          <div className="flex-1 overflow-y-auto px-8 py-2">
            {displayed.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
                Aucune salle trouvée.
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {["Code", "Type", "Capacité", ""].map((h) => (
                        <th key={h} className="text-left py-3 px-5 text-xs text-slate-400 font-medium uppercase tracking-wide">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.map((room, i) => (
                      <tr
                        key={room.classeName}
                        className={`border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${
                          selected?.classeName === room.classeName ? "bg-blue-50/40" : i % 2 === 1 ? "bg-slate-50/30" : ""
                        }`}
                      >
                        <td className="py-3 px-5 font-mono text-xs font-bold text-slate-800">{room.classeName}</td>
                        <td className="py-3 px-5 text-slate-600">{room.typeOfClasse}</td>
                        <td className="py-3 px-5"><CapacityBadge capacity={room.capacity} /></td>
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() => openEdit(room)}
                              className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-700 hover:text-blue-800 text-slate-400 transition-colors"
                              title="Modifier"
                            >
                              <HiPencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openClose(room)}
                              className="p-1.5 rounded-lg border border-slate-200 hover:border-amber-400 hover:text-amber-600 text-slate-400 transition-colors"
                              title="Fermer temporairement"
                            >
                              <HiLockClosed className="w-3.5 h-3.5" />
                            </button>
                          </div>
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
                {panel === "create" && "Nouvelle salle"}
                {panel === "edit"   && `Modifier — ${selected?.classeName}`}
                {panel === "close"  && `Fermer — ${selected?.classeName}`}
              </p>
              <button onClick={closePanel} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <HiX className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6">

              {/* ── Formulaire Créer / Modifier ── */}
              {(panel === "create" || panel === "edit") && (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

                  <Field label="Code de la salle" error={errors.classeName?.message} hint="ex. A-1420, PK-R610, SH-3620">
                    <input
                      type="text"
                      placeholder="ex. A-1420"
                      className={inputCls}
                      disabled={panel === "edit"}
                      {...register("classeName", { required: "Le code est requis." })}
                    />
                  </Field>

                  <Field label="Type de salle" error={errors.typeOfClasse?.message}>
                    <select className={inputCls} {...register("typeOfClasse", { required: "Le type est requis." })}>
                      <option value="">Sélectionner</option>
                      {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>

                  <Field label="Capacité (places)" error={errors.capacity?.message}>
                    <input
                      type="number"
                      min="1"
                      placeholder="ex. 45"
                      className={inputCls}
                      {...register("capacity", {
                        required: "La capacité est requise.",
                        min: { value: 1, message: "Minimum 1 place." },
                      })}
                    />
                  </Field>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
                    >
                      {isLoading ? "Enregistrement..." : panel === "create" ? "Ajouter la salle" : "Enregistrer"}
                    </button>
                    <button type="button" onClick={closePanel} className="px-4 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-lg text-sm transition-colors">
                      Annuler
                    </button>
                  </div>
                </form>
              )}

              {/* ── Fermeture temporaire ── */}
              {panel === "close" && selected && (
                <div className="flex flex-col gap-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                    <p className="text-sm font-semibold text-amber-800 mb-1">Fermer temporairement cette salle</p>
                    <p className="text-sm text-amber-700">
                      La salle <strong>{selected.classeName}</strong> ne sera plus disponible pour la planification des séances.
                      Cette action est réversible.
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-2">
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Détails</p>
                    <p className="text-sm text-slate-700"><span className="text-slate-400">Code :</span> {selected.classeName}</p>
                    <p className="text-sm text-slate-700"><span className="text-slate-400">Type :</span> {selected.typeOfClasse}</p>
                    <p className="text-sm text-slate-700"><span className="text-slate-400">Capacité :</span> {selected.capacity} places</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        // TODO : brancher ton service de fermeture/désactivation ici
                        showAlert("warning", `Salle "${selected.classeName}" fermée temporairement.`);
                        closePanel();
                      }}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
                    >
                      Confirmer la fermeture
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

export default Classroom;