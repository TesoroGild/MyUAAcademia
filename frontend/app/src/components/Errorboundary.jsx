import { Component } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo2 from "../assets/img/UA_Logo2.jpg";

// ── Wrapper fonctionnel pour injecter les hooks React Router ─────────────────

class ErrorBoundaryClass extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  reset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <this.props.fallback
          error={this.state.error}
          onReset={() => this.reset()}
        />
      );
    }
    return this.props.children;
  }
}

// ── Fallback UI ───────────────────────────────────────────────────────────────
const ErrorFallback = ({ error, onReset }) => {
  const navigate   = useNavigate();
  const userRole   = localStorage.getItem("userRole")?.toLowerCase();

  const ROLE_HOME = {
    student:   "/studentspace",
    professor: "/professorspace",
    director:  "/adminspace",
    admin:     "/adminspace",
  };

  const homeRoute = userRole ? ROLE_HOME[userRole] ?? "/home" : "/home";

  const handleGoHome = () => {
    onReset();
    navigate(homeRoute, { replace: true });
  };

  const handleGoBack = () => {
    onReset();
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <div className="mb-8">
        <img src={logo2} alt="UA Logo" className="h-10 w-auto object-contain opacity-60" />
      </div>

      {/* Icône */}
      <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-5">
        <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>

      {/* Message */}
      <h1 className="text-xl font-bold text-slate-900 mb-2">Une erreur est survenue</h1>
      <p className="text-sm text-slate-500 text-center max-w-sm mb-2">
        Cette page a rencontré un problème inattendu. Vos données ne sont pas affectées.
      </p>

      {/* Détail erreur — discret */}
      {error?.message && (
        <p className="text-xs text-slate-400 font-mono bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 max-w-sm text-center mb-8 break-all">
          {error.message}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={handleGoHome}
          className="bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          Retour à mon espace
        </button>
        <button
          onClick={handleGoBack}
          className="border border-slate-200 hover:border-slate-300 text-slate-600 text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          Page précédente
        </button>
        <button
          onClick={() => { onReset(); window.location.reload(); }}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors underline"
        >
          Recharger la page
        </button>
      </div>

      <p className="mt-8 text-xs text-slate-400 text-center max-w-xs">
        Si le problème persiste, contactez le support technique de MyUA Academia.
      </p>
    </div>
  );
};

// ── Export : composant final combiné ─────────────────────────────────────────
const ErrorBoundary = ({ children }) => {
  const location = useLocation(); // On récupère l'URL ici
  
  return (
    <ErrorBoundaryClass key={location.pathname} fallback={ErrorFallback}>
      {children}
    </ErrorBoundaryClass>
  );
};

export default ErrorBoundary;