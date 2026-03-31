import { useNavigate } from "react-router-dom";
import logo2 from "../../assets/img/UA_Logo2.jpg";

const ROLE_HOME = {
  student:   "/studentspace",
  professor: "/professorspace",
  //employee:  "/adminspace",
  admin:     "/adminspace",
};

const ROLE_LABEL = {
  student:   "étudiant",
  professor: "professeur",
  employee:  "employé",
  admin:     "administrateur",
};

const Forbidden = () => {
  const navigate  = useNavigate();
  const userRole  = localStorage.getItem("userRole")?.toLowerCase();
  const homeRoute = userRole ? ROLE_HOME[userRole] ?? "/home" : "/home";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">

      <div className="mb-10">
        <img src={logo2} alt="UA Logo" className="h-10 w-auto object-contain opacity-60"/>
      </div>

      <p className="text-8xl font-black text-slate-200 select-none leading-none mb-4">403</p>

      <h1 className="text-xl font-bold text-slate-900 mb-2">Accès refusé</h1>
      <p className="text-sm text-slate-500 text-center max-w-sm mb-8">
        {userRole
          ? `Votre compte ${ROLE_LABEL[userRole] ?? userRole} n'a pas les droits nécessaires pour accéder à cette page.`
          : "Vous n'avez pas les droits nécessaires pour accéder à cette page."
        }
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={() => navigate(homeRoute)}
          className="bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          Retour à mon espace
        </button>
      </div>

      <p className="mt-8 text-xs text-slate-400 text-center max-w-xs">
        Si vous pensez qu'il s'agit d'une erreur, contactez un administrateur.
      </p>
    </div>
  );
};

export default Forbidden;