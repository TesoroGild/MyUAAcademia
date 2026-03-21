import logo2 from "../../assets/img/UA_Logo2.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { HiCreditCard, HiLightningBolt } from "react-icons/hi";

const PaymentAdmission = () => {
  const navigate       = useNavigate();
  const location       = useLocation();
  const userInProcess  = location.state?.userInProcess;

  const AMOUNT = 120;

  const [form, setForm] = useState({ fullName: "", cardNumber: "", expiry: "", cvv: "" });
  const [isLoading, setIsLoading] = useState(false);

  const autofill = () => {
    setForm({
      fullName:   `${userInProcess?.firstName ?? ""} ${userInProcess?.lastName ?? ""}`.trim(),
      cardNumber: "4111 1111 1111 1111",
      expiry:     "12/28",
      cvv:        "123",
    });
  };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const formatCard = (val) => {
    const clean = val.replace(/\D/g, "").slice(0, 16);
    return clean.replace(/(.{4})/g, "$1 ").trim();
  };

  const pay = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simule un délai de paiement
    setTimeout(() => {
      setIsLoading(false);
      navigate("/admission/bill", { state: { userInProcess } });
    }, 1500);
  };

  const inputCls = "w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-3">
          <img src={logo2} alt="UA Logo" className="h-8 w-auto object-contain"/>
          <span className="font-semibold text-slate-800 text-sm uppercase tracking-wide hidden sm:block">
            MyUA Academia — Paiement des frais d'admission
          </span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-lg font-bold text-slate-900">Frais d'étude de dossier</h1>
          <p className="text-sm text-slate-500 mt-1">Ces frais couvrent l'analyse de votre dossier d'admission. Ils ne sont pas remboursables.</p>
        </div>

        {/* Récap étudiant */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">{userInProcess?.firstName} {userInProcess?.lastName}</p>
              <p className="text-xs text-slate-500 mt-0.5">{userInProcess?.program}</p>
            </div>
            <span className="text-lg font-bold text-slate-900">{AMOUNT} $</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">

          {/* Formulaire paiement */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HiCreditCard className="w-4 h-4 text-slate-500"/>
                  <p className="text-sm font-semibold text-slate-900">Informations de paiement</p>
                </div>
                {/* Autofill */}
                <button type="button" onClick={autofill}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                  <HiLightningBolt className="w-3.5 h-3.5"/>
                  Remplissage auto
                </button>
              </div>

              <form onSubmit={pay} className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Nom (tel qu'indiqué sur la carte)</label>
                  <input name="fullName" type="text" value={form.fullName} onChange={handleChange}
                    placeholder="Marie Dupont" required className={inputCls}/>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Numéro de carte</label>
                  <input name="cardNumber" type="text" value={form.cardNumber}
                    onChange={(e) => setForm((f) => ({ ...f, cardNumber: formatCard(e.target.value) }))}
                    placeholder="xxxx xxxx xxxx xxxx" maxLength={19} required className={inputCls}/>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Expiration</label>
                    <input name="expiry" type="text" value={form.expiry} onChange={handleChange}
                      placeholder="MM/AA" maxLength={5} required className={inputCls}/>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">CVV</label>
                    <input name="cvv" type="password" value={form.cvv} onChange={handleChange}
                      placeholder="•••" maxLength={4} required className={inputCls}/>
                  </div>
                </div>

                <button type="submit" disabled={isLoading}
                  className="w-full bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-medium rounded-lg py-3 text-sm transition-colors mt-2">
                  {isLoading ? "Traitement en cours..." : `Payer ${AMOUNT} $`}
                </button>
              </form>
            </div>
          </div>

          {/* Récap paiement */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Récapitulatif</p>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Frais d'étude de dossier</span>
                  <span>{AMOUNT} $</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Taxes</span>
                  <span>0 $</span>
                </div>
                <div className="border-t border-slate-100 pt-2 mt-1 flex justify-between font-semibold text-slate-900">
                  <span>Total</span>
                  <span>{AMOUNT} $</span>
                </div>
              </div>
            </div>

            {/* Logos paiement */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs text-slate-400 text-center mb-3">Paiements sécurisés acceptés</p>
              <div className="flex items-center justify-center gap-6">
                <img className="h-6 w-auto" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/visa.svg" alt="Visa"/>
                <img className="h-6 w-auto" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/mastercard.svg" alt="Mastercard"/>
                <img className="h-6 w-auto" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/paypal.svg" alt="PayPal"/>
              </div>
            </div>

            <p className="text-xs text-slate-400 text-center">
              En procédant au paiement, vous acceptez les conditions d'admission de MyUA Academia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAdmission;