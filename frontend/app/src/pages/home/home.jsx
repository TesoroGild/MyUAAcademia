import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import uaLogo from '../../assets/img/UA_Logo2.jpg';
import { Avatar } from "flowbite-react";

const PROGRAMS = [
  {
    grade: "Certificat",
    label: "Certificat",
    duration: "1 an",
    description: "Formations courtes et spécialisées pour une insertion rapide.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
      </svg>
    ),
  },
  {
    grade: "BTS",
    label: "BTS",
    duration: "2 ans",
    description: "Brevet de technicien supérieur, formation professionnalisante.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
      </svg>
    ),
  },
  {
    grade: "Baccalauréat",
    label: "Baccalauréat",
    duration: "3 ans",
    description: "Socle académique fondamental, ouverture vers la recherche.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
  },
  {
    grade: "Master",
    label: "Master",
    duration: "5 ans",
    description: "Spécialisation avancée et préparation à l'expertise métier.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
  },
  {
    grade: "Doctorat",
    label: "Doctorat",
    duration: "8 ans",
    description: "Recherche de haut niveau et contribution scientifique originale.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
  },
];

const STATS = [
  { value: "3 200+", label: "Étudiants inscrits" },
  { value: "180+", label: "Enseignants qualifiés" },
  { value: "42", label: "Programmes actifs" },
  { value: "96%", label: "Taux d'insertion" },
];

