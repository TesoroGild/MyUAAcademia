import logo2 from "../../assets/img/UA_Logo2.jpg";
import { HiOutlineArrowLeft, HiOutlineArrowRight, HiExclamation, HiX, HiCheck } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { admissionS } from "../../services/user.service";

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-0.5 py-2 border-b border-slate-50 last:border-0">
    <span className="text-xs text-slate-400 uppercase tracking-wide font-medium">{label}</span>
    <span className="text-sm text-slate-800">{value || "—"}</span>
  </div>
);

const AdmissionVerify = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const str       = location.state?.studentToRegister;
  const [alert, setAlert]       = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    if (type !== "success") setTimeout(() => setAlert(null), 5000);
  };

  const apply = async () => {
    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("birthDay",     str.birthDay);
      fd.append("firstname",    str.firstname);
      fd.append("lastname",     str.lastname);
      if (str.nas) fd.append("nas", str.nas);
      fd.append("nationality",  str.nationality);
      fd.append("personalEmail",str.personalEmail);
      fd.append("phoneNumber",  str.phoneNumber);
      fd.append("sexe",         str.sexe);
      fd.append("streetAddress",str.streetAddress);
      fd.append("password",          str.pwd);
      fd.append("userRole",     "student");
      if (str.identityProof?.[0])   fd.append("identityProof",   str.identityProof[0]);
      if (str.picture?.[0])         fd.append("picture",         str.picture[0]);
      if (str.schoolTranscript?.[0]) fd.append("schoolTranscript", str.schoolTranscript[0]);
      str.programTitle.forEach((p) => fd.append("programTitle", p.value ?? p));

      const result = await admissionS(fd);

      if (result.success) {
        const userInProcess = {
          firstName: result.studentRegistered.firstName,
          lastName:  result.studentRegistered.lastName,
          email:     result.studentRegistered.personalEmail,
          program:   result.studentRegistered.userProgramEnrollments?.map((p) => p.title).join(", "),
        };
        navigate("/admission/payment", { state: { userInProcess } });
      } else {
        showAlert("error", result.message);
      }
    } catch {
      showAlert("warning", "Impossible de contacter le serveur. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!str) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-3">
          <img src={logo2} alt="UA Logo" className="h-8 w-auto object-contain"/>
          <span className="font-semibold text-slate-800 text-sm uppercase tracking-wide hidden sm:block">
            MyUA Academia — Vérification du dossier
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-5">

        <div>
          <h1 className="text-lg font-bold text-slate-900">Vérifiez vos informations</h1>
          <p className="text-sm text-slate-500 mt-1">Assurez-vous que toutes les informations sont correctes avant de soumettre votre dossier.</p>
        </div>

        {alert && (
          <div className={`flex items-center gap-2 border rounded-xl px-4 py-3 text-sm ${
            alert.type === "error"   ? "bg-red-50 border-red-200 text-red-700" :
            alert.type === "warning" ? "bg-amber-50 border-amber-200 text-amber-700" :
                                       "bg-green-50 border-green-200 text-green-700"
          }`}>
            {alert.type === "error"   && <HiX className="w-4 h-4 shrink-0"/>}
            {alert.type === "warning" && <HiExclamation className="w-4 h-4 shrink-0"/>}
            {alert.type === "success" && <HiCheck className="w-4 h-4 shrink-0"/>}
            {alert.message}
          </div>
        )}

        {/* Identité */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Identité</p>
          <div className="grid sm:grid-cols-2 gap-x-8">
            <InfoRow label="Nom"               value={str.lastname} />
            <InfoRow label="Prénom"            value={str.firstname} />
            <InfoRow label="Sexe"              value={str.sexe} />
            <InfoRow label="Date de naissance" value={str.birthDay} />
            <InfoRow label="Nationalité"       value={str.nationality} />
            <InfoRow label="NAS"               value={str.nas || "Non renseigné"} />
          </div>
        </div>

        {/* Coordonnées */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Coordonnées</p>
          <div className="grid sm:grid-cols-2 gap-x-8">
            <InfoRow label="Email"     value={str.personalEmail} />
            <InfoRow label="Téléphone" value={str.phoneNumber} />
            <div className="sm:col-span-2">
              <InfoRow label="Adresse" value={str.streetAddress} />
            </div>
          </div>
        </div>

        {/* Programme */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Programme(s) demandé(s)</p>
          {str.programTitle.map((p, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 border-b border-slate-50 last:border-0">
              <span className="text-sm text-slate-800">{p.label ?? p}</span>
            </div>
          ))}
        </div>

        {/* Documents */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Documents joints</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Relevés scolaires", file: str.schoolTranscript?.[0] },
              { label: "Photo(s)",           file: str.picture?.[0] },
              { label: "Pièce d'identité",   file: str.identityProof?.[0] },
            ].map(({ label, file }) => (
              <div key={label} className={`border rounded-xl px-4 py-3 ${file ? "border-green-200 bg-green-50/30" : "border-slate-200 bg-slate-50"}`}>
                <p className="text-xs text-slate-500 mb-1">{label}</p>
                {file
                  ? <p className="text-xs font-medium text-green-700 flex items-center gap-1"><HiCheck className="w-3.5 h-3.5"/>{file.name}</p>
                  : <p className="text-xs text-slate-400">Non fourni</p>
                }
              </div>
            ))}
          </div>
        </div>

        {/* Mot de passe */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Accès au compte</p>
          <p className="text-xs text-slate-400">Un mot de passe a été défini. Il vous servira à vous connecter une fois votre dossier validé.</p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pb-8">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-600 font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
            <HiOutlineArrowLeft className="w-4 h-4"/>
            Modifier
          </button>
          <button onClick={apply} disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
            {isLoading ? "Envoi en cours..." : "Confirmer et passer au paiement"}
            <HiOutlineArrowRight className="w-4 h-4"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdmissionVerify;