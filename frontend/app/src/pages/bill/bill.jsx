import Sidebar from "../sidebar/sidebar";
import userPicture from "../../assets/img/User_Icon.png";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineCash, HiInformationCircle, HiChevronDown, HiChevronUp, HiExclamationCircle, HiCheckCircle } from "react-icons/hi";
import { Tooltip } from "flowbite-react";
import { getStudentBillsS } from "../../services/bill.service";
import { getSessionCoursePriceS } from "../../services/course.service";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const SESSIONS = ["Hiver", "Été", "Automne"];

const fmt = (dateString) => {
  if (!dateString) return "—";
  try { return format(new Date(dateString), "dd MMMM yyyy", { locale: fr }); }
  catch { return dateString; }
};

const fmt$ = (val) => val != null ? `${Number(val).toFixed(2)} $` : "—";

const OTHER_FEES = [
  { key: "generalExpenses",          label: "Frais généraux",                  tip: "Frais de fonctionnement généraux de l'établissement." },
  { key: "sportsAdministrationFees", label: "Frais d'administration sportive",  tip: "Accès aux installations sportives et services associés." },
  { key: "dentalInsurance",          label: "Assurance dentaire",               tip: "Couverture dentaire de base incluse dans les frais de session." },
  { key: "insuranceFees",            label: "Frais d'assurance",                tip: "Assurance santé et responsabilité civile étudiante." },
];

// ── Ligne de tableau ─────────────────────────────────────────────────────────
const TRow = ({ label, value, muted, bold, tip }) => (
  <tr className={`border-b border-slate-100 last:border-0 ${muted ? "bg-slate-50" : "bg-white"}`}>
    <td className={`py-3 px-4 text-sm ${bold ? "font-semibold text-slate-900" : "text-slate-700"}`}>
      <div className="flex items-center gap-1.5">
        {label}
        {tip && (
          <Tooltip content={tip} placement="right">
            <HiInformationCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </Tooltip>
        )}
      </div>
    </td>
    <td className={`py-3 px-4 text-sm text-right ${bold ? "font-semibold text-slate-900" : "text-slate-600"}`}>
      {value}
    </td>
  </tr>
);