const Home = () => {
  const navigate = useNavigate();

  const navigateToGradePrograms = (grade) => {
    navigate(`/programs/${grade}`);
  };

  const [showRoleModal, setShowRoleModal] = useState(false);

    const handleLogin = () => setShowRoleModal(true);

    const handleRoleSelect = (role) => {
        setShowRoleModal(false);
        navigate(role === "student" ? "/login/user" : "/login/employee");
    };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── HEADER ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
                <Avatar img={uaLogo} bordered size="sm" />
                <span className="font-semibold text-slate-800 text-sm tracking-wide uppercase">
                    MyUA Academia
                </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-600">
            <a href="#programmes" className="hover:text-blue-800 transition-colors">Programmes</a>
            <a href="#apropos" className="hover:text-blue-800 transition-colors">À propos</a>
            <a href="#contact" className="hover:text-blue-800 transition-colors">Contact</a>
          </nav>
          <button
            onClick={handleLogin}
            className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            Se connecter
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest text-blue-700 uppercase mb-4 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Établissement d'enseignement supérieur
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
              Bienvenue à<br />
              <span className="text-blue-800">MyUA Academia</span>
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Une institution dédiée à l'excellence académique. Découvrez nos
              filières, nos programmes et rejoignez une communauté engagée dans
              la réussite de chaque étudiant.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#programmes"
                className="bg-blue-800 hover:bg-blue-900 text-white font-medium px-6 py-3 rounded transition-colors text-sm"
              >
                Explorer les programmes
              </a>
              <button
                onClick={handleLogin}
                className="border border-slate-300 hover:border-blue-800 hover:text-blue-800 text-slate-700 font-medium px-6 py-3 rounded transition-colors text-sm"
              >
                Espace étudiant / enseignant
              </button>
            </div>
          </div>
          {/* Decorative right panel */}
            <div className="hidden md:block">
                <div className="grid grid-cols-2 gap-4">
                    {STATS.map((s) => (
                    <div key={s.label} className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col gap-1">
                        <span className="text-3xl font-bold text-blue-800">{s.value}</span>
                        <span className="text-sm text-slate-500">{s.label}</span>
                    </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* ── STATS mobile ── */}
      <section className="md:hidden bg-white border-b border-slate-200 py-6">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-2xl font-bold text-blue-800 block">{s.value}</span>
                <span className="text-xs text-slate-500 block">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROGRAMMES ── */}
      <section id="programmes" className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Nos filières</h2>
          <p className="text-slate-500 text-sm">
            Sélectionnez un niveau pour consulter les programmes disponibles.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROGRAMS.map((p) => (
            <button
              key={p.grade}
              onClick={() => navigateToGradePrograms(p.grade)}
              className="group text-left bg-white border border-slate-200 hover:border-blue-700 hover:shadow-md rounded-xl p-6 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 group-hover:bg-blue-800 group-hover:text-white group-hover:border-blue-800 transition-colors">
                  {p.icon}
                </div>
                <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded-full">
                  {p.duration}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-1 group-hover:text-blue-800 transition-colors">
                {p.label}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">{p.description}</p>
              <div className="mt-4 flex items-center gap-1 text-blue-700 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Voir les programmes
                <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── À PROPOS ── */}
      <section id="apropos" className="bg-white border-t border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-10">
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 mb-4">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Institution reconnue</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Accréditée par les autorités nationales de l'enseignement supérieur,
              notre établissement garantit des diplômes reconnus à l'international.
            </p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 mb-4">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Corps enseignant expert</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Plus de 180 enseignants et professionnels issus du terrain transmettent
              leur expertise dans un cadre pédagogique rigoureux et innovant.
            </p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 mb-4">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Suivi personnalisé</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Notre plateforme numérique permet un suivi en temps réel des résultats,
              des absences et de la progression académique de chaque étudiant.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA connexion ── */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Vous êtes inscrit ?</h2>
        <p className="text-slate-500 mb-6 text-sm">
          Accédez à votre espace personnel pour consulter vos notes, votre emploi du temps et vos documents.
        </p>
        <button
          onClick={handleLogin}
          className="inline-flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white font-medium px-8 py-3 rounded transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          Accéder à mon espace
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contact" className="bg-slate-900 text-slate-400 text-sm">
        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3">
                <Avatar img={uaLogo} bordered size="sm" />
                <span className="font-semibold text-slate-800 text-sm tracking-wide uppercase">
                    MyUA Academia
                </span>
          </div>
            <p className="text-xs leading-relaxed">
              Plateforme de gestion académique développée pour faciliter le suivi
              des étudiants et des enseignants.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3 text-sm">Filières</h4>
            <ul className="space-y-1 text-xs">
              {PROGRAMS.map((p) => (
                <li key={p.grade}>
                  <button
                    onClick={() => navigateToGradePrograms(p.grade)}
                    className="hover:text-white transition-colors"
                  >
                    {p.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3 text-sm">Contact</h4>
            <ul className="space-y-1 text-xs">
              <li>contact@myua-academia.edu</li>
              <li>+1 (000) 000-0000</li>
              <li className="pt-2 text-slate-500">Lundi – Vendredi, 8h – 17h</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 max-w-6xl mx-auto px-6 py-4 text-xs text-slate-600">
          © {new Date().getFullYear()} MyUA Academia — Projet portfolio
        </div>
      </footer>


      {showRoleModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    onClick={() => setShowRoleModal(false)}
  >
    <div
      className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Accéder à mon espace</h2>
      <p className="text-sm text-slate-500 mb-6">Vous êtes :</p>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => handleRoleSelect("student")}
          className="flex items-center gap-4 border border-slate-200 hover:border-blue-700 hover:bg-blue-50 rounded-xl p-4 transition-all group text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 group-hover:bg-blue-800 group-hover:text-white group-hover:border-blue-800 transition-colors shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-slate-900 text-sm group-hover:text-blue-800 transition-colors">Étudiant</p>
            <p className="text-xs text-slate-500">Accéder à mes cours et résultats</p>
          </div>
        </button>

        <button
          onClick={() => handleRoleSelect("employee")}
          className="flex items-center gap-4 border border-slate-200 hover:border-blue-700 hover:bg-blue-50 rounded-xl p-4 transition-all group text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 group-hover:bg-blue-800 group-hover:text-white group-hover:border-blue-800 transition-colors shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-slate-900 text-sm group-hover:text-blue-800 transition-colors">Employé</p>
            <p className="text-xs text-slate-500">Espace enseignant et administration</p>
          </div>
        </button>
      </div>

      <button
        onClick={() => setShowRoleModal(false)}
        className="mt-5 w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors"
      >
        Annuler
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default Home;