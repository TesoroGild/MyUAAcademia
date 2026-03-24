import Sidebar from "../../sidebar/sidebar";
import adminPicture from "../../../assets/img/Admin.jpg";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiPlus, HiX, HiPencil, HiCheck, HiExclamation, HiBriefcase, HiClock, HiCurrencyDollar } from "react-icons/hi";
import { createContractS, getContractsS } from "../../../services/employee.service";

// ── Helpers ───────────────────────────────────────────────────────────────────
const inputCls = "border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition w-full bg-white";

const Field = ({ label, error, hint, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {hint  && <p className="text-xs text-slate-400">{hint}</p>}
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

const Alert = ({ type, message }) => {
  const s = { success:"bg-green-50 border-green-200 text-green-700", error:"bg-red-50 border-red-200 text-red-700", warning:"bg-amber-50 border-amber-200 text-amber-700" }[type];
  const Icon = type==="success" ? HiCheck : type==="warning" ? HiExclamation : HiX;
  return <div className={`flex items-center gap-2 border rounded-xl px-4 py-3 text-sm ${s}`}><Icon className="w-4 h-4 shrink-0"/>{message}</div>;
};

const TYPE_EMPLOYMENT = ["Temps plein", "Temps partiel"];
const TYPE_OFFER      = ["Permanent", "Temporaire", "Saisonnier", "Stage"];
const DEPARTMENTS     = ["Danse", "Chimie", "Communication sociale et publique", "Éducation et pédagogie", "Enseignement", "Finance", "Géographie", "Histoire", "Informatique", "Mathématiques", "Psychologie", "Relations humaines",  "Science politique"];
const FACULTIES       = ["Arts", "Communication", "Science politique et droit", "Sciences", "Sciences de l’éducation", "Sciences de la gestion", "Sciences humaines"];

const STATUS_BADGE = (contract) => {
  const now  = new Date();
  const end  = contract.EndingDate ? new Date(contract.EndingDate) : null;
  const start = contract.StartingDate ? new Date(contract.StartingDate) : null;
  if (end && end < now)    return "bg-slate-100 text-slate-500 border-slate-200";
  if (start && start > now) return "bg-amber-50 text-amber-700 border-amber-100";
  return "bg-green-50 text-green-700 border-green-100";
};

const STATUS_LABEL = (contract) => {
  const now  = new Date();
  const end  = contract.EndingDate  ? new Date(contract.EndingDate)  : null;
  const start = contract.StartingDate ? new Date(contract.StartingDate) : null;
  if (end && end < now)    return "Expiré";
  if (start && start > now) return "À venir";
  return "Actif";
};

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("fr-CA", { day:"numeric", month:"short", year:"numeric" }) : "—";
const fmtSalary = (v) => v ? `${Number(v).toLocaleString("fr-CA")} $` : "—";
const fmtWorkShift = (v) => {
  const shifts = {
    "Standard": "09h00 à 17h00 (Standard)",
    "Early": "08h00 à 16h00 (Tôt)",
    "Late": "10h00 à 18h00 (Tard)",
    "Flexible": "Horaire flexible"
  };

  return shifts[v] || "—";
};

// ── Page principale ───────────────────────────────────────────────────────────
const ContractCreate = ({ employeeCo }) => {
  const [contracts, setContracts]   = useState([]);
  const [panel, setPanel]           = useState(null);   // null | "create" | "view"
  const [selected, setSelected]     = useState(null);
  const [alert, setAlert]           = useState(null);
  const [isLoading, setIsLoading]   = useState(false);
  const [filterType, setFilterType] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      JobTitle: "", Description: "", TypeOfEmployment: "", TypeOfOffer: "",
      Department: "", Faculty: "", NumberOfHours: "",
      MinimumWage: "", MaximumWage: "", BaseSalary: "",
      StartingDate: "", EndingDate: "", Availability: "", WorkShift: ""
    },
  });

  useEffect(() => { loadContracts(); }, []);

  const showAlert = (type, message) => { setAlert({ type, message }); setTimeout(() => setAlert(null), 5000); };

  const loadContracts = async () => {
    try {
      const res  = await getContractsS();
      console.log(res)
      setContracts(Array.isArray(res) ? res : res?.contracts ?? res?.data ?? []);
    } catch (e) { console.error(e); }
  };

  const openCreate = () => { reset(); setSelected(null); setPanel("create"); };
  const openView   = (c)  => { setSelected(c); setPanel("view"); };
  const closePanel = ()   => { setPanel(null); setSelected(null); };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await createContractS({ ...data, EndingDate: data.EndingDate ? new Date(data.EndingDate).toISOString().split('T')[0] : null });
      if (result.success) {
        showAlert("success", `Contrat "${data.JobTitle}" créé avec succès.`);
        await loadContracts();
        closePanel();
      } else {
        showAlert("error", result.message);
      }
    } catch { showAlert("warning", "Impossible de contacter le serveur."); }
    finally { setIsLoading(false); }
  };

  const types       = [...new Set(contracts.map((c) => c.TypeOfEmployment).filter(Boolean))];
  const displayed   = filterType ? contracts.filter((c) => c.TypeOfEmployment === filterType) : contracts;
  const activeCount = contracts.filter((c) => STATUS_LABEL(c) === "Actif").length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar userCo={employeeCo} profilePic={adminPicture} />

      <main className="flex-1 flex overflow-hidden">

        {/* ── Colonne liste ── */}
        <div className={`flex flex-col overflow-hidden transition-all duration-200 ${panel ? "w-1/2 border-r border-slate-200" : "w-full"}`}>

          {/* Top bar */}
          <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
            <div>
              <p className="text-sm font-semibold text-slate-900">Gestion des contrats</p>
              <p className="text-xs text-slate-400">{contracts.length} contrat{contracts.length > 1 ? "s" : ""} · {activeCount} actif{activeCount > 1 ? "s" : ""}</p>
            </div>
            <button onClick={openCreate}
              className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              <HiPlus className="w-4 h-4"/>Nouveau contrat
            </button>
          </div>

          {alert && <div className="px-8 pt-4"><Alert type={alert.type} message={alert.message}/></div>}

          {/* Filtres */}
          <div className="px-8 pt-4 shrink-0 flex flex-wrap gap-2">
            <button onClick={() => setFilterType("")}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${!filterType ? "bg-blue-800 text-white border-blue-800" : "bg-white text-slate-600 border-slate-200 hover:border-blue-700"}`}>
              Tous
            </button>
            {types.map((t) => (
              <button key={t} onClick={() => setFilterType(filterType === t ? "" : t)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${filterType === t ? "bg-blue-800 text-white border-blue-800" : "bg-white text-slate-600 border-slate-200 hover:border-blue-700"}`}>
                {t} ({contracts.filter((c) => c.TypeOfEmployment === t).length})
              </button>
            ))}
          </div>

          {/* Liste contrats */}
          <div className="flex-1 overflow-y-auto px-8 py-4">
            {displayed.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-slate-400 text-sm">Aucun contrat.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {displayed.map((c) => (
                  <button key={c.code} onClick={() => openView(c)}
                    className={`group bg-white border rounded-xl px-5 py-4 text-left flex items-start justify-between gap-4 transition-all hover:shadow-md ${
                      selected?.Code === c.code ? "border-blue-300 bg-blue-50/30" : "border-slate-200 hover:border-slate-300"
                    }`}>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-xs font-semibold border px-2 py-0.5 rounded-full ${STATUS_BADGE(c)}`}>
                          {STATUS_LABEL(c)}
                        </span>
                        <p className="text-sm font-semibold text-slate-900 truncate">{c.jobTitle}</p>
                      </div>
                      <div className="flex items-center gap-4 flex-wrap text-xs text-slate-400 mt-1">
                        {c.typeOfEmployment && (
                          <span className="flex items-center gap-1"><HiBriefcase className="w-3 h-3"/>{c.typeOfEmployment}</span>
                        )}
                        {c.numberOfHours && (
                          <span className="flex items-center gap-1"><HiClock className="w-3 h-3"/>{c.numberOfHours}h/sem.</span>
                        )}
                        {(c.minimumWage || c.maximumWage) && (
                          <span className="flex items-center gap-1">
                            <HiCurrencyDollar className="w-3 h-3"/>
                            {fmtSalary(c.minimumWage)} – {fmtSalary(c.maximumWage)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {fmtDate(c.startingDate)} → {fmtDate(c.endingDate)}
                      </p>
                    </div>
                    <HiPencil className="w-4 h-4 text-slate-300 group-hover:text-blue-700 transition-colors shrink-0 mt-1"/>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Panneau latéral ── */}
        {panel && (
          <div className="w-1/2 flex flex-col overflow-hidden bg-white">
            <div className="h-16 border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
              <p className="text-sm font-semibold text-slate-900">
                {panel === "create" ? "Nouveau contrat / poste" : selected?.jobTitle}
              </p>
              <button onClick={closePanel} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <HiX className="w-4 h-4"/>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6">

              {/* ── Vue détail ── */}
              {panel === "view" && selected && (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold border px-2 py-0.5 rounded-full ${STATUS_BADGE(selected)}`}>
                      {STATUS_LABEL(selected)}
                    </span>
                    <span className="text-xs text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full">{selected.typeOfOffer}</span>
                  </div>

                  {selected.description && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Description du poste</p>
                      <p className="text-sm text-slate-700 leading-relaxed">{selected.description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Type d'emploi",     value: selected.typeOfEmployment },
                      { label: "Heures / semaine",   value: selected.numberOfHours ? `${selected.numberOfHours}h` : null },
                      { label: "Disponibilité",      value: selected.availability },
                      { label: "Salaire de base",    value: fmtSalary(selected.baseSalary) },
                      { label: "Salaire minimum",    value: fmtSalary(selected.minimumWage) },
                      { label: "Salaire maximum",    value: fmtSalary(selected.maximumWage) },
                      { label: "Date d'ouverture",   value: fmtDate(selected.startingDate) },
                      { label: "Date de fermeture",  value: fmtDate(selected.endingDate) },
                      { label: "Horaire de travail",  value: fmtWorkShift(selected.workShift) },
                    ].map(({ label, value }) => value && (
                      <div key={label}>
                        <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">{label}</p>
                        <p className="text-sm font-medium text-slate-800 mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700">
                    Pour lier un employé à ce contrat, rendez-vous dans <strong>Créer un employé</strong> et sélectionnez ce contrat — les informations du poste se rempliront automatiquement.
                  </div>
                </div>
              )}

              {/* ── Formulaire création ── */}
              {panel === "create" && (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

                  <Field label="Intitulé du poste" required error={errors.JobTitle?.message}>
                    <input type="text" placeholder="ex. Chargé de cours — Informatique" className={inputCls}
                      {...register("JobTitle", { required: "L'intitulé est requis." })}/>
                  </Field>

                  <Field label="Description">
                    <textarea rows={3} placeholder="Décrivez les responsabilités du poste..." className={inputCls}
                      {...register("Description")}/>
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Type d'emploi" required error={errors.TypeOfEmployment?.message}>
                      <select className={inputCls} {...register("TypeOfEmployment", { required: "Requis." })}>
                        <option value="" disabled>Sélectionner</option>
                        {TYPE_EMPLOYMENT.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </Field>
                    <Field label="Type d'offre" required error={errors.TypeOfOffer?.message}>
                      <select className={inputCls} {...register("TypeOfOffer", { required: "Requis." })}>
                        <option value="" disabled>Sélectionner</option>
                        {TYPE_OFFER.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Département">
                      <select className={inputCls} {...register("Department")}>
                        <option value="">— Optionnel —</option>
                        {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </Field>
                    <Field label="Faculté">
                      <select className={inputCls} {...register("Faculty")}>
                        <option value="">— Optionnel —</option>
                        {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Heures / semaine" hint="ex. 35">
                      <input type="number" min="1" className={inputCls} {...register("NumberOfHours")}/>
                    </Field>
                    <Field label="Disponibilité" hint="ex. Immédiate, Janvier 2026">
                      <input type="text" placeholder="ex. Immédiate" className={inputCls} {...register("Availability")}/>
                    </Field>
                  </div>

                  {/* Salaires */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Rémunération</p>
                    <div className="grid grid-cols-3 gap-3">
                      <Field label="Salaire de base ($)">
                        <input type="number" min="0" placeholder="ex. 55000" className={inputCls} {...register("BaseSalary")}/>
                      </Field>
                      <Field label="Minimum ($)">
                        <input type="number" min="0" placeholder="ex. 50000" className={inputCls} {...register("MinimumWage")}/>
                      </Field>
                      <Field label="Maximum ($)">
                        <input type="number" min="0" placeholder="ex. 80000" className={inputCls} {...register("MaximumWage")}/>
                      </Field>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Date d'ouverture" required error={errors.StartingDate?.message}>
                      <input type="date" className={inputCls}
                        {...register("StartingDate", { required: "Requis." })}/>
                    </Field>
                    <Field label="Date de fermeture" hint="Optionnel">
                      <input type="date" className={inputCls} {...register("EndingDate")}/>
                    </Field>
                  </div>

                    {/* Work Shift */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Quart de travail" required error={errors.WorkShift?.message}>
                        <select className={inputCls} {...register("WorkShift")}>
                            <option value="" disabled>Sélectionner</option>
                            <option value="Standard">09h00 à 17h00 (Standard)</option>
                            <option value="Early">08h00 à 16h00 (Tôt)</option>
                            <option value="Late">10h00 à 18h00 (Tard)</option>
                            {/* Option pour les temps partiels ou flexibles */}
                            <option value="Flexible">Flexible / À discuter</option>
                        </select>
                        </Field>
                    </div>

                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={isLoading}
                      className="flex-1 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm transition-colors">
                      {isLoading ? "Création..." : "Créer le contrat"}
                    </button>
                    <button type="button" onClick={closePanel}
                      className="px-4 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-lg text-sm transition-colors">
                      Annuler
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ContractCreate;