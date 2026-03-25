import { useNavigate } from "react-router-dom";
import logo2 from "../../assets/img/UA_Logo2.jpg";

const ROLE_HOME = {
  student:   "/studentspace",
  professor: "/professorspace",
  employee:  "/adminspace",
  admin:     "/adminspace",
};

const Notfound = () => {
  const navigate  = useNavigate();
  const userRole  = localStorage.getItem("userRole")?.toLowerCase();
  const isLoggedIn = !!localStorage.getItem("justLoggedIn");

  const homeRoute = isLoggedIn && userRole ? ROLE_HOME[userRole] ?? "/home" : "/home";
  const homeLabel = isLoggedIn
    ? userRole === "student"   ? "Retour à mon espace étudiant"
    : userRole === "professor" ? "Retour à mon espace professeur"
    :                            "Retour à mon espace admin"
    : "Retour à l'accueil";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <div className="mb-10">
        <img src={logo2} alt="UA Logo" className="h-10 w-auto object-contain opacity-60"/>
      </div>

      {/* Numéro */}
      <p className="text-8xl font-black text-slate-200 select-none leading-none mb-4">404</p>

      {/* Message */}
      <h1 className="text-xl font-bold text-slate-900 mb-2">Page introuvable</h1>
      <p className="text-sm text-slate-500 text-center max-w-sm mb-8">
        {isLoggedIn
          ? "Cette page n'existe pas ou vous n'avez pas accès à cette ressource. Il est possible que votre session ait expiré."
          : "Cette page n'existe pas ou n'est plus disponible."
        }
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={() => navigate(homeRoute)}
          className="bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          {homeLabel}
        </button>
        {isLoggedIn && (
          <button
            onClick={() => navigate(-1)}
            className="border border-slate-200 hover:border-slate-300 text-slate-600 text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Page précédente
          </button>
        )}
        {!isLoggedIn && (
          <button
            onClick={() => navigate("/login/user")}
            className="border border-slate-200 hover:border-slate-300 text-slate-600 text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Se connecter
          </button>
        )}
      </div>

      {/* Conseil session expirée */}
      {isLoggedIn && (
        <p className="mt-8 text-xs text-slate-400 text-center max-w-xs">
          Si vous pensez que c'est une erreur et que votre session a expiré,{" "}
          <button
            onClick={() => {
              localStorage.clear();
              navigate(userRole === "student" || userRole === "professor" ? "/login/user" : "/login/employee");
            }}
            className="text-blue-700 hover:underline"
          >
            reconnectez-vous ici
          </button>
          .
        </p>
      )}

    </div>
  );
};

export default Notfound;