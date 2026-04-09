import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toast, ToastToggle } from "flowbite-react";
import { HiExclamation, HiEye, HiEyeOff, HiX } from "react-icons/hi";
import { employeeLogin, userLogin } from "../../services/auth.service";
import uaLogo from '../../assets/img/UA_Logo2.jpg';
import { Avatar } from "flowbite-react";

const CONFIG = {
  employee: {
    title: "Espace Employé",
    subtitle: "Connectez-vous avec votre code employé.",
    codeLabel: "Code employé",
    codePlaceholder: "ex. ABCD12345678",
    codeHint: "Votre code vous a été fourni par l'administration.",
    loginFn: employeeLogin,
    roleRedirects: {
      admin: "/adminspace",
      director: "/adminspace",
      default: "/professorspace",
    },
    setCoKey: "employee", // pour savoir quel setter appeler
  },
  student: {
    title: "Espace Étudiant",
    subtitle: "Connectez-vous avec votre matricule étudiant.",
    codeLabel: "Matricule",
    codePlaceholder: "ex. STU20240001",
    codeHint: "Votre matricule figure sur votre carte étudiante.",
    loginFn: userLogin,
    roleRedirects: {
      default: "/studentspace",
    },
    setCoKey: "student",
  },
};

function Login({ type, setUser }) {
  const config = CONFIG[type];
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ code: "", pwd: "" });
  const [codeFocused, setCodeFocused] = useState(false);
  const [pwdFocused, setPwdFocused] = useState(false);
  const [errorToast, setErrorToast] = useState({ show: false, message: "" });
  const [warnToast, setWarnToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const showError = (msg) => {
    setErrorToast({ show: true, message: msg });
    setTimeout(() => setErrorToast({ show: false, message: "" }), 5000);
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = type === "student" ? { permanentCode: form.code, pwd: form.pwd } : { code: form.code, pwd: form.pwd };

      const result = await config.loginFn(payload);

      if (result.success) {
        const user = result.userConnected;
        setUser((prev) => ({ ...prev, ...user }));

        localStorage.setItem("justLoggedIn", true);
        localStorage.setItem("userRole", user.userRole);
        localStorage.setItem("user", JSON.stringify(user));

        const role = user.userRole.toLowerCase();
        const redirect = config.roleRedirects[role] ?? config.roleRedirects.default;
        const from = location.state?.from?.pathname || redirect;
        navigate(from, { replace: true });
      } else {
        showError(result.message);
      }
    } catch {
      setWarnToast(true);
      setTimeout(() => setWarnToast(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // On passe le type actuel dans l'URL pour la page suivante
    // Si type est "user", on peut le transformer en "student" si tu préfères ce mot
    const roleParam = type === "student" ? "student" : "employee";
    navigate(`/resetpwd?role=${roleParam}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {warnToast && (
          <Toast>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
              <HiExclamation className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">
              Impossible de contacter le serveur. Veuillez réessayer.
            </div>
            <ToastToggle />
          </Toast>
        )}
        {errorToast.show && (
          <Toast>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500">
              <HiX className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">{errorToast.message}</div>
            <ToastToggle />
          </Toast>
        )}
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Avatar img={uaLogo} bordered size="sm" />
            <span className="font-semibold text-slate-800 text-sm tracking-wide uppercase">
                MyUA Academia
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">{config.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{config.subtitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={onLogin} className="flex flex-col gap-5">

          {/* Code */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="code" className="text-sm font-medium text-slate-700">
              {config.codeLabel}
            </label>
            <input
              type="text"
              id="code"
              name="code"
              placeholder={config.codePlaceholder}
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              onBlur={() => setCodeFocused(true)}
              required
              className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
            />
            {codeFocused && !form.code && (
              <span className="text-xs text-red-500">Ce champ est requis.</span>
            )}
            <span className="text-xs text-slate-400">{config.codeHint}</span>
          </div>

          {/* Mot de passe */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pwd" className="text-sm font-medium text-slate-700">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                id="pwd"
                name="pwd"
                placeholder="••••••••"
                value={form.pwd}
                onChange={(e) => setForm({ ...form, pwd: e.target.value })}
                onBlur={() => setPwdFocused(true)}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
              >
                {showPwd ? <HiEyeOff className="w-4 h-4"/> : <HiEye className="w-4 h-4"/>}
              </button>
            </div>
            {pwdFocused && !form.pwd && (
              <span className="text-xs text-red-500">
                Veuillez saisir votre mot de passe.
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!form.code || !form.pwd || loading}
            className="w-full bg-blue-800 hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        {/* Back */}
        <button onClick={handleForgotPassword}
          className="mt-4 text-xs text-slate-400 hover:text-slate-600 transition-colors">
          Mot de passe oublié ?
        </button>
        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          ← Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

export default Login;