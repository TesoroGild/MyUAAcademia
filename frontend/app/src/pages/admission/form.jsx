import logo2 from "../../assets/img/UA_Logo2.jpg";
import { HiOutlineArrowLeft, HiOutlineArrowRight, HiEye, HiEyeOff, HiCheck, HiExclamation } from "react-icons/hi";
import { FileInput, Label } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { getProgramsS } from "../../services/program.service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fr } from "date-fns/locale";

// ── Règles mot de passe ───────────────────────────────────────────────────────
const RULES = [
  { id: "length",  label: "Au moins 8 caractères",         test: (p) => p.length >= 8 },
  { id: "upper",   label: "Au moins une lettre majuscule", test: (p) => /[A-Z]/.test(p) },
  { id: "number",  label: "Au moins un chiffre",           test: (p) => /[0-9]/.test(p) },
  { id: "special", label: "Au moins un caractère spécial", test: (p) => /[^A-Za-z0-9]/.test(p) },
];
const getStrength = (pwd) => {
  const n = RULES.filter((r) => r.test(pwd)).length;
  if (n <= 1) return { label: "Faible", color: "bg-red-500",   text: "text-red-600",   width: "w-1/4" };
  if (n === 2) return { label: "Moyen",  color: "bg-amber-500", text: "text-amber-600", width: "w-2/4" };
  if (n === 3) return { label: "Bien",   color: "bg-blue-500",  text: "text-blue-600",  width: "w-3/4" };
  return              { label: "Fort",   color: "bg-green-500", text: "text-green-600", width: "w-full" };
};

const inputCls = "border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition w-full";

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

const Section = ({ title, children }) => (
  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
    </div>
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">{children}</div>
  </div>
);

