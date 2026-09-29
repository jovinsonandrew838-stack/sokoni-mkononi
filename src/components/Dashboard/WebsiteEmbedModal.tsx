import React, { useState } from 'react';
import { Language } from '../../types';
import { sound } from '../../utils/audio';

interface WebsiteEmbedModalProps {
  onClose: () => void;
  lang: Language;
}

export const WebsiteEmbedModal: React.FC<WebsiteEmbedModalProps> = ({
  onClose,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'checkout' | 'split_api' | 'webhook'>('split_api');
  const [copied, setCopied] = useState(false);
  const [webhookLog, setWebhookLog] = useState<string | null>(null);

  const splitApiSnippet = `// LipaPay Split API - Gawio la 5% kwa Mmiliki wa Website & 95% kwa Muuza Mboga
const response = await fetch("https://api.lipapay.co/v1/marketplace/charge", {
  method: "POST",
  headers: {
    "Authorization": "Bearer sk_live_dar_market_key_98201",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    customer: {
      name: "Neema Mwambene",
      phone: "+255754112390",
      location: "Sinza Kijiweni, Dar es Salaam"
    },
    items: [
      { name: "Nyanya Fresh Tenga (Kariakoo)", price: 8000, qty: 2 } // TZS 16,000
    ],
    deliveryFee: 3000,
    totalCustomerAmount: 19000,
    
    // 🔥 UWEKAJI WA GAWIO LA ASILIMIA 5 (5% Platform Split):
    splitPayment: {
      platformCommissionRate: 0.05, // 5% inakwenda moja kwa moja kwako (TZS 800)
      vendorAccount: {
        vendorId: "ven_mama_asha_kariakoo",
        vendorMnoPhone: "+255754882104", // M-Pesa ya Mama Asha (95% = TZS 15,200)
        vendorMarket: "Kariakoo"
      },
      autoDisburseVendor: true // Tuma M-Pesa kwa muuzaji papo hapo muamala ukithibitishwa
    }
  })
});

const result = await response.json();
console.log("Malipo yamepokelewa! 5% yako:", result.platformEarnedTZS);`;

  const checkoutButtonSnippet = `<!-- 1. Weka Kitufe hiki kwenye Ukurasa wa Bidhaa za Mboga kwenye Website Yako -->
<button 
  class="sokoni-buy-btn"
  onclick="SokoLetuPay.checkout({
    produceName: 'Nyanya Fresh za Lushoto',
    price: 8000,
    vendorId: 'ven-1',
    vendorName: 'Mama Asha Mussa',
    market: 'Kariakoo',
    platformCut: 0.05, // Asilimia 5 yako inakatwa moja kwa moja!
    onSuccess: function(order) {
      alert('Malipo yamekamilika! Namba ya Oda: ' + order.ref);
    }
  })"
  style="background: #059669; color: white; padding: 12px 24px; border-radius: 12px; font-weight: bold; border: none; cursor: pointer;">
  Nunua kwa M-Pesa / Tigo (TZS 8,000)
</button>

<!-- 2. Weka script hii kabla ya kufunga </body> -->
<script src="https://cdn.lipapay.co/v1/soko-split.js"></script>`;

  const webhookSnippet = `// Node.js Backend Webhook ya Website Yako (Kupokea Taarifa za 5% & Pesa ya Muuzaji)
app.post("/api/lipapay-market-webhook", express.json(), (req, res) => {
  const { event, data } = req.body;

  if (event === "split_payment.success") {
    const { 
      orderRef, 
      grossAmount, 
      platformCommission5Pct, // 5% uliyopata wewe!
      vendorNet95Pct,         // 95% aliyopata muuzaji wa soko
      vendorPhone 
    } = data;

    console.log(\`✅ Oda \${orderRef} imelipwa!\`);
    console.log(\`💰 Kamisheni ya Website (5%): TZS \${platformCommission5Pct}\`);
    console.log(\`🧺 Muuzaji \${vendorPhone} amelipwa: TZS \${vendorNet95Pct}\`);

    // Sasisha database yako kuwa oda imelipwa na iko tayari kwa Boda
    return res.status(200).json({ status: "processed" });
  }

  res.status(400).send("Unhandled event");
});`;

  const currentSnippet =
    activeTab === 'split_api'
      ? splitApiSnippet
      : activeTab === 'checkout'
      ? checkoutButtonSnippet
      : webhookSnippet;

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestWebhook = () => {
    sound.playClick();
    setWebhookLog(lang === 'sw' ? 'Inatuma test webhook ya gawio la 5%...' : 'Dispatching 5% split test webhook...');
    setTimeout(() => {
      sound.playSuccess();
      setWebhookLog(
        JSON.stringify(
          {
            status: 200,
            event: 'split_payment.success',
            data: {
              orderRef: 'SK-DAR-94021',
              marketName: 'Kariakoo Market',
              vendorName: 'Mama Asha Mussa',
              grossProduceAmount: 18000,
              platformCommissionRate: '5%',
              platformCommissionEarnedTZS: 900,  // Exact 5% for website owner
              vendorNetDisbursedTZS: 17100,      // Exact 95% to Mama Asha
              deliveryFeeTZS: 3000,
              customerPaidTZS: 21000,
              timestamp: new Date().toISOString(),
            },
          },
          null,
          2
        )
      );
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl p-6 sm:p-8 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-start pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900">
              {lang === 'sw' ? 'Msimbo wa Kuunganisha na Website Yako (5% Split API)' : 'Marketplace 5% Split Integration Code'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-lg">
              {lang === 'sw'
                ? 'Tumia API hii au JavaScript SDK ili kila mteja anaponunua mboga kwenye website yako, 5% inaingia kwako moja kwa moja na 95% inakwenda kwa muuzaji wa soko.'
                : 'Use this API or embed button to automatically retain 5% platform commission on every sale while routing 95% to the vendor.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex gap-2 mt-4 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('split_api');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
              activeTab === 'split_api'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            REST API (Split 5% / 95%)
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('checkout');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
              activeTab === 'checkout'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            HTML / JS Button Embed
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('webhook');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
              activeTab === 'webhook'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            Backend Webhook Listener
          </button>
        </div>

        {/* Code block */}
        <div className="mt-4 relative bg-slate-900 text-slate-100 rounded-2xl p-4 font-mono text-xs overflow-x-auto max-h-72 border border-slate-800">
          <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
            <span>
              {activeTab === 'split_api'
                ? 'POST /api/marketplace/charge'
                : activeTab === 'checkout'
                ? 'index.html / wordpress'
                : 'server.js'}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white text-[11px] rounded font-sans cursor-pointer transition-colors"
            >
              {copied ? (lang === 'sw' ? 'Imenakiliwa!' : 'Copied!') : (lang === 'sw' ? 'Kopi Msimbo' : 'Copy Code')}
            </button>
          </div>
          <pre className="whitespace-pre">{currentSnippet}</pre>
        </div>

        {/* Webhook tester if on webhook tab */}
        {activeTab === 'webhook' && (
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-800">
                {lang === 'sw' ? 'Jaribu Callback ya 5% (Test Webhook)' : 'Test 5% Split Webhook Signal'}
              </span>
              <button
                type="button"
                onClick={handleTestWebhook}
                className="px-3 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
              >
                {lang === 'sw' ? 'Tuma Test Ping' : 'Dispatch Test Event'}
              </button>
            </div>
            {webhookLog && (
              <pre className="p-2.5 bg-slate-900 text-emerald-400 text-[11px] font-mono rounded-lg overflow-x-auto max-h-32">
                {webhookLog}
              </pre>
            )}
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            {lang === 'sw' ? 'Funga' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