// ── Détail d'une facture ─────────────────────────────────────────────────────
const BillDetail = ({ bill, courses, total, onPay }) => {
  const restToPay = total - (bill?.amountPaid || 0);
  const isPaid = restToPay <= 0;

  return (
    <div className="flex flex-col gap-5 mt-5">

      {/* Statut paiement */}
      {isPaid ? (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
          <HiCheckCircle className="w-5 h-5 shrink-0" />
          Facture réglée — solde à zéro.
        </div>
      ) : (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-4">
          <HiExclamationCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">Paiement dû avant le {fmt(bill.deadLine)}</p>
            <p className="text-red-600 mt-0.5">Des frais de 52 $ seront ajoutés si le paiement est reçu après cette date.</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">

        {/* Cours */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cours inscrits</p>
            <p className="text-xs text-slate-400 mt-0.5">Émission : {fmt(bill.dateOfIssue)}</p>
          </div>
          <table className="w-full">
            <tbody>
              {courses.map((c, i) => (
                <TRow key={i} label={`${c.sigle}${c.courseName ? ` — ${c.courseName}` : ""}`} value={fmt$(c.price)} muted={i % 2 === 1} />
              ))}
              <TRow label="Sous-total cours" value={fmt$(bill.amount)} bold />
            </tbody>
          </table>
        </div>

        {/* Autres frais */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Autres frais</p>
          </div>
          <table className="w-full">
            <tbody>
              {OTHER_FEES.map((f, i) => (
                <TRow key={f.key} label={f.label} value={fmt$(bill[f.key])} muted={i % 2 === 1} tip={f.tip} />
              ))}
              {bill.refundsAndAdjustments > 0 && (
                <TRow label="Remboursements et ajustements" value={`− ${fmt$(bill.refundsAndAdjustments)}`} muted />
              )}
              <TRow label="Total général" value={fmt$(total)} bold />
              <TRow label={`Montant payé`} value={fmt$(bill.amountPaid)} muted />
              <TRow label={`Solde au ${fmt(new Date())}`} value={fmt$(restToPay)} bold />
            </tbody>
          </table>
        </div>
      </div>

      {!isPaid && (
        <div className="flex justify-end">
          <button
            onClick={onPay}
            className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <HiOutlineCash className="w-4 h-4" />
            Payer cette facture
          </button>
        </div>
      )}
    </div>
  );
};

// ── Page principale ──────────────────────────────────────────────────────────
const Bill = ({ user }) => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear().toString();

  const [studentBills, setStudentBills] = useState([]);
  const [activeSession, setActiveSession] = useState("Hiver");
  const [studentCourses, setStudentCourses] = useState([]);
  const [billToDisplay, setBillToDisplay] = useState(null);
  const [total, setTotal] = useState(0);
  const [expandedBill, setExpandedBill] = useState(null); // pour l'historique
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user.permanentCode?.trim()) getStudentBills();
  }, []);

  useEffect(() => {
    loadSession(currentYear, activeSession);
  }, [studentBills, activeSession]);

  const getStudentBills = async () => {
    setIsLoading(true);
    try {
      const bills = await getStudentBillsS(user.permanentCode);
      setStudentBills(bills);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const getCourses = async (year, session) => {
    try {
      const res = await getSessionCoursePriceS({ permanentCode: user.permanentCode, yearCourse: year, sessionCourse: session });
      if (res.success) {
        setStudentCourses(res.courses);
      }
      setStudentCourses([]);
    } catch (e) { console.error(e); setStudentCourses([]); }
  };

  const calcTotal = (bill) => {
    if (!bill) return 0;
    let t = 0;
    t += bill.generalExpenses           || 0;
    t += bill.sportsAdministrationFees  || 0;
    t += bill.dentalInsurance           || 0;
    t += bill.insuranceFees             || 0;
    t += bill.amount                    || 0;
    t -= bill.refundsAndAdjustments     || 0;
    return t;
  };

  const loadSession = async (year, session) => {
    const found = studentBills.find((b) => b.yearStudy == year && b.sessionStudy === session);
    if (found) {
      await getCourses(year, session);
      setBillToDisplay(found);
      setTotal(calcTotal(found));
    } else {
      setBillToDisplay(null);
      setStudentCourses([]);
      setTotal(0);
    }
  };

  const handleSessionClick = (session) => {
    setActiveSession(session);
  };

  const handleHistoryRowClick = async (bill) => {
    if (expandedBill?.yearStudy === bill.yearStudy && expandedBill?.sessionStudy === bill.sessionStudy) {
      setExpandedBill(null); return;
    }
    setExpandedBill(bill);
    await getCourses(bill.yearStudy, bill.sessionStudy);
    setTotal(calcTotal(bill));
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar user={user} profilePic={userPicture} />

      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-8 sticky top-0 z-10">
          <div>
            <p className="text-sm font-semibold text-slate-900">Mes factures</p>
            <p className="text-xs text-slate-400">Session {currentYear}</p>
          </div>
        </div>

        <div className="p-8 flex flex-col gap-6 max-w-5xl">

          {/* ── Onglets session ── */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Session {currentYear}</p>
            <div className="flex gap-2 mb-1">
              {SESSIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSessionClick(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    activeSession === s
                      ? "bg-blue-800 text-white border-blue-800"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-700 hover:text-blue-800"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="mt-6 text-sm text-slate-400">Chargement...</div>
            ) : billToDisplay ? (
              <BillDetail
                bill={billToDisplay}
                courses={studentCourses}
                total={total}
                onPay={() => navigate("/payment/courses", { state: { billToDisplay } })}
              />
            ) : (
              <div className="mt-6 text-sm text-slate-400">Aucune facture pour la session {activeSession} {currentYear}.</div>
            )}
          </div>

          {/* ── Historique ── */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setHistoryExpanded(!historyExpanded)}
              className="w-full flex items-center justify-between px-6 py-4 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span>Historique de toutes mes factures</span>
              {historyExpanded ? <HiChevronUp className="w-4 h-4" /> : <HiChevronDown className="w-4 h-4" />}
            </button>

            {historyExpanded && (
              <div className="border-t border-slate-100">
                {studentBills.length === 0 ? (
                  <p className="px-6 py-4 text-sm text-slate-400">Aucune facture trouvée.</p>
                ) : (
                  studentBills.map((bill, i) => {
                    const isOpen = expandedBill?.yearStudy === bill.yearStudy && expandedBill?.sessionStudy === bill.sessionStudy;
                    const restToPay = calcTotal(bill) - (bill.amountPaid || 0);
                    return (
                      <div key={i} className="border-b border-slate-100 last:border-0">
                        <button
                          onClick={() => handleHistoryRowClick(bill)}
                          className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                        >
                          <div className="text-left">
                            <p className="text-sm font-medium text-slate-900">{bill.sessionStudy} {bill.yearStudy}</p>
                            <p className="text-xs text-slate-400">Émission : {fmt(bill.dateOfIssue)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-medium border px-2 py-0.5 rounded-full ${
                              restToPay <= 0
                                ? "bg-green-50 text-green-700 border-green-100"
                                : "bg-amber-50 text-amber-700 border-amber-100"
                            }`}>
                              {restToPay <= 0 ? "Réglée" : `Solde : ${fmt$(restToPay)}`}
                            </span>
                            {isOpen ? <HiChevronUp className="w-4 h-4 text-slate-400" /> : <HiChevronDown className="w-4 h-4 text-slate-400" />}
                          </div>
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-6">
                            <BillDetail
                              bill={bill}
                              courses={studentCourses}
                              total={calcTotal(bill)}
                              onPay={() => navigate("/payment/courses", { state: { billToDisplay: bill } })}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Bill;