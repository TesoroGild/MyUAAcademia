import Sidebar from "../../sidebar/sidebar";
import adminPicture from "../../../assets/img/Admin.jpg";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fr } from "date-fns/locale";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";
import { createEmployee } from "../../../services/employee.service";

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
  const s = { success: "bg-green-50 border-green-200 text-green-700", error: "bg-red-50 border-red-200 text-red-700", warning: "bg-amber-50 border-amber-200 text-amber-700" }[type];
  const Icon = type === "success" ? HiCheck : type === "warning" ? HiExclamation : HiX;
  return (
    <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 text-sm ${s}`}>
      <Icon className="w-4 h-4 shrink-0" />
      <span className="flex-1">{message}</span>
      {action && (
        <button onClick={action.fn} className="text-xs font-semibold underline hover:no-underline shrink-0">{action.label}</button>
      )}
    </div>
  );
};

const DEPARTMENTS = ["Informatique", "Mathématiques", "Relations humaines", "Enseignement", "Art visuel et médiatique"];
const FACULTIES   = ["Sciences", "Communication", "Éducation", "Sciences sociales", "Arts", "Gestion", "Santé", "Langues"];
const CONTRACTS   = ["Temps plein", "Temps partiel", "Contractuel", "Chargé de cours"];

// ── Page principale ───────────────────────────────────────────────────────────
const EmployeeCreate = ({ employeeCo }) => {
  const navigate   = useNavigate();
  const [alert, setAlert]     = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newEmployee, setNewEmployee] = useState(null);

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      birthday: "", contracts: "",
      createdByCode: employeeCo?.code ?? "",
      dateOfTakingOffice: "", endDateOfFunction: "",
      department: "", email: "", empStatus: "",
      faculty: "", firstname: "", job: "",
      lastname: "", nas: "", phoneNumber: "",
      sexe: "", streetAddress: "", userRole: "employee",
      nationality: ""
    },
  });

  const showAlert = (type, message, action) => {
    setAlert({ type, message, action });
    if (type !== "success") setTimeout(() => setAlert(null), 5000);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await createEmployee(data);
      if (result.success) {
        setNewEmployee(result.employeeAdded);
        showAlert("success", `Employé créé avec succès.`, {
          label: "Voir le dossier",
          fn: () => navigate(`/employee/${result.employeeAdded.code}`),
        });
        reset();
      } else {
        showAlert("error", result.message);
      }
    } catch {
      showAlert("warning", "Impossible de contacter le serveur.");
    } finally {
      setIsLoading(false);
    }
  };

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

          {alert && <Alert type={alert.type} message={alert.message} action={alert.action} />}

          {/* ── Section 1 : Identité ── */}
          <Section title="Identité" subtitle="Informations personnelles de l'employé">

            <Field label="Nom" required error={errors.lastname?.message}>
              <input type="text" placeholder="Dupont" className={inputCls}
                {...register("lastname", { required: "Le nom est requis." })} />
            </Field>

            <Field label="Prénom" required error={errors.firstname?.message}>
              <input type="text" placeholder="Marie" className={inputCls}
                {...register("firstname", { required: "Le prénom est requis." })} />
            </Field>

            <Field label="Sexe" required error={errors.sexe?.message}>
              <select className={inputCls} {...register("sexe", { required: "Le sexe est requis." })}>
                <option value="" disabled>Sélectionner</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
                <option value="O">Autre</option>
                <option value="-">Ne pas répondre</option>
              </select>
            </Field>

            <Field label="Date de naissance" required error={errors.birthday?.message}>
              <Controller name="birthday" control={control}
                rules={{ required: "La date de naissance est requise." }}
                render={({ field }) => (
                  <DatePicker
                    locale={fr}
                    dateFormat="dd/MM/yyyy"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                    placeholderText="jj/mm/aaaa"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={80}
                    maxDate={new Date()}
                    className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-700"
                    popperPlacement="bottom-start"
                    popperProps={{ strategy: "fixed" }}
                  />
                )}
              />
            </Field>

            <Field label="Statut" required error={errors.empStatus?.message}>
              <select className={inputCls} {...register("empStatus", { required: "Le statut est requis." })}>
                <option value="" disabled>Sélectionner</option>
                <option value="canadian">Canadien</option>
                <option value="permanentresident">Résident permanent</option>
                <option value="workpermit">Permis de travail</option>
                <option value="studypermit">Permis d'études</option>
              </select>
            </Field>

            <Field label="NAS" required error={errors.nas?.message} hint="9 chiffres">
              <input type="text" maxLength={9} placeholder="123456789" className={inputCls}
                {...register("nas", { required: "Le NAS est requis." })} />
            </Field>

            <Field label="Nationalité" required error={errors.nationality?.message}>
              <input type="text" placeholder="Canadienne" className={inputCls}
                {...register("nationality", { required: "La nationalité est requise." })} />
            </Field>
          </Section>

          {/* ── Section 2 : Coordonnées ── */}
          <Section title="Coordonnées" subtitle="Informations de contact">

            <Field label="Email" required error={errors.email?.message}>
              <input type="email" placeholder="marie.dupont@academia.edu" className={inputCls}
                {...register("email", { required: "L'email est requis." })} />
            </Field>

            <Field label="Téléphone" required error={errors.phoneNumber?.message}>
              <input type="text" placeholder="(514) 000-0000" className={inputCls}
                {...register("phoneNumber", { required: "Le téléphone est requis." })} />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Adresse" required error={errors.streetAddress?.message}>
                <input type="text" placeholder="1234 rue des Érables, Montréal, QC" className={inputCls}
                  {...register("streetAddress", { required: "L'adresse est requise." })} />
              </Field>
            </div>

          </Section>

          {/* ── Section 3 : Poste ── */}
          <Section title="Informations professionnelles" subtitle="Poste, département et contrat">

            <Field label="Rôle" required error={errors.userRole?.message}>
              <select className={inputCls} {...register("userRole", { required: "Le rôle est requis." })}>
                <option value="professor">Professeur</option>
                <option value="admin">Directeur</option>
              </select>
            </Field>

            <Field label="Titre du poste" required error={errors.job?.message}>
              <input type="text" placeholder="ex. Chargé de cours, Secrétaire..." className={inputCls}
                {...register("job", { required: "Le titre du poste est requis." })} />
            </Field>

            <Field label="Département" required error={errors.department?.message}>
              <select className={inputCls} {...register("department", { required: "Le département est requis." })}>
                <option value="" disabled>Sélectionner</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>

            <Field label="Faculté" required error={errors.faculty?.message}>
              <select className={inputCls} {...register("faculty", { required: "La faculté est requise." })}>
                <option value="" disabled>Sélectionner</option>
                {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </Field>

            <Field label="Type de contrat" required error={errors.contracts?.message}>
              <select className={inputCls} {...register("contracts", { required: "Le contrat est requis." })}>
                <option value="" disabled>Sélectionner</option>
                {CONTRACTS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="Date de début" required error={errors.dateOfTakingOffice?.message}>
              <Controller name="dateOfTakingOffice" control={control}
                rules={{ required: "La date de prise de service est requise." }}
                render={({ field }) => (
                  <DatePicker
                    locale={fr}
                    dateFormat="dd/MM/yyyy"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                    placeholderText="jj/mm/aaaa"
                    showYearDropdown
                    scrollableYearDropdown
                    className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-700"
                    popperPlacement="bottom-start"
                    popperProps={{ strategy: "fixed" }}
                  />
                )}
              />
            </Field>

            <Field label="Date de fin" hint="Optionnel — laisser vide si indéterminé">
              <Controller name="endDateOfFunction" control={control}
                render={({ field }) => (
                  <DatePicker
                    locale={fr}
                    dateFormat="dd/MM/yyyy"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                    placeholderText="jj/mm/aaaa"
                    showYearDropdown
                    scrollableYearDropdown
                    className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-700"
                    popperPlacement="bottom-start"
                    popperProps={{ strategy: "fixed" }}
                  />
                )}
              />
            </Field>

          </Section>

          {/* ── Submit ── */}
          <div className="flex gap-3 pb-8">
            <button type="submit" disabled={isLoading}
              className="flex-1 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-medium rounded-lg py-3 text-sm transition-colors">
              {isLoading ? "Création en cours..." : "Créer l'employé"}
            </button>
            <button type="button" onClick={() => reset()}
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