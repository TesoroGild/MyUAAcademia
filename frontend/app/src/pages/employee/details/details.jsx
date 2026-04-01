import { HiOutlinePencilAlt } from "react-icons/hi";

import logo from "../../../assets/img/UA_Logo.png";
import adminPicture from "../../../assets/img/Admin.jpg";

import Sidebar from "../../sidebar/sidebar";

import { getEmployeeS } from "../../../services/employee.service";
import { updateUser } from "../../../services/profile.service";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "flowbite-react";

// ── Petit composant champ info ───────────────────────────────────────────────
const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs text-slate-400 uppercase tracking-wide font-medium">{label}</span>
    <span className="text-sm text-slate-800 font-medium">{value || "—"}</span>
  </div>
);

// ── Badge rôle ───────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => {
  const styles = {
    admin:     "bg-purple-50 text-purple-700 border-purple-100",
    professor: "bg-blue-50 text-blue-700 border-blue-100",
    employee:  "bg-slate-100 text-slate-600 border-slate-200",
  };
  const style = styles[role?.toLowerCase()] ?? styles.employee;
  const labels = { admin: "Administrateur", professor: "Professeur", employee: "Employé" };
  return (
    <span className={`text-xs font-semibold border px-2 py-0.5 rounded-full ${style}`}>
      {labels[role?.toLowerCase()] ?? role}
    </span>
  );
};

// ── Modal modification ───────────────────────────────────────────────────────
const EditModal = ({ open, onClose, form, onChange, onSubmit, showAlert, role }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Modifier le profil</h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {[
            { id: "lastname",    label: "Nom" },
            { id: "firstname",   label: "Prénom" },
            { id: "phoneNumber", label: "Téléphone" },
          ].map(({ id, label }) => (
            <div key={id} className="flex flex-col gap-1.5">
              <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>
              <input
                type="text"
                id={id}
                name={id}
                value={form[id] ?? ""}
                onChange={onChange}
                required
                className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
              />
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <Link 
                to={`/resetpwd?role=${role === "student" ? "student" : "employee"}`}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Modifier votre mot de passe?
              </Link>
            </div>
          </div>
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
const EmployeeDetails = ({ user }) => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    firstName: "", lastName: "", code: "", userCode: "", department: "",
    faculty: "", job: "", sexe: "", professionalEmail: "", personalEmail: "",
    userRole: "", phoneNumber: "", nas: "", birthDay: "", nationality: "",
    empStatus: "", DateOfTakingOffice: "", contracts: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [profileModForm, setProfileModForm] = useState({ code: "", phoneNumber: "", lastname: "", firstname: "", pwd: "" });

  useEffect(() => {
    if (user) getEmployee(user.code);
  }, [user]);

  const getEmployee = async (code) => {
    try {
      const res = await getEmployeeS(code);
      if (res.success) setProfile(res.employeeFounded);
    } catch (e) { console.error(e); }
  };

  const initUpdForm = () => {
    setProfileModForm({
      code: profile.code || profile.userCode,
      phoneNumber: profile.phoneNumber || "",
      lastname: profile.lastName || "",
      firstname: profile.firstName || "",
      pwd: "",
    });
    setOpenModal(true);
  };

  const handleModifyChange = (e) => setProfileModForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const modified = await updateUser({
        code: profile.code || profile.userCode,
        phoneNumber: profileModForm.phoneNumber,
        lastname: profileModForm.lastname,
        firstname: profileModForm.firstname,
        pwd: profileModForm.pwd,
      });
      if (modified) {
        setOpenModal(false);
        setProfile((p) => ({ ...p, ...modified }));
      } else {
        setShowAlert(true);
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar user={user} profilePic={adminPicture} />

      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{profile.firstName} {profile.lastName}</p>
              <p className="text-xs text-slate-400">{profile.code || profile.userCode}</p>
            </div>
            <RoleBadge role={profile.userRole} />
          </div>
          <button onClick={initUpdForm} className="flex items-center gap-2 border border-slate-200 hover:border-blue-700 hover:text-blue-800 text-slate-600 text-xs font-medium px-3 py-2 rounded-lg transition-colors">
            <HiOutlinePencilAlt className="w-4 h-4" />
            Modifier le profil
          </button>
        </div>

        <div className="p-8 flex flex-col gap-6 max-w-5xl">

          {/* ── CARTE RECTO — Identité professionnelle ── */}
          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Badge employé — Recto</h2>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="bg-slate-800 h-2 w-full" />
              <div className="p-6 flex gap-6 items-start">
                {/* Photo */}
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <Avatar img={adminPicture} bordered size="xl" rounded />
                  <RoleBadge role={profile.userRole} />
                </div>
                {/* Infos pro */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                  <InfoRow label="Nom" value={profile.lastName} />
                  <InfoRow label="Prénom" value={profile.firstName} />
                  <InfoRow label="Code employé" value={profile.code || profile.userCode} />
                  <InfoRow label="Poste" value={profile.job} />
                  <InfoRow label="Faculté" value={profile.faculty} />
                  <InfoRow label="Département" value={profile.department} />
                  <InfoRow label="Date de prise de fonction" value={profile.DateOfTakingOffice} />
                  <InfoRow label="Contrat" value={profile.contracts} />
                  <InfoRow label="Statut" value={profile.empStatus} />
                </div>
                {/* Logo */}
                <div className="shrink-0 hidden md:flex flex-col items-center gap-1 opacity-60">
                  <img src={logo} alt="UA" className="w-12 h-12 object-contain" />
                  <span className="text-xs font-bold text-slate-700 tracking-wide">MyUA</span>
                </div>
              </div>
              <div className="border-t border-slate-100 px-6 py-3 bg-slate-50 flex gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-slate-700" />
                <span className="text-xs text-slate-400 tracking-wide">Academia — Badge officiel employé</span>
              </div>
            </div>
          </section>

          {/* ── CARTE VERSO — Informations personnelles ── */}
          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Badge employé — Verso</h2>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="bg-blue-800 h-2 w-full" />
              <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                <InfoRow label="Sexe" value={profile.sexe} />
                <InfoRow label="Date de naissance" value={profile.birthDay} />
                <InfoRow label="Nationalité" value={profile.nationality} />
                <InfoRow label="Téléphone" value={profile.phoneNumber} />
                <InfoRow label="Email professionnel" value={profile.professionalEmail} />
                <InfoRow label="Email personnel" value={profile.personalEmail} />
                <InfoRow label="NAS" value={profile.nas} />
              </div>
              <div className="border-t border-slate-100 px-6 py-3 bg-slate-50">
                <span className="text-xs text-slate-400">Informations confidentielles — usage interne uniquement</span>
              </div>
            </div>
          </section>

        </div>
      </main>

      <EditModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        form={profileModForm}
        onChange={handleModifyChange}
        onSubmit={updateProfile}
        showAlert={showAlert}
        role={user.userRole}
      />
    </div>
  );
};

export default EmployeeDetails;