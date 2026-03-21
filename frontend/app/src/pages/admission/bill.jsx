import logo2 from "../../assets/img/UA_Logo2.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import { HiCheck, HiHome, HiMail, HiClock } from "react-icons/hi";

const AdmissionBill = () => {
  const navigate      = useNavigate();
  const location      = useLocation();
  const userInProcess = location.state?.userInProcess;

  const today = new Date().toLocaleDateString("fr-CA", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-3">
          <img src={logo2} alt="UA Logo" className="h-8 w-auto object-contain"/>
          <span className="font-semibold text-slate-800 text-sm uppercase tracking-wide hidden sm:block">
            MyUA Academia
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-6">

        {/* Confirmation */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <HiCheck className="w-8 h-8 text-green-600"/>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Dossier soumis avec succès</h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto">
            Merci <strong>{userInProcess?.firstName} {userInProcess?.lastName}</strong> d'avoir choisi MyUA Academia comme centre de formation. Votre dossier est à présent entre les mains de notre équipe d'admission.
          </p>
        </div>

        {/* Prochaines étapes */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Prochaines étapes</p>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                <HiMail className="w-3.5 h-3.5 text-blue-700"/>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Confirmation par email</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Une confirmation ainsi que votre facture électronique ont été envoyées à{" "}
                  <span className="text-blue-700 font-medium">{userInProcess?.email}</span>.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                <HiClock className="w-3.5 h-3.5 text-amber-600"/>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Analyse du dossier</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Notre équipe examine votre dossier. Vous recevrez la décision par email dans un délai de 5 à 10 jours ouvrables.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-green-50 border border-green-100 flex items-center justify-center shrink-0 mt-0.5">
                <HiCheck className="w-3.5 h-3.5 text-green-600"/>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Accès à votre espace étudiant</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Si votre dossier est accepté, vous pourrez vous connecter avec votre email et le mot de passe que vous avez défini lors de votre inscription.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reçu */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Reçu de paiement</p>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-slate-600 py-1.5 border-b border-slate-50">
              <span>Date</span><span>{today}</span>
            </div>
            <div className="flex justify-between text-slate-600 py-1.5 border-b border-slate-50">
              <span>Candidat</span><span>{userInProcess?.firstName} {userInProcess?.lastName}</span>
            </div>
            <div className="flex justify-between text-slate-600 py-1.5 border-b border-slate-50">
              <span>Programme(s)</span><span className="text-right max-w-[60%]">{userInProcess?.program}</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-900 py-1.5">
              <span>Frais d'admission payés</span><span>120 $</span>
            </div>
          </div>
        </div>

        {/* Retour accueil */}
        <div className="flex justify-center">
          <button onClick={() => navigate("/home")}
            className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors">
            <HiHome className="w-4 h-4"/>
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdmissionBill;