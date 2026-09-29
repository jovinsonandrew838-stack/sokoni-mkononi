import React, { useState } from 'react';
import { X, Store, CheckCircle, ShieldCheck, MapPin, Phone, User, Sparkles, CreditCard, Loader2 } from 'lucide-react';
import { Language, Vendor } from '../types';

interface VendorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onRegisterVendor: (vendor: Vendor) => void;
  existingVendorsCount: number;
}

const POPULAR_MARKETS = [
  { name: 'Soko la Kigamboni Ferry', city: 'Dar es Salaam' },
  { name: 'Soko Kuu la Kariakoo', city: 'Dar es Salaam' },
  { name: 'Soko la Tandale', city: 'Dar es Salaam' },
  { name: 'Soko la Ilala (Boma)', city: 'Dar es Salaam' },
  { name: 'Soko la Temeke Stereo', city: 'Dar es Salaam' },
  { name: 'Soko la Kisutu', city: 'Dar es Salaam' },
  { name: 'Soko la Buguruni', city: 'Dar es Salaam' },
  { name: 'Soko la Kawe', city: 'Dar es Salaam' },
  { name: 'Soko Kuu la Arusha (Kilombero)', city: 'Arusha' },
  { name: 'Soko Kuu la Mwanza (Mwaloni)', city: 'Mwanza' },
  { name: 'Soko Kuu la Dodoma (Majengo)', city: 'Dodoma' },
  { name: 'Soko la Darajani', city: 'Zanzibar' },
  { name: 'Soko Lingine...', city: 'Tanzania' },
];

const CATEGORIES_LIST = [
  { id: 'mboga', sw: 'Mboga za Majani, Nyanya & Viungo', en: 'Vegetables & Herbs' },
  { id: 'matunda', sw: 'Matunda Mabichi', en: 'Fresh Fruits' },
  { id: 'nyama', sw: 'Nyama, Samaki Wabichi & Kuku', en: 'Meat, Fresh Fish & Poultry' },
  { id: 'nafaka', sw: 'Nafaka, Mchele & Unga', en: 'Grains, Rice & Flours' },
  { id: 'mafuta', sw: 'Mafuta ya Kupikia & Asali', en: 'Cooking Oils & Natural Honey' },
  { id: 'jumla', sw: 'Uuzaji wa Jumla (Mizigo)', en: 'Wholesale & Bulk Produce' },
];

export const VendorRegistrationModal: React.FC<VendorRegistrationModalProps> = ({
  isOpen,
  onClose,
  language,
  onRegisterVendor,
  existingVendorsCount,
}) => {
  if (!isOpen) return null;

  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [marketName, setMarketName] = useState(POPULAR_MARKETS[0].name);
  const [customMarketName, setCustomMarketName] = useState('');
  const [stallNumber, setStallNumber] = useState('');
  const [category, setCategory] = useState(CATEGORIES_LIST[0].id);
  const [city, setCity] = useState('Dar es Salaam');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'tigopesa' | 'airtel' | 'halopesa'>('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registeredVendor, setRegisteredVendor] = useState<Vendor | null>(null);

  const registrationFeeTZS = 2000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !ownerName.trim() || !phone.trim() || !stallNumber.trim()) {
      alert(language === 'sw' ? 'Tafadhali jaza nafasi zote zenye nyota (*)' : 'Please fill all required fields (*)');
      return;
    }

    setIsProcessing(true);

    const finalMarket = marketName === 'Soko Lingine...' && customMarketName.trim()
      ? customMarketName.trim()
      : marketName;

    // Simulate mobile money USSD Push prompt for TZS 2,000 fee
    setTimeout(() => {
      const paymentRef = `${paymentMethod.toUpperCase()}-REG-2000-${Math.floor(100000 + Math.random() * 900000)}`;
      const newVendor: Vendor = {
        id: `VND-${Math.floor(1000 + Math.random() * 9000)}`,
        businessName: businessName.trim(),
        ownerName: ownerName.trim(),
        phone: phone.trim(),
        marketName: finalMarket,
        stallNumber: stallNumber.trim(),
        category,
        city,
        registeredAt: new Date().toLocaleDateString('sw-TZ', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'active',
        productsCount: 0,
        registrationFeePaid: true,
        registrationFeeTZS,
        paymentMethod,
        paymentRef,
      };

      onRegisterVendor(newVendor);
      setRegisteredVendor(newVendor);
      setIsProcessing(false);
      setIsSubmitted(true);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-stone-200 shadow-2xl relative">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black shadow-sm">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-stone-900 text-base sm:text-lg leading-tight">
                {language === 'sw'
                  ? 'Usajili wa Wafanyabiashara wa Masokoni'
                  : 'Market Vendors & Sellers Registration'}
              </h2>
              <p className="text-xs text-stone-500">
                {language === 'sw'
                  ? 'Sajili banda au duka lako kuuza mazao moja kwa moja kwa wateja'
                  : 'Register your market stall to sell produce directly to customers'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Registration Fee Notice Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 leading-relaxed flex items-start gap-2.5">
                <CreditCard className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-amber-900">
                      {language === 'sw' ? 'Ada ya Usajili / Kujiunga: ' : 'One-Time Onboarding Fee: '}
                    </span>
                    <span className="bg-amber-200 text-amber-900 font-mono font-black px-2 py-0.5 rounded text-xs">
                      TZS 2,000
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    {language === 'sw'
                      ? 'Kila mfanyabiashara anapojiunga hutozwa ada ya usajili ya Shilingi 2,000 mara moja tu kupitia simu yake ili kuwezesha duka au kibanda chake kuwa hewani kwenye Sokoni Mkononi.'
                      : 'Each seller is charged a one-time onboarding fee of TZS 2,000 upon registration via mobile money to activate their stall on Sokoni Mkononi.'}
                  </p>
                </div>
              </div>

              {/* Business & Owner Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'sw' ? 'Jina la Biashara / Genge / Duka *' : 'Business / Stall Name *'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder={language === 'sw' ? 'mf. Genge la Mama Asha' : 'e.g. Mama Asha Fresh Greens'}
                      className="w-full pl-8 pr-3 py-2 text-xs border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    <Store className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'sw' ? 'Jina la Mmiliki *' : 'Owner Full Name *'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="mf. Asha Juma Salum"
                      className="w-full pl-8 pr-3 py-2 text-xs border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    <User className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Phone & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'sw' ? 'Namba ya Simu ya Malipo *' : 'Phone Number *'}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0754 123 456"
                      className="w-full pl-8 pr-3 py-2 text-xs border border-stone-300 rounded-lg text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'sw' ? 'Mji / Mkoa *' : 'City / Region *'}
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Dar es Salaam">Dar es Salaam</option>
                    <option value="Arusha">Arusha</option>
                    <option value="Mwanza">Mwanza</option>
                    <option value="Dodoma">Dodoma</option>
                    <option value="Tanga">Tanga</option>
                    <option value="Mbeya">Mbeya</option>
                    <option value="Morogoro">Morogoro</option>
                    <option value="Zanzibar">Zanzibar</option>
                  </select>
                </div>
              </div>

              {/* Market Location and Stall Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'sw' ? 'Soko Unalofanyia Biashara *' : 'Market Location *'}
                  </label>
                  <select
                    value={marketName}
                    onChange={(e) => setMarketName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {POPULAR_MARKETS.map((m, idx) => (
                      <option key={idx} value={m.name}>
                        {m.name} ({m.city})
                      </option>
                    ))}
                  </select>
                  {marketName === 'Soko Lingine...' && (
                    <input
                      type="text"
                      required
                      value={customMarketName}
                      onChange={(e) => setCustomMarketName(e.target.value)}
                      placeholder={language === 'sw' ? 'Andika jina la soko lako' : 'Enter market name'}
                      className="w-full mt-2 px-3 py-1.5 text-xs border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'sw' ? 'Namba ya Meza / Fremu / Kibanda *' : 'Stall / Table / Booth Number *'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={stallNumber}
                      onChange={(e) => setStallNumber(e.target.value)}
                      placeholder={language === 'sw' ? 'mf. Meza Na. 42, Njia ya Kati' : 'e.g. Stall 42, Central Row'}
                      className="w-full pl-8 pr-3 py-2 text-xs border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Primary Category */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'sw' ? 'Kundi Kuu la Mazao Unayouza *' : 'Primary Produce Category *'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CATEGORIES_LIST.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                        category === cat.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-500'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span>{language === 'sw' ? cat.sw : cat.en}</span>
                      {category === cat.id && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Money Channel for TZS 2,000 Payment */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'sw' ? 'Mtandao wa Kulipia Ada ya TZS 2,000 *' : 'Payment Method for TZS 2,000 Fee *'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'mpesa', name: 'M-Pesa', color: 'border-red-500' },
                    { id: 'tigopesa', name: 'Tigo Pesa', color: 'border-blue-500' },
                    { id: 'airtel', name: 'Airtel Money', color: 'border-red-600' },
                    { id: 'halopesa', name: 'Halopesa', color: 'border-orange-500' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition-all ${
                        paymentMethod === m.id
                          ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guarantees */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'sw' ? 'Faida kwa Mfanyabiashara:' : 'Seller Benefits:'}</span>
                </div>
                <p>• {language === 'sw' ? 'Malipo ya papo hapo kupitia namba yako ya simu kila mzigo ukichukuliwa.' : 'Instant mobile money payouts on dispatch.'}</p>
                <p>• {language === 'sw' ? 'Dereva wa Sokoni Mkononi anakuja kuchukua mzigo sokoni kwako moja kwa moja.' : 'Our verified couriers pick up orders directly at your stall.'}</p>
              </div>

              {/* Submit Button with TZS 2,000 Payment */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                      <span>
                        {language === 'sw'
                          ? `Inatuma ombi la malipo (TZS 2,000) kwa ${paymentMethod.toUpperCase()}...`
                          : `Prompting USSD payment (TZS 2,000) via ${paymentMethod.toUpperCase()}...`}
                      </span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-amber-300" />
                      <span>
                        {language === 'sw'
                          ? 'Lipa TZS 2,000 & Kamilisha Usajili wa Duka Lako'
                          : 'Pay TZS 2,000 & Complete Vendor Registration'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Success confirmation screen */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-xl font-black text-stone-900">
                  {language === 'sw' ? 'Hongera! Usajili na Malipo Yamekamilika' : 'Registration & Payment Successful!'}
                </h3>
                <p className="text-xs text-stone-600 mt-1 max-w-md mx-auto">
                  {language === 'sw'
                    ? `Duka lako la "${registeredVendor?.businessName}" limelipiwa ada ya usajili na kusajiliwa rasmi kwenye mtandao wa Sokoni Mkononi.`
                    : `Your stall "${registeredVendor?.businessName}" has paid the onboarding fee and is active on Sokoni Mkononi.`}
                </p>
              </div>

              {/* Vendor details & payment slip */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">{language === 'sw' ? 'Namba ya Usajili (Vendor ID):' : 'Vendor ID:'}</span>
                  <span className="font-mono font-bold text-stone-900">{registeredVendor?.id}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2 text-emerald-800 font-semibold">
                  <span>{language === 'sw' ? 'Ada ya Kujiunga Iliyolipwa:' : 'Onboarding Fee Paid:'}</span>
                  <span className="font-mono font-bold text-emerald-700">TZS 2,000 (Imelipwa ✓)</span>
                </div>
                {registeredVendor?.paymentRef && (
                  <div className="flex justify-between border-b border-stone-200 pb-2 text-[11px]">
                    <span className="text-stone-500">{language === 'sw' ? 'Kumbukumbu ya Malipo:' : 'Payment Ref:'}</span>
                    <span className="font-mono text-stone-700">{registeredVendor?.paymentRef}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-500">{language === 'sw' ? 'Mmiliki:' : 'Owner:'}</span>
                  <span className="font-semibold text-stone-900">{registeredVendor?.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{language === 'sw' ? 'Soko & Eneo:' : 'Market & Location:'}</span>
                  <span className="font-semibold text-stone-900">{registeredVendor?.marketName} ({registeredVendor?.stallNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{language === 'sw' ? 'Hali ya Akaunti:' : 'Account Status:'}</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    {language === 'sw' ? 'Iko Hewani (Active)' : 'Active'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  {language === 'sw' ? 'Funga & Rudi Sokoni' : 'Done & Return to Market'}
                </button>
                <a
                  href={`https://wa.me/255768000111?text=Habari%20Sokoni%20Mkononi,%20nimejisajili%20na%20kulipa%20ada%20ya%20TZS%202000%20Vendor%20ID:%20${registeredVendor?.id}%20katika%20${registeredVendor?.marketName}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{language === 'sw' ? 'Wasiliana Nasi WhatsApp' : 'Contact via WhatsApp'}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