// ── Page ─────────────────────────────────────────────────────────────────────
const AdmissionForm = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const progT     = location.state?.progT;

  const [programs, setPrograms]     = useState([]);
  const [pwd, setPwd]               = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fileAlert, setFileAlert]   = useState(null);

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      birthDay: "", firstname: "", identityProof: null,
      lastname: "", nas: "", nationality: "",
      personalEmail: "", phoneNumber: "",
      picture: null, programTitle: progT ? [progT] : [],
      schoolTranscript: null, sexe: "", streetAddress: "",
    },
  });

  useEffect(() => {
    getProgramsS().then(setPrograms).catch(console.error);
  }, []);

  const programOptions = programs.map((p) => ({
    value: p.title,
    label: `${p.title} | ${p.grade} : ${p.programName}`,
  }));

  const pwdMatch   = pwd !== "" && pwd === confirmPwd;
  const allRules   = RULES.every((r) => r.test(pwd));
  const strength   = pwd ? getStrength(pwd) : null;

  const validateFile = (e) => {
    const file = e.target.files?.[0];
    if (file && file.size > 2 * 1024 * 1024) {
      setFileAlert(`"${file.name}" dépasse 2 Mo. Veuillez choisir un fichier plus petit.`);
      e.target.value = "";
      setTimeout(() => setFileAlert(null), 5000);
    }
  };

  const onSubmit = (data) => {
    if (!allRules)  return;
    if (!pwdMatch)  return;
    navigate("/admission/verify", {
      state: { studentToRegister: { ...data, pwd } },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header public */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-3">
          <img src={logo2} alt="UA Logo" className="h-8 w-auto object-contain" />
          <span className="font-semibold text-slate-800 text-sm uppercase tracking-wide hidden sm:block">
            MyUA Academia — Formulaire d'admission
          </span>
        </div>
      </header>

      {/* Alerte fichier — plein écran */}
      {fileAlert && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-50 border border-amber-300 text-amber-800 rounded-xl px-5 py-3 text-sm shadow-md flex items-center gap-2">
          <HiExclamation className="w-4 h-4 shrink-0"/>
          {fileAlert}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-5">

        {/* ── Identité ── */}
        <Section title="Identité">
          <Field label="Nom" required error={errors.lastname?.message}>
            <input type="text" placeholder="Dupont" className={inputCls}
              {...register("lastname", { required: "Le nom est requis." })}/>
          </Field>
          <Field label="Prénom" required error={errors.firstname?.message}>
            <input type="text" placeholder="Marie" className={inputCls}
              {...register("firstname", { required: "Le prénom est requis." })}/>
          </Field>
          <Field label="Sexe" required error={errors.sexe?.message}>
            <select className={inputCls} {...register("sexe", { required: "Le sexe est requis." })}>
              <option value="" disabled>Sélectionner</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
              <option value="O">Autre</option>
            </select>
          </Field>
          <Field label="Date de naissance" required error={errors.birthDay?.message}>
            <Controller name="birthDay" control={control}
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
          <Field label="Nationalité" required error={errors.nationality?.message}>
            <input type="text" placeholder="Canadienne" className={inputCls}
              {...register("nationality", { required: "La nationalité est requise." })}/>
          </Field>
          <Field label="NAS" hint="Optionnel — 9 chiffres">
            <input type="text" maxLength={9} placeholder="123456789" className={inputCls}
              {...register("nas")}/>
          </Field>
        </Section>

        {/* ── Coordonnées ── */}
        <Section title="Coordonnées">
          <Field label="Email" required error={errors.personalEmail?.message}>
            <input type="email" placeholder="marie.dupont@email.com" className={inputCls}
              {...register("personalEmail", { required: "L'email est requis." })}/>
          </Field>
          <Field label="Téléphone" required error={errors.phoneNumber?.message}>
            <input type="text" placeholder="(514) 000-0000" className={inputCls}
              {...register("phoneNumber", { required: "Le téléphone est requis." })}/>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Adresse" required error={errors.streetAddress?.message}>
              <input type="text" placeholder="1234 rue des Érables, Montréal, QC" className={inputCls}
                {...register("streetAddress", { required: "L'adresse est requise." })}/>
            </Field>
          </div>
        </Section>

        {/* ── Programme ── */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <p className="text-sm font-semibold text-slate-900">Programme</p>
            <p className="text-xs text-slate-400 mt-0.5">Maximum 2 programmes sélectionnables</p>
          </div>
          <div className="p-6">
            <Controller name="programTitle" control={control}
              render={({ field }) => (
                <Select {...field} options={programOptions} isMulti
                  placeholder="Rechercher et sélectionner un programme..."
                  onChange={(selected) => { if (selected.length <= 2) field.onChange(selected); }}
                  classNamePrefix="select"
                  styles={{
                    control: (base) => ({ ...base, borderColor: "#cbd5e1", borderRadius: "0.5rem", fontSize: "0.875rem", minHeight: "42px" }),
                    menu:    (base) => ({ ...base, fontSize: "0.875rem", zIndex: 50 }),
                  }}
                />
              )}
            />
          </div>
        </div>

        {/* ── Mot de passe ── */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <p className="text-sm font-semibold text-slate-900">Accès au compte</p>
            <p className="text-xs text-slate-400 mt-0.5">Ce mot de passe vous servira à vous connecter une fois votre dossier validé</p>
          </div>
          <div className="p-6 grid sm:grid-cols-2 gap-5">
            {/* Nouveau mdp */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input type={showPwd ? "text" : "password"} value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="Choisissez un mot de passe sécurisé"
                  className={`${inputCls} pr-10`} required/>
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  {showPwd ? <HiEyeOff className="w-4 h-4"/> : <HiEye className="w-4 h-4"/>}
                </button>
              </div>
              {pwd && (
                <>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-slate-400">Force</span>
                    <span className={`text-xs font-medium ${strength.text}`}>{strength.label}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1">
                    <div className={`h-1.5 rounded-full transition-all ${strength.color} ${strength.width}`}/>
                  </div>
                  <div className="flex flex-col gap-1">
                    {RULES.map((r) => {
                      const ok = r.test(pwd);
                      return (
                        <div key={r.id} className={`flex items-center gap-1.5 text-xs ${ok ? "text-green-700" : "text-slate-400"}`}>
                          {ok ? <HiCheck className="w-3.5 h-3.5 shrink-0"/> : <div className="w-3.5 h-3.5 shrink-0 rounded-full border border-slate-300"/>}
                          {r.label}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Confirmation */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Confirmer <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input type={showConfirm ? "text" : "password"} value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="Répétez votre mot de passe"
                  className={`${inputCls} pr-10 ${
                    confirmPwd === "" ? "border-slate-300" :
                    pwdMatch         ? "border-green-400" : "border-red-400"
                  }`} required/>
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  {showConfirm ? <HiEyeOff className="w-4 h-4"/> : <HiEye className="w-4 h-4"/>}
                </button>
              </div>
              {confirmPwd !== "" && !pwdMatch && <p className="text-xs text-red-600">Les mots de passe ne correspondent pas.</p>}
              {confirmPwd !== "" && pwdMatch  && <p className="text-xs text-green-700 flex items-center gap-1"><HiCheck className="w-3.5 h-3.5"/>Correspond.</p>}
            </div>
          </div>
        </div>

        {/* ── Documents ── */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <p className="text-sm font-semibold text-slate-900">Documents</p>
            <p className="text-xs text-slate-400 mt-0.5">Fichiers acceptés — max 2 Mo chacun</p>
          </div>
          <div className="p-6 flex flex-col gap-4">
            {[
              { id: "schoolTranscript", label: "Relevés scolaires",  name: "schoolTranscript", multiple: false },
              { id: "picture",          label: "Photo(s)",            name: "picture",          multiple: true  },
              { id: "identityProof",    label: "Pièce d'identité",    name: "identityProof",    multiple: false },
            ].map(({ id, label, name, multiple }) => (
              <div key={id} className="flex flex-col gap-1.5">
                <Label htmlFor={id} className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</Label>
                <FileInput id={id} multiple={multiple}
                  {...register(name, { onChange: validateFile })}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Navigation ── */}
        <div className="flex gap-3 pb-8">
          <button type="button" onClick={() => navigate(-1)}
            className="flex items-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-600 font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
            <HiOutlineArrowLeft className="w-4 h-4"/>
            Retour
          </button>
          <button type="submit"
            disabled={!allRules || !pwdMatch}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-900 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
            Continuer
            <HiOutlineArrowRight className="w-4 h-4"/>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdmissionForm;