import Sidebar from "../../sidebar/sidebar";
import adminPicture from "../../../assets/img/Admin.jpg";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { HiCheck, HiExclamation, HiX, HiSearch, HiLockClosed, HiBriefcase, HiClock, HiCurrencyDollar } from "react-icons/hi";
import { createEmployee, getContractsS } from "../../../services/employee.service";
import DatePickerModule from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fr } from "date-fns/locale";

const DatePicker = DatePickerModule.default || DatePickerModule;

const inputCls = "border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition w-full bg-white";
const readonlyCls = "border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-500 bg-slate-50 w-full cursor-not-allowed";

const Field = ({ label, error, hint, required, locked, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
      {label}
      {required && <span className="text-red-500">*</span>}
      {locked   && <HiLockClosed className="w-3 h-3 text-slate-400"/>}
    </label>
    {children}
    {hint  && <p className="text-xs text-slate-400">{hint}</p>}
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

const Section = ({ title, subtitle, children }) => (
  <div className="bg-white border border-slate-200 rounded-xl">
    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">{children}</div>
  </div>
);

const Alert = ({ type, message, action }) => {
  const s = { success:"bg-green-50 border-green-200 text-green-700", error:"bg-red-50 border-red-200 text-red-700", warning:"bg-amber-50 border-amber-200 text-amber-700" }[type];
  const Icon = type==="success" ? HiCheck : type==="warning" ? HiExclamation : HiX;
  return (
    <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 text-sm ${s}`}>
      <Icon className="w-4 h-4 shrink-0"/><span className="flex-1">{message}</span>
      {action && <button onClick={action.fn} className="text-xs font-semibold underline shrink-0">{action.label}</button>}
    </div>
  );
};

const fmtSalary = (v) => v ? `${Number(v).toLocaleString("fr-CA")} $` : "—";

const EmployeeCreate = ({ employeeCo }) => {
  const navigate = useNavigate();
  const [alert, setAlert]                       = useState(null);
  const [isLoading, setIsLoading]               = useState(false);
  const [contracts, setContracts]               = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [contractSearch, setContractSearch]     = useState("");

  const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      birthday: "", createdByCode: employeeCo?.code ?? "",
      email: "", empStatus: "", firstname: "", lastname: "",
      nas: "", phoneNumber: "", sexe: "", streetAddress: "",
      jobTitle: "", nationality: "",
      realStartingDate: "", realEndDate: "", realSalary: "",
    },
  });

  useEffect(() => { loadContracts(); }, []);

  const loadContracts = async () => {
    try {
      const res = await getContractsS();
      setContracts(Array.isArray(res) ? res : res?.contracts ?? []);
    } catch (e) { console.error(e); }
  };

  const handleContractSelect = (contract) => {
    setSelectedContract(contract);
    setContractSearch("");
    if (contract.baseSalary) setValue("realSalary", contract.baseSalary);
  };

  const showAlert = (type, message, action) => {
    setAlert({ type, message, action });
    if (type !== "success") setTimeout(() => setAlert(null), 5000);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        jobTitle: selectedContract.jobTitle,
        contractCode: selectedContract?.code ?? null,
        realEndDate: data.RealEndDate === "" ? null : data.RealEndDate
      };
      const result = await createEmployee(payload);
      if (result.success) {
        showAlert("success", "Employé créé avec succès.", {
          label: "Voir le dossier",
          fn: () => navigate(`/employee/${result.employeeAdded}`),
        });
        reset();
        setSelectedContract(null);
      } else {
        showAlert("error", result.message);
      }
    } catch { showAlert("warning", "Impossible de contacter le serveur."); }
    finally { setIsLoading(false); }
  };

  const activeContracts    = contracts.filter((c) => { const now=new Date(); const end=c.endingDate?new Date(c.endingDate):null; return !end||end>=now; });
  const filteredContracts  = activeContracts.filter((c) => !contractSearch || c.jobTitle?.toLowerCase().includes(contractSearch.toLowerCase()));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar userCo={employeeCo} profilePic={adminPicture} />
      <main className="flex-1 overflow-y-auto">
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-8 sticky top-0 z-10">
          <div>
            <p className="text-sm font-semibold text-slate-900">Créer un employé</p>
            <p className="text-xs text-slate-400">Remplissez toutes les informations requises</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 max-w-4xl flex flex-col gap-5">

          {alert && <Alert type={alert.type} message={alert.message} action={alert.action}/>}

          {/* ── Identité ── */}
          <Section title="Identité" subtitle="Informations personnelles de l'employé">
            <Field label="Nom" required error={errors.lastname?.message}>
              <input type="text" placeholder="Dupont" className={inputCls} {...register("lastname", { required: "Requis." })}/>
            </Field>
            <Field label="Prénom" required error={errors.firstname?.message}>
              <input type="text" placeholder="Marie" className={inputCls} {...register("firstname", { required: "Requis." })}/>
            </Field>
            <Field label="Sexe" required error={errors.sexe?.message}>
              <select className={inputCls} {...register("sexe", { required: "Requis." })}>
                <option value="" disabled>Sélectionner</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
                <option value="O">Autre</option>
                <option value="-">Ne pas répondre</option>
              </select>
            </Field>
            <Field label="Date de naissance" required error={errors.birthday?.message}>
              <Controller name="birthday" control={control} rules={{ required: "Requis." }}
                render={({ field }) => (
                  <DatePicker locale={fr} dateFormat="dd/MM/yyyy"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                    placeholderText="jj/mm/aaaa" showYearDropdown scrollableYearDropdown
                    yearDropdownItemNumber={80} maxDate={new Date()}
                    className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-700"
                    popperPlacement="bottom-start" popperProps={{ strategy: "fixed" }}
                  />
                )}
              />
            </Field>
            <Field label="Statut" required error={errors.empStatus?.message}>
              <select className={inputCls} {...register("empStatus", { required: "Requis." })}>
                <option value="" disabled>Sélectionner</option>
                <option value="canadian">Canadien</option>
                <option value="permanentresident">Résident permanent</option>
                <option value="workpermit">Permis de travail</option>
                <option value="studypermit">Permis d'études</option>
              </select>
            </Field>
            <Field label="NAS" required error={errors.nas?.message} hint="9 chiffres">
              <input type="text" maxLength={9} placeholder="123456789" className={inputCls} {...register("nas", { required: "Requis." })}/>
            </Field>
            <Field label="Nationalité" required error={errors.nationality?.message}>
              <input type="text" placeholder="Canadienne" className={inputCls} {...register("nationality", { required: "Requis." })}/>
            </Field>
          </Section>

          {/* ── Coordonnées ── */}
          <Section title="Coordonnées" subtitle="Informations de contact">
            <Field label="Email" required error={errors.email?.message}>
              <input type="email" placeholder="marie.dupont@academia.edu" className={inputCls} {...register("email", { required: "Requis." })}/>
            </Field>
            <Field label="Téléphone" required error={errors.phoneNumber?.message}>
              <input type="text" placeholder="(514) 000-0000" className={inputCls} {...register("phoneNumber", { required: "Requis." })}/>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Adresse" required error={errors.streetAddress?.message}>
                <input type="text" placeholder="1234 rue des Érables, Montréal, QC" className={inputCls} {...register("streetAddress", { required: "Requis." })}/>
              </Field>
            </div>
          </Section>

          {/* ── Poste et contrat ── */}
          <div className="bg-white border border-slate-200 rounded-xl">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <p className="text-sm font-semibold text-slate-900">Poste et contrat</p>
              <p className="text-xs text-slate-400 mt-0.5">Sélectionnez un contrat ouvert — les infos du poste s'afficheront en lecture seule. Vous saisissez ensuite les conditions propres à cet employé.</p>
            </div>
            <div className="p-6 flex flex-col gap-5">

              {/* ── Sélecteur contrat ── */}
              {!selectedContract ? (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Contrat / Poste ouvert <span className="font-normal text-slate-400 normal-case">— optionnel</span>
                  </label>
                  <div className="relative">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                    <input type="text" value={contractSearch} onChange={(e) => setContractSearch(e.target.value)}
                      placeholder="Rechercher un contrat ouvert..."
                      className="w-full pl-9 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 transition"/>
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-52 overflow-y-auto">
                    {filteredContracts.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-5">Aucun contrat actif trouvé.</p>
                    ) : filteredContracts.map((c) => (
                      <button type="button" key={c.code} onClick={() => handleContractSelect(c)}
                        className="w-full flex items-start gap-3 px-4 py-3 text-left border-b border-slate-50 last:border-0 hover:bg-blue-50 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                          <HiBriefcase className="w-4 h-4 text-blue-700"/>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 truncate">{c.jobTitle}</p>
                          <div className="flex items-center gap-3 flex-wrap mt-0.5">
                            <span className="text-xs text-slate-400">{c.typeOfEmployment}</span>
                            {c.numberOfHours && <span className="text-xs text-slate-400 flex items-center gap-0.5"><HiClock className="w-3 h-3"/>{c.numberOfHours}h/sem.</span>}
                            {c.minimumWage   && <span className="text-xs text-slate-400 flex items-center gap-0.5"><HiCurrencyDollar className="w-3 h-3"/>{fmtSalary(c.minimumWage)} – {fmtSalary(c.maximumWage)}</span>}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">Si aucun contrat ne correspond, créez-en un d'abord dans <strong>Gestion des contrats</strong>.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">

                  {/* Infos du poste — lecture seule */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HiLockClosed className="w-3.5 h-3.5 text-slate-400"/>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Informations du poste — non modifiables</span>
                      </div>
                      <button type="button" onClick={() => setSelectedContract(null)}
                        className="text-xs text-slate-400 hover:text-red-600 transition-colors">
                        Changer de contrat
                      </button>
                    </div>
                    <div className="p-4 grid sm:grid-cols-2 gap-4">
                      {[
                        { label: "Intitulé du poste",   value: selectedContract.jobTitle },
                        { label: "Type d'emploi",        value: selectedContract.typeOfEmployment },
                        { label: "Type d'offre",         value: selectedContract.typeOfOffer },
                        { label: "Département",          value: selectedContract.department },
                        { label: "Faculté",              value: selectedContract.faculty },
                        { label: "Heures / semaine",     value: selectedContract.numberOfHours ? `${selectedContract.numberOfHours}h` : null },
                        { label: "Fourchette salariale", value: (selectedContract.minimumWage||selectedContract.maximumWage) ? `${fmtSalary(selectedContract.minimumWage)} – ${fmtSalary(selectedContract.maximumWage)}` : null },
                        { label: "Salaire de base",      value: fmtSalary(selectedContract.baseSalary) },
                      ].filter(({ value }) => value).map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">{label}</p>
                          <div className={readonlyCls}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Conditions propres à cet employé — modifiables */}
                  <div className="border border-blue-100 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-blue-50/50 border-b border-blue-100">
                      <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Conditions négociées — propres à cet employé</p>
                    </div>
                    <div className="p-4 grid sm:grid-cols-3 gap-4">
                      <Field label="Salaire réel ($)" required error={errors.realSalary?.message} hint="Salaire négocié">
                        <input type="number" min="0" className={inputCls}
                          {...register("realSalary", { required: "Le salaire réel est requis." })}/>
                      </Field>
                      <Field label="Date de début réelle" required error={errors.realStartingDate?.message}>
                        <Controller name="realStartingDate" control={control} rules={{ required: "Requis." }}
                          render={({ field }) => (
                            <DatePicker locale={fr} dateFormat="dd/MM/yyyy"
                              selected={field.value ? new Date(field.value) : null}
                              onChange={(date) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                              placeholderText="jj/mm/aaaa"
                              className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-700"
                              popperPlacement="bottom-start" popperProps={{ strategy: "fixed" }}
                            />
                          )}
                        />
                      </Field>
                      <Field label="Date de fin réelle" hint="Optionnel">
                        <Controller name="realEndDate" control={control}
                          render={({ field }) => (
                            <DatePicker locale={fr} dateFormat="dd/MM/yyyy"
                              selected={field.value ? new Date(field.value) : null}
                              onChange={(date) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                              placeholderText="jj/mm/aaaa"
                              className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-700"
                              popperPlacement="bottom-start" popperProps={{ strategy: "fixed" }}
                            />
                          )}
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Submit ── */}
          <div className="flex gap-3 pb-8">
            <button type="submit" disabled={isLoading}
              className="flex-1 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-medium rounded-lg py-3 text-sm transition-colors">
              {isLoading ? "Création en cours..." : "Créer l'employé"}
            </button>
            <button type="button" onClick={() => { reset(); setSelectedContract(null); }}
              className="px-6 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-lg text-sm transition-colors">
              Réinitialiser
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EmployeeCreate;