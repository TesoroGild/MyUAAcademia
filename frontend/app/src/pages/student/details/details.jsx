import emailjs from "@emailjs/browser";
import {
  HiCheck, HiX, HiFire, HiOutlineDownload,
  HiExclamation, HiOutlinePencilAlt, HiOutlineQuestionMarkCircle,
} from "react-icons/hi";
import logo from "../../../assets/img/UA_Logo.png";
import userPicture from "../../../assets/img/User_Icon.png";
import Sidebar from "../../sidebar/sidebar";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Avatar, Label, TextInput, Tooltip, Toast, ToastToggle } from "flowbite-react";
import { getStudentS } from "../../../services/user.service";
import { downloadStudentFileS, getFilesS } from "../../../services/files.service";
import { getStudentProgramsS, registerToAProgramS } from "../../../services/program.service";
import { update } from "../../../services/profile.service";

const your_service_id = import.meta.env.VITE_YOUR_SERVICE_ID;
const your_template_id = import.meta.env.VITE_YOUR_TEMPLATE_ID;
const your_public_key = import.meta.env.VITE_YOUR_PUBLIC_KEY;

// ── Petit composant champ info ───────────────────────────────────────────────
const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs text-slate-400 uppercase tracking-wide font-medium">{label}</span>
    <span className="text-sm text-slate-800 font-medium">{value || "—"}</span>
  </div>
);

// ── Modal modification ───────────────────────────────────────────────────────
const EditModal = ({ open, onClose, form, onChange, onSubmit, showAlert, fields }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Modifier le profil</h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {fields.map(({ id, label, type = "text", optional }) => (
            <div key={id} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>
                {optional && (
                  <Tooltip content="Laisser vide pour ne pas modifier">
                    <HiOutlineQuestionMarkCircle className="w-4 h-4 text-slate-400" />
                  </Tooltip>
                )}
              </div>
              <input
                type={type}
                id={id}
                name={id}
                value={form[id] ?? ""}
                onChange={onChange}
                required={!optional}
                className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
              />
            </div>
          ))}
          {showAlert && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              Une erreur serveur est survenue.
            </p>
          )}
          <button type="submit" className="mt-2 w-full bg-blue-800 hover:bg-blue-900 text-white font-medium rounded-lg py-2.5 text-sm transition-colors">
            Enregistrer les modifications
          </button>
        </form>
        <button onClick={onClose} className="mt-4 w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors">
          Annuler
        </button>
      </div>
    </div>
  );
};

// ── Page principale ──────────────────────────────────────────────────────────
const StudentDetails = ({ user }) => {
  const { permanentcode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const userToDisplay = location.state?.userInProcess;
  const isAdmin = user?.userRole?.toLowerCase() === "admin" || user?.userRole?.toLowerCase() === "director";

  const [student, setStudent] = useState({
    firstName: "", lastName: "", sexe: "", userRole: "",
    phoneNumber: "", department: "", faculty: "", lvlDegree: "",
    birthDay: "", nas: "", permanentCode: "", personalEmail: "",
    professionalEmail: "", nationality: "", streetAddress: "",
  });
  const [files, setFiles] = useState([]);
  const [programsEnrolled, setProgramsEnrolled] = useState([]);
  const [programsNotEnrolled, setProgramsNotEnrolled] = useState([]);
  const [decisions, setDecisions] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [profileModForm, setProfileModForm] = useState({ permanentCode: "", phoneNumber: "", nas: "", pwd: "" });
  const [toasts, setToasts] = useState({ error: false, warning: false, success: false, errorMsg: "" });
  const [warnToast, setWarnToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const showToast = (type, msg = "") => {
    setToasts((t) => ({ ...t, [type]: true, errorMsg: msg }));
    setTimeout(() => setToasts((t) => ({ ...t, [type]: false })), 5000);
  };

  useEffect(() => {
    if (userToDisplay) setStudent(userToDisplay); else getStudent();
    getFiles();
    getStudentPrograms();
  }, []);

  const getStudent = async () => {
    try { setStudent(await getStudentS(permanentcode)); } catch (e) { console.error(e); }
  };

  const getFiles = async () => {
    try {
    const response = await getFilesS(permanentcode);
     setFiles(response.files);
    } catch {
      setWarnToast(true);
      setTimeout(() => setWarnToast(false), 5000);
      setLoading(false);
    }
  };

  const getStudentPrograms = async () => {
    try {
      const result = await getStudentProgramsS(permanentcode);
      if (result.success) {
        const enrolled = [], notEnrolled = [];
        result.programs.forEach((p) => {
          if (p.isEnrolled) enrolled.push(p);
          else if (!p.hasFinished) notEnrolled.push({ ...p, isEnrolled: null });
        });
        setProgramsEnrolled(enrolled);
        setProgramsNotEnrolled(notEnrolled);
      }
    } catch (e) { console.error(e); }
  };

  const downloadStudentFile = async (fileName) => {
    try {
      const result = await downloadStudentFileS(student.permanentCode, fileName);
      if (result.success) {
        const url = window.URL.createObjectURL(new Blob([result.studentFile]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (e) { console.error(e); }
  };

  const registerToAProgram = async () => {
    const finalDecisions = programsNotEnrolled.map((p) => ({ title: p.title, isAccepted: p.isEnrolled }));
    try {
      const result = await registerToAProgramS({ permanentCode: permanentcode, finalDecisions });
      if (result.success) {
        showToast("success");
        getStudentPrograms();
        const accepted = finalDecisions.filter((d) => d.isAccepted).map((d) => d.title).join(", ") + ".";
        if (accepted.trim().length > 1) sendUserCredentialsEmail(accepted);
      } else {
        showToast("error", result.message);
      }
    } catch { showToast("warning"); }
  };

  const initUpdForm = () => {
    setProfileModForm({ permanentCode: student.permanentCode, phoneNumber: student.phoneNumber || "", nas: student.nas || "", pwd: "" });
    setOpenModal(true);
  };

  const handleModifyChange = (e) => setProfileModForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const modified = await update({ permanentCode: student.permanentCode, phoneNumber: profileModForm.phoneNumber, nas: profileModForm.nas, pwd: profileModForm.pwd });
      if (modified) { setOpenModal(false); setStudent((s) => ({ ...s, ...modified })); }
      else setShowAlert(true);
    } catch (e) { console.error(e); }
  };

  const sendUserCredentialsEmail = (progsAccepted) => {
    emailjs.send(your_service_id, your_template_id, {
      email: "qwerty01@yopmail.com",
      permanentCode: student.permanentCode,
      pwd: "motDePasseSecret",
      lastName: student.lastName,
      firstName: student.firstName,
      link: "https://localhost:5173/user/resetpwd",
      programs: progsAccepted,
    }, your_public_key).catch(console.error);
  };

  if (!student.permanentCode) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar user={user} profilePic={userPicture} />
        <main className="flex-1 flex items-center justify-center text-slate-400 text-sm">Aucun étudiant trouvé.</main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar user={user} profilePic={userPicture} />

      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <p className="text-sm font-semibold text-slate-900">{student.firstName} {student.lastName}</p>
            <p className="text-xs text-slate-400">{student.permanentCode}</p>
          </div>
          <button onClick={initUpdForm} className="flex items-center gap-2 border border-slate-200 hover:border-blue-700 hover:text-blue-800 text-slate-600 text-xs font-medium px-3 py-2 rounded-lg transition-colors">
            <HiOutlinePencilAlt className="w-4 h-4" />
            Modifier le profil
          </button>
        </div>

        <div className="p-8 flex flex-col gap-6 max-w-5xl">

          {/* ── CARTE RECTO — Identité ── */}
          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Carte étudiante — Recto</h2>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              {/* Bandeau bleu */}
              <div className="bg-blue-800 h-2 w-full" />
              <div className="p-6 flex gap-6 items-start">
                {/* Photo */}
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <Avatar img={userPicture} bordered size="xl" rounded />
                  <span className="text-xs text-slate-400">Étudiant</span>
                </div>
                {/* Infos identité */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                  <InfoRow label="Nom" value={student.lastName} />
                  <InfoRow label="Prénom" value={student.firstName} />
                  <InfoRow label="Code permanent" value={student.permanentCode} />
                  <InfoRow label="Date de naissance" value={student.birthDay} />
                  <InfoRow label="Sexe" value={student.sexe} />
                  <InfoRow label="Nationalité" value={student.nationality} />
                  <InfoRow label="Adresse" value={student.streetAddress} />
                  <InfoRow label="Téléphone" value={student.phoneNumber} />
                  <InfoRow label="NAS" value={student.nas} />
                </div>
                {/* Logo établissement */}
                <div className="shrink-0 hidden md:flex flex-col items-center gap-1 opacity-70">
                  <img src={logo} alt="UA" className="w-12 h-12 object-contain" />
                  <span className="text-xs font-bold text-blue-800 tracking-wide">MyUA</span>
                </div>
              </div>
              <div className="border-t border-slate-100 px-6 py-3 bg-slate-50 flex gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-blue-800" />
                <span className="text-xs text-slate-400 tracking-wide">Academia — Carte officielle d'étudiant</span>
              </div>
            </div>
          </section>

          {/* ── CARTE VERSO — Informations académiques ── */}
          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Carte étudiante — Verso</h2>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="bg-slate-700 h-2 w-full" />
              <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                <InfoRow label="Rôle" value={student.userRole} />
                <InfoRow label="Email personnel" value={student.personalEmail} />
                <InfoRow label="Email scolaire" value={student.professionalEmail} />
                <InfoRow label="Faculté" value={student.faculty} />
                <InfoRow label="Département" value={student.department} />
                <InfoRow label="Niveau" value={student.lvlDegree} />
              </div>
              <div className="border-t border-slate-100 px-6 py-3 bg-slate-50 flex justify-between items-center">
                <span className="text-xs text-slate-400">Session en cours</span>
                <button
                  onClick={() => navigate("/bulletin", { state: { studentToShow: student.permanentCode } })}
                  className="text-xs font-medium text-blue-700 hover:underline"
                >
                  Voir le bulletin →
                </button>
              </div>
            </div>
          </section>

          {/* ── Programmes inscrits ── */}
          {programsEnrolled.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Programmes en cours d'obtention</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {programsEnrolled.map((p) => (
                  <div key={p.title} className="bg-white border border-green-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                        <HiFire className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">En cours</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{p.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{p.programName}</p>
                    <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                      <InfoRow label="Niveau" value={p.grade} />
                      <InfoRow label="Faculté" value={p.faculty} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Inscriptions à valider (admin seulement) ── */}
          {isAdmin && programsNotEnrolled.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Inscriptions à valider</h2>
              <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-4">

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {programsNotEnrolled.map((program) => (
                    <div key={program.title} className={`border rounded-xl p-4 transition-colors ${
                      decisions[program.title] === true  ? "border-green-300 bg-green-50" :
                      decisions[program.title] === false ? "border-red-300 bg-red-50" :
                      "border-slate-200 bg-slate-50"
                    }`}>
                      <p className="text-sm font-semibold text-slate-900">{program.title}</p>
                      <p className="text-xs text-slate-500 mb-1">{program.programName}</p>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <InfoRow label="Niveau" value={program.grade} />
                        <InfoRow label="Faculté" value={program.faculty} />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { program.isEnrolled = false; setDecisions((d) => ({ ...d, [program.title]: false })); }}
                          className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                            decisions[program.title] === false ? "bg-red-500 text-white border-red-500" : "bg-white text-slate-500 border-slate-200 hover:border-red-300"
                          }`}
                        >
                          <HiX className="w-4 h-4" /> Refuser
                        </button>
                        <button
                          onClick={() => { program.isEnrolled = true; setDecisions((d) => ({ ...d, [program.title]: true })); }}
                          className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                            decisions[program.title] === true ? "bg-green-500 text-white border-green-500" : "bg-white text-slate-500 border-slate-200 hover:border-green-300"
                          }`}
                        >
                          <HiCheck className="w-4 h-4" /> Accepter
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fichiers */}
                {files.length > 0 && (
                  <div className="border border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Documents joints</p>
                    <div className="flex flex-col gap-2">
                      {files.map((file) => (
                        <button
                          key={file.fileName}
                          onClick={() => downloadStudentFile(file.fileName)}
                          className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 hover:underline transition-colors"
                        >
                          <HiOutlineDownload className="w-4 h-4 shrink-0" />
                          {file.fileName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={registerToAProgram}
                    className="bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                  >
                    Confirmer les décisions
                  </button>
                  {toasts.success  && <span className="text-xs text-green-700">Programme(s) mis à jour.</span>}
                  {toasts.warning  && <span className="text-xs text-orange-600">Impossible de contacter le serveur.</span>}
                  {toasts.error    && <span className="text-xs text-red-600">{toasts.errorMsg}</span>}
                </div>
              </div>
            </section>
          )}

        </div>
      </main>

      {/* ── Modal modification ── */}
      <EditModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        form={profileModForm}
        onChange={handleModifyChange}
        onSubmit={updateProfile}
        showAlert={showAlert}
        fields={[
          { id: "phoneNumber", label: "Téléphone" },
          { id: "nas",         label: "NAS" },
          { id: "pwd",         label: "Nouveau mot de passe", type: "password", optional: true },
        ]}
      />
    </div>
  );
};

export default StudentDetails;