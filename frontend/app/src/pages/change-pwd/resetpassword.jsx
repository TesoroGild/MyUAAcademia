import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HiCheck, HiX, HiExclamation, HiEye, HiEyeOff, HiArrowLeft } from "react-icons/hi";
import { verifyUserForResetS, verifyUser1ForResetS, modifyPasswordS, modifyPassword1S } from "../../services/auth.service";
import { ro } from "date-fns/locale";

// ── Règles de complexité ──────────────────────────────────────────────────────
const RULES = [
  { id: "length",  label: "Au moins 8 caractères",         test: (p) => p.length >= 8 },
  { id: "upper",   label: "Au moins une lettre majuscule", test: (p) => /[A-Z]/.test(p) },
  { id: "number",  label: "Au moins un chiffre",           test: (p) => /[0-9]/.test(p) },
  { id: "special", label: "Au moins un caractère spécial", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const getStrength = (pwd) => {
  const passed = RULES.filter((r) => r.test(pwd)).length;
  if (passed <= 1) return { label: "Faible", color: "bg-red-500",   text: "text-red-600",   width: "w-1/4" };
  if (passed === 2) return { label: "Moyen",  color: "bg-amber-500", text: "text-amber-600", width: "w-2/4" };
  if (passed === 3) return { label: "Bien",   color: "bg-blue-500",  text: "text-blue-600",  width: "w-3/4" };
  return               { label: "Fort",   color: "bg-green-500", text: "text-green-600", width: "w-full" };
};

const PwdInput = ({ id, value, onChange, placeholder, borderClass }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input id={id} type={show ? "text" : "password"} value={value} onChange={onChange}
        placeholder={placeholder} required
        className={`w-full border rounded-lg px-3 py-2.5 pr-10 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition ${borderClass}`}
      />
      <button type="button" onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
        {show ? <HiEyeOff className="w-4 h-4"/> : <HiEye className="w-4 h-4"/>}
      </button>
    </div>
  );
};

const AlertBox = ({ type, message }) => {
  const s = { success:"bg-green-50 border-green-200 text-green-700", error:"bg-red-50 border-red-200 text-red-700", warning:"bg-amber-50 border-amber-200 text-amber-700" }[type];
  const Icon = type==="success" ? HiCheck : type==="warning" ? HiExclamation : HiX;
  return <div className={`flex items-center gap-2 border rounded-xl px-4 py-3 text-sm ${s}`}><Icon className="w-4 h-4 shrink-0"/>{message}</div>;
};

// ── Page principale ───────────────────────────────────────────────────────────
const ResetPassword = ({user}) => {
  const navigate = useNavigate();
  const isConnected = !!user;
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");

  // Étapes : "identify" → "reset" → "success"
  const [step, setStep]                       = useState(isConnected ? "reset" : "identify");
  const [verifiedUser, setVerifiedUser]       = useState(isConnected ? user : null);
  const [userCode, setUserCode]               = useState("");
  const [personalEmail, setPersonalEmail]     = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert]                     = useState(null);
  const [isLoading, setIsLoading]             = useState(false);
  const [countdown, setCountdown]             = useState(5);
  const [loginRoute, setLoginRoute]           = useState("/login/employee");
  const [routeRole, setRouteRole]             = useState("");

  const passwordsMatch = newPassword !== "" && newPassword === confirmPassword;
  const allRulesPassed = RULES.every((r) => r.test(newPassword));
  const strength       = newPassword ? getStrength(newPassword) : null;

  const confirmBorderClass =
    confirmPassword === "" ? "border-slate-300" :
    passwordsMatch         ? "border-green-400" : "border-red-400";

  const showAlert = (type, message) => {
    setAlert({ type, message });
    if (type !== "success") setTimeout(() => setAlert(null), 5000);
  };

  const startCountdown = (route) => {
    let count = 5;
    setCountdown(count);
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) { clearInterval(interval); navigate(route); }
    }, 1000);
  };

  // ── Étape 1 : Vérification identité ──
  const handleIdentify = async (e) => {
    e.preventDefault();
    if (!userCode.trim() || !personalEmail.trim()) return;
    setIsLoading(true);
    try {
      let res;

      if (role == "student")
        res = await verifyUser1ForResetS({ code: userCode, email: personalEmail });
      else res = await verifyUserForResetS({ code: userCode, email: personalEmail });

      if (res.success) {
        setVerifiedUser(res.user);
        setStep("reset");
      } else {
        showAlert("error", res.message);
      }
    } catch {
      showAlert("warning", "Impossible de contacter le serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Étape 2 : Nouveau mot de passe ──
  const handleReset = async (e) => {
    e.preventDefault();
    if (!allRulesPassed) { showAlert("error", "Le mot de passe ne respecte pas toutes les règles de sécurité."); return; }
    if (!passwordsMatch)  { showAlert("error", "Les mots de passe ne correspondent pas."); return; }

    setIsLoading(true);
    try {
      const userResetCred = {
        userCode: userCode, 
        currentPwd: "", 
        newPwd: newPassword 
      }
      let res;

      if (role == "student")
        res = await modifyPassword1S(userResetCred);
      else res = await modifyPasswordS(userResetCred);

      if (res.success) {
        const route = (role === "student") ? "/login/user" : "/login/employee";
        setLoginRoute(route);
        setStep("success");
        startCountdown(route);
      } else {
        showAlert("error", res.message);
      }
    } catch {
      showAlert("warning", "Impossible de contacter le serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Succès ──
  if (step === "success") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 w-full max-w-md text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <HiCheck className="w-7 h-7 text-green-600"/>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Mot de passe réinitialisé</h2>
          <p className="text-sm text-slate-500 mb-6">
            Votre mot de passe a été modifié. Redirection dans{" "}
            <span className="font-semibold text-blue-800">{countdown}</span> seconde{countdown > 1 ? "s" : ""}.
          </p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mb-5">
            <div className="h-1.5 bg-blue-700 rounded-full transition-all duration-1000"
              style={{ width: `${((5 - countdown) / 5) * 100}%` }}/>
          </div>
          <button onClick={() => navigate(loginRoute)}
            className="text-xs text-slate-400 hover:text-slate-700 transition-colors">
            Se connecter maintenant →
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 w-full max-w-md">

        {/* Header */}
        <div className="mb-6">
          <button onClick={() => step === "reset" && !isConnected
              ? setStep("identify")
              : navigate(isConnected ? -1 : "/login/employee")
            }
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-700 transition-colors mb-4">
            <HiArrowLeft className="w-3.5 h-3.5"/>
            {step === "reset" ? "Modifier mes informations" : "Retour à la connexion"}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-800 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">UA</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {isConnected ? "Changer mon mot de passe" : "Réinitialiser mon mot de passe"}
              </p>
              <p className="text-xs text-slate-400">
                {isConnected
                  ? "Vous êtes connecté — définissez votre nouveau mot de passe directement"
                  : step === "identify"
                    ? "Étape 1 sur 2 — Vérification de votre identité"
                    : "Étape 2 sur 2 — Nouveau mot de passe"
                }
              </p>
            </div>
          </div>

          {/* Barre d'étapes */}
          {!isConnected && (
            <div className="flex gap-2 mt-5">
              {["identify", "reset"].map((s, i) => (
                <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${
                  step === "identify" && i === 0 ? "bg-blue-700" :
                  step === "reset" ? "bg-blue-700" : "bg-slate-200"
                }`}/>
              ))}
            </div>
          )}
        </div>

        {alert && <div className="mb-4"><AlertBox type={alert.type} message={alert.message}/></div>}

        {/* ── Étape 1 : Identification ── */}
        {step === "identify" && (
            <form onSubmit={handleIdentify} className="flex flex-col gap-5">
              <p className="text-sm text-slate-600">
                Renseignez votre code d'utilisateur et l'email associé à votre compte pour réinitialiser votre mot de passe.
              </p>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="userCode" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Code utilisateur
                </label>
                <input id="userCode" type="text" value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  placeholder="ex. NOMP12345678"
                  required
                  className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
                />
                <p className="text-xs text-slate-400">Votre code permanent (étudiant) ou code employé.</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="personalEmail" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Email personnel
                </label>
                <input id="personalEmail" type="email" value={personalEmail}
                  onChange={(e) => setPersonalEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
                />
              </div>

              <button type="submit" disabled={isLoading || !userCode.trim() || !personalEmail.trim()}
                className="w-full bg-blue-800 hover:bg-blue-900 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm transition-colors">
                {isLoading ? "Vérification..." : "Vérifier mon identité"}
              </button>
            </form>
          )
        }

        {/* ── Étape 2 : Nouveau mot de passe ── */}
        {step === "reset" && (
          <form onSubmit={handleReset} className="flex flex-col gap-5">

            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-600">
              Compte vérifié — <span className="font-semibold">{verifiedUser?.firstName} {verifiedUser?.lastName}</span>
              {" · "}<span className="font-mono">{verifiedUser?.code ?? userCode}</span>
            </div>

            {/* Nouveau mdp */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="newPassword" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Nouveau mot de passe
              </label>
              <PwdInput id="newPassword" value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Choisissez un mot de passe sécurisé"
                borderClass="border-slate-300"
              />
              {newPassword && (
                <>
                  <div className="flex items-center justify-between mt-1 mb-1">
                    <span className="text-xs text-slate-400">Force</span>
                    <span className={`text-xs font-medium ${strength.text}`}>{strength.label}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
                    <div className={`h-1.5 rounded-full transition-all ${strength.color} ${strength.width}`}/>
                  </div>
                  <div className="flex flex-col gap-1">
                    {RULES.map((rule) => {
                      const ok = rule.test(newPassword);
                      return (
                        <div key={rule.id} className={`flex items-center gap-1.5 text-xs ${ok ? "text-green-700" : "text-slate-400"}`}>
                          {ok ? <HiCheck className="w-3.5 h-3.5 shrink-0"/> : <div className="w-3.5 h-3.5 shrink-0 rounded-full border border-slate-300"/>}
                          {rule.label}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Confirmation */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Confirmer le mot de passe
              </label>
              <PwdInput id="confirmPassword" value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Répétez votre mot de passe"
                borderClass={confirmBorderClass}
              />
              {confirmPassword !== "" && !passwordsMatch && (
                <p className="text-xs text-red-600">Les mots de passe ne correspondent pas.</p>
              )}
              {confirmPassword !== "" && passwordsMatch && (
                <p className="text-xs text-green-700 flex items-center gap-1">
                  <HiCheck className="w-3.5 h-3.5"/>Les mots de passe correspondent.
                </p>
              )}
            </div>

            <button type="submit" disabled={isLoading || !allRulesPassed || !passwordsMatch}
              className="w-full bg-blue-800 hover:bg-blue-900 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm transition-colors">
              {isLoading ? "Modification en cours..." : "Réinitialiser mon mot de passe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;