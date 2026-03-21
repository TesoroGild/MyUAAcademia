import Sidebar from "../../sidebar/sidebar";
import adminPicture from "../../../assets/img/Admin.jpg";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Datepicker, FileInput, Label } from "flowbite-react";
import { HiCheck, HiExclamation, HiX, HiExternalLink, HiSearch } from "react-icons/hi";
import { createStudentS } from "../../../services/user.service";
import { getProgramsS } from "../../../services/program.service";

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
  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
      {children}
    </div>
  </div>
);

const Alert = ({ type, message, action }) => {
  const s = {
    success: "bg-green-50 border-green-200 text-green-700",
    error:   "bg-red-50 border-red-200 text-red-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
  }[type];
  const Icon = type === "success" ? HiCheck : type === "warning" ? HiExclamation : HiX;
  return (
    <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 text-sm ${s}`}>
      <Icon className="w-4 h-4 shrink-0" />
      <span className="flex-1">{message}</span>
      {action && (
        <button onClick={action.fn} className="flex items-center gap-1 text-xs font-semibold underline hover:no-underline shrink-0">
          <HiExternalLink className="w-3.5 h-3.5" />{action.label}
        </button>
      )}
    </div>
  );
};

const GRADES = ["Certificat", "BTS", "Baccalauréat", "Master", "Doctorat"];

const GRADE_BADGE = {
  "Certificat":   "bg-slate-100 text-slate-600 border-slate-200",
  "BTS":          "bg-teal-50 text-teal-700 border-teal-100",
  "Baccalauréat": "bg-blue-50 text-blue-700 border-blue-100",
  "Master":       "bg-violet-50 text-violet-700 border-violet-100",
  "Doctorat":     "bg-amber-50 text-amber-700 border-amber-100",
};

// ── Sélecteur de programme avec recherche ─────────────────────────────────────
const ProgramSection = ({ programs, register, errors, onProgramSelect }) => {
  const [search, setSearch]             = useState("");
  const [gradeFilter, setGradeFilter]   = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);

  const filtered = programs.filter((p) => {
    const matchGrade = !gradeFilter || p.grade === gradeFilter;
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.programName.toLowerCase().includes(search.toLowerCase());
    return matchGrade && matchSearch;
  });

  const handleSelect = (p) => {
    setSelectedProgram(p);
    onProgramSelect(p.title);
    setSearch("");
  };

  const handleClear = () => {
    setSelectedProgram(null);
    onProgramSelect("");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <p className="text-sm font-semibold text-slate-900">Informations académiques</p>
        <p className="text-xs text-slate-400 mt-0.5">Rôle et programme d'inscription</p>
      </div>
      <div className="p-6 flex flex-col gap-5">

        {/* Rôle */}
        <Field label="Rôle" required error={errors.userRole?.message}>
          <div className="flex gap-6 pt-1">
            {[{ val: "Student", label: "Étudiant" }].map(({ val, label }) => (
              <label key={val} className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                <input type="radio" value={val} {...register("userRole", { required: "Le rôle est requis." })} className="accent-blue-700" />
                {label}
              </label>
            ))}
          </div>
        </Field>

        {/* Programme sélectionné */}
        {selectedProgram ? (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Programme sélectionné</p>
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold border px-2 py-0.5 rounded-full ${GRADE_BADGE[selectedProgram.grade] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                    {selectedProgram.grade}
                  </span>
                  <p className="text-sm font-semibold text-slate-900">{selectedProgram.title}</p>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{selectedProgram.programName} · {selectedProgram.faculty}</p>
              </div>
              <button type="button" onClick={handleClear} className="text-slate-400 hover:text-red-600 transition-colors ml-4 shrink-0">
                <HiX className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Programme</p>

            {/* Filtres */}
            <div className="flex gap-2 flex-wrap mb-3">
              <button
                type="button"
                onClick={() => setGradeFilter("")}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  !gradeFilter ? "bg-blue-800 text-white border-blue-800" : "bg-white text-slate-600 border-slate-200 hover:border-blue-700"
                }`}
              >
                Tous
              </button>
              {GRADES.map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGradeFilter(gradeFilter === g ? "" : g)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    gradeFilter === g ? "bg-blue-800 text-white border-blue-800" : "bg-white text-slate-600 border-slate-200 hover:border-blue-700"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Recherche */}
            <div className="relative mb-3">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par titre ou nom de programme..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
              />
            </div>

            {/* Résultats */}
            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">Aucun programme trouvé.</p>
              ) : (
                filtered.map((p) => (
                  <button
                    type="button"
                    key={p.title}
                    onClick={() => handleSelect(p)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left border-b border-slate-50 last:border-0 hover:bg-blue-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold border px-2 py-0.5 rounded-full shrink-0 ${GRADE_BADGE[p.grade] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                          {p.grade}
                        </span>
                        <p className="text-sm font-medium text-slate-900 truncate">{p.title}</p>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{p.programName} · {p.faculty}</p>
                    </div>
                    <HiCheck className="w-4 h-4 text-slate-200 shrink-0" />
                  </button>
                ))
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2">{filtered.length} programme{filtered.length > 1 ? "s" : ""}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Page principale ───────────────────────────────────────────────────────────
const Create = ({ employeeCo }) => {
  const navigate   = useNavigate();
  const [programs, setPrograms]           = useState([]);
  const [formattedNumber, setFormattedNumber] = useState("");
  const [formattedNas, setFormattedNas]   = useState("");
  const [alert, setAlert]                 = useState(null);
  const [newUser, setNewUser]             = useState(null);
  const [isLoading, setIsLoading]         = useState(false);

  const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      lastname: "", firstname: "", sexe: "", birthDay: "",
      personalEmail: "", nationality: "", phoneNumber: "",
      streetAddress: "", userStatus: "", nas: "",
      userRole: "", programTitle: "",
      schoolTranscript: null, picture: null, identityProof: null,
    },
  });

  useEffect(() => { getPrograms(); }, []);

  const getPrograms = async () => {
    try { setPrograms(await getProgramsS()); } catch (e) { console.error(e); }
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const match   = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      const fmt = (!match[2] ? match[1] : `(${match[1]}) ${match[2]}`) + (match[3] ? `-${match[3]}` : "");
      setFormattedNumber(fmt);
      return fmt;
    }
    return value;
  };

  const handleNasChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 9) setFormattedNas(val);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("birthDay",      data.birthDay);
      fd.append("firstname",     data.firstname);
      fd.append("lastname",      data.lastname);
      fd.append("nas",           formattedNas);
      fd.append("nationality",   data.nationality);
      fd.append("personalEmail", data.personalEmail);
      fd.append("phoneNumber",   formattedNumber);
      fd.append("sexe",          data.sexe);
      fd.append("streetAddress", data.streetAddress);
      fd.append("programTitle",  data.programTitle);
      fd.append("userRole",      data.userRole);
      fd.append("employeeCode",  employeeCo?.code);
      if (data.userStatus)       fd.append("userStatus",      data.userStatus);
      if (data.identityProof?.[0]) fd.append("identityProof", data.identityProof[0]);
      if (data.schoolTranscript?.[0]) fd.append("schoolTranscript", data.schoolTranscript[0]);
      if (data.picture?.[0])     fd.append("picture",         data.picture[0]);

      const result = await createStudentS(fd);

      if (result.success) {
        setNewUser(result.studentRegistered);
        setAlert({
          type: "success",
          message: `Dossier créé — ${data.firstname} ${data.lastname}`,
          action: { label: "Voir le dossier", fn: () => navigate(`/student/${result.studentRegistered.permanentCode}`, { state: { userInProcess: result.studentRegistered } }) },
        });
        reset();
        setFormattedNumber("");
        setFormattedNas("");
      } else {
        setAlert({ type: "error", message: result.message });
      }
    } catch {
      setAlert({ type: "warning", message: "Impossible de contacter le serveur." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar userCo={employeeCo} profilePic={adminPicture} />

      <main className="flex-1 overflow-y-auto">

        {/* Top bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-8 sticky top-0 z-10">
          <div>
            <p className="text-sm font-semibold text-slate-900">Créer un dossier étudiant</p>
            <p className="text-xs text-slate-400">Remplissez toutes les informations requises</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 max-w-4xl flex flex-col gap-5">

          {/* Alerte */}
          {alert && <Alert type={alert.type} message={alert.message} action={alert.action} />}

          {/* ── Section 1 : Identité ── */}
          <Section title="Identité" subtitle="Informations personnelles de l'étudiant">

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

            <Field label="Date de naissance" required error={errors.birthDay?.message}>
              <Controller
                name="birthDay"
                control={control}
                rules={{ required: "La date de naissance est requise." }}
                render={({ field }) => (
                  <Datepicker
                    selectedDate={field.value ? new Date(field.value) : null}
                    onSelectedDateChanged={(date) => field.onChange(date.toISOString().split("T")[0])}
                  />
                )}
              />
            </Field>

            <Field label="Nationalité" required error={errors.nationality?.message}>
              <input type="text" placeholder="Canadienne" className={inputCls}
                {...register("nationality", { required: "La nationalité est requise." })} />
            </Field>

            <Field label="Statut" hint="Optionnel">
              <select className={inputCls} {...register("userStatus")}>
                <option value="">-- Sélectionner --</option>
                <option value="canadian">Canadien</option>
                <option value="permanentresident">Résident permanent</option>
                <option value="workpermit">Permis de travail</option>
                <option value="studypermit">Permis d'études</option>
              </select>
            </Field>

            <Field label="NAS" hint="9 chiffres, sans espaces ni tirets">
              <input
                type="text"
                value={formattedNas}
                onChange={handleNasChange}
                maxLength={9}
                placeholder="123456789"
                className={inputCls}
              />
            </Field>

          </Section>

          {/* ── Section 2 : Coordonnées ── */}
          <Section title="Coordonnées" subtitle="Informations de contact">

            <Field label="Email personnel" required error={errors.personalEmail?.message}>
              <input type="email" placeholder="marie.dupont@email.com" className={inputCls}
                {...register("personalEmail", { required: "L'email est requis." })} />
            </Field>

            <Field label="Téléphone" hint="Format : (514) 000-0000">
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <input
                    type="text"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(formatPhoneNumber(e.target.value))}
                    placeholder="(514) 000-0000"
                    maxLength={14}
                    className={inputCls}
                  />
                )}
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Adresse" required error={errors.streetAddress?.message}>
                <input type="text" placeholder="1234 rue des Érables, Montréal, QC" className={inputCls}
                  {...register("streetAddress", { required: "L'adresse est requise." })} />
              </Field>
            </div>

          </Section>

          {/* ── Section 3 : Académique ── */}
          <ProgramSection
            programs={programs}
            register={register}
            errors={errors}
            onProgramSelect={(title) => setValue("programTitle", title)}
          />

          {/* ── Section 4 : Documents ── */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <p className="text-sm font-semibold text-slate-900">Documents</p>
              <p className="text-xs text-slate-400 mt-0.5">Pièces justificatives pour le dossier</p>
            </div>
            <div className="p-6 flex flex-col gap-5">
              {[
                { id: "schoolTranscript", label: "Relevés scolaires",  name: "schoolTranscript", multiple: false },
                { id: "picture",          label: "Photo(s)",            name: "picture",          multiple: true  },
                { id: "identityProof",    label: "Pièce d'identité",    name: "identityProof",    multiple: false },
              ].map(({ id, label, name, multiple }) => (
                <div key={id} className="flex flex-col gap-1.5">
                  <Label htmlFor={id} className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</Label>
                  <FileInput id={id} multiple={multiple} {...register(name)}
                    className="text-sm" />
                </div>
              ))}
            </div>
          </div>

          {/* ── Submit ── */}
          <div className="flex gap-3 pb-8">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-medium rounded-lg py-3 text-sm transition-colors"
            >
              {isLoading ? "Création en cours..." : "Créer le dossier étudiant"}
            </button>
            <button
              type="button"
              onClick={() => { reset(); setFormattedNumber(""); setFormattedNas(""); setAlert(null); }}
              className="px-6 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-lg text-sm transition-colors"
            >
              Réinitialiser
            </button>
          </div>

        </form>
      </main>
    </div>
  );
};

export default Create;