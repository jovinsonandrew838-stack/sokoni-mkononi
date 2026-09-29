import React, { useState } from 'react';
import { X, Store, CheckCircle, ShieldCheck, MapPin, Phone, User, Sparkles, CreditCard, Loader2, Check } from 'lucide-react';
import { Language, PackageTier, Vendor } from '../types';
import { VENDOR_PACKAGES } from '../data/packages';

interface VendorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onRegisterVendor: (vendor: Vendor) => void;
  existingVendorsCount: number;
  initialPackageTier?: PackageTier;
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
  initialPackageTier = 'starter',
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
  const [selectedTier, setSelectedTier] = useState<PackageTier>(initialPackageTier);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'tigopesa' | 'airtel' | 'halopesa'>('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registeredVendor, setRegisteredVendor] = useState<Vendor | null>(null);

  const currentPackage = VENDOR_PACKAGES.find((p) => p.id === selectedTier) || VENDOR_PACKAGES[0];

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

    // Simulate mobile money USSD Push prompt for chosen package price (2000, 5000, 10000)
    setTimeout(() => {
      const paymentRef = `${paymentMethod.toUpperCase()}-PKG-${currentPackage.priceTZS}-${Math.floor(100000 + Math.random() * 900000)}`;
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
        subscriptionPlan: selectedTier,
        subscriptionPriceTZS: currentPackage.priceTZS,
        subscriptionBillingCycle: 'monthly',
        registrationFeePaid: true,
        registrationFeeTZS: currentPackage.priceTZS,
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
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[94vh] overflow-y-auto border border-stone-200 shadow-2xl relative">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black shadow-sm">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-stone-900 text-base sm:text-lg leading-tight">
                {language === 'sw'
                  ? 'Usajili na Vifurushi vya Masoko ya Dar'
                  : 'Market Stall Registration & Monthly Packages'}
              </h2>
              <p className="text-xs text-stone-500">
                {language === 'sw'
                  ? 'Chagua kifurushi chako cha kila mwezi kuanzia TZS 2,000, 5,000 au 10,000'
                  : 'Select your monthly seller package: TZS 2,000, 5,000 or 10,000'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-7">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* VIFURUSHI VYA MALIPO (2000, 5000, 10000 KILA MWEZI) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                  {language === 'sw'
                    ? '1. Chagua Kifurushi Chako cha Kila Mwezi *'
                    : '1. Choose Your Monthly Subscription Package *'}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {VENDOR_PACKAGES.map((pkg) => {
                    const isSelected = selectedTier === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedTier(pkg.id)}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-md'
                            : 'border-stone-200 bg-stone-50/50 hover:border-stone-300'
                        }`}
                      >
                        {pkg.popular && (
                          <span className="absolute -top-2.5 right-3 bg-emerald-700 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                            {language === 'sw' ? 'Maarufu' : 'Popular'}
                          </span>
                        )}

                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-stone-900">
                              {language === 'sw' ? pkg.titleSw : pkg.titleEn}
                            </span>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}
                          </div>

                          <div className="my-2">
                            <span className="font-mono text-lg font-black text-stone-900 block">
                              TZS {pkg.priceTZS.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-stone-500 font-medium">
                              {language === 'sw' ? 'kwa kila mwezi' : 'per month'}
                            </span>
                          </div>

                          <p className="text-[10px] text-stone-600 line-clamp-2">
                            {language === 'sw' ? pkg.taglineSw : pkg.taglineEn}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-stone-200/70 text-[10px] font-semibold text-emerald-800">
                          {pkg.maxProducts === 999
                            ? (language === 'sw' ? '✓ Mazao Bila Kikomo' : '✓ Unlimited items')
                            : `✓ Hadi Mazao ${pkg.maxProducts}`}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Highlight of Selected Package Perks */}
                <div className="mt-3 p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-emerald-950">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      <span>
                        {language === 'sw' ? 'Mambo Utakayopata Kwenye ' : 'Features included in '}
                        {language === 'sw' ? currentPackage.titleSw : currentPackage.titleEn}:
                      </span>
                    </span>
                    <span className="font-mono font-black text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded text-[11px]">
                      TZS {currentPackage.priceTZS.toLocaleString()} / mwezi
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px] text-emerald-900">
                    {(language === 'sw' ? currentPackage.featuresSw : currentPackage.featuresEn).map((f, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Business & Owner Info */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                  {language === 'sw' ? '2. Taarifa za Duka au Fremu Yako' : '2. Stall & Owner Information'}
                </label>
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
                        className="w-full pl-8 pr-3 py-2 text-xs border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
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
                        className="w-full pl-8 pr-3 py-2 text-xs border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                      <User className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
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
                      className="w-full pl-8 pr-3 py-2 text-xs border border-stone-300 rounded-xl text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
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
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-stone-50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
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
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-stone-50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
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
                      className="w-full mt-2 px-3 py-1.5 text-xs border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
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
                      className="w-full pl-8 pr-3 py-2 text-xs border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
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
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
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

              {/* Mobile Money Channel for Payment */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
                  {language === 'sw'
                    ? `3. Chagua Mtandao wa Kulipia Kifurushi (TZS ${currentPackage.priceTZS.toLocaleString()}) *`
                    : `3. Choose Mobile Money Network for TZS ${currentPackage.priceTZS.toLocaleString()} *`}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'mpesa', name: 'Vodacom M-Pesa' },
                    { id: 'tigopesa', name: 'Tigo Pesa' },
                    { id: 'airtel', name: 'Airtel Money' },
                    { id: 'halopesa', name: 'Halopesa' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`py-2.5 px-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
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

              {/* Submit Button with Dynamic Package Price */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold text-sm sm:text-base rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
                      <span>
                        {language === 'sw'
                          ? `Inatuma ombi la USSD (TZS ${currentPackage.priceTZS.toLocaleString()}) kwa ${paymentMethod.toUpperCase()}...`
                          : `Prompting USSD (TZS ${currentPackage.priceTZS.toLocaleString()}) via ${paymentMethod.toUpperCase()}...`}
                      </span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 text-amber-300" />
                      <span>
                        {language === 'sw'
                          ? `Lipa TZS ${currentPackage.priceTZS.toLocaleString()} & Sajili Kifurushi cha ${currentPackage.titleSw}`
                          : `Pay TZS ${currentPackage.priceTZS.toLocaleString()} & Activate ${currentPackage.titleEn}`}
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
                <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                  {language === 'sw' ? 'Hongera! Kifurushi Chako Kimelipwa Kikamilifu' : 'Subscription & Registration Successful!'}
                </h3>
                <p className="text-xs text-stone-600 mt-1 max-w-md mx-auto">
                  {language === 'sw'
                    ? `Duka lako la "${registeredVendor?.businessName}" limeunganishwa rasmi kwenye Kifurushi cha ${currentPackage.titleSw} na lipo hewani kwa wateja wote wa Dar!`
                    : `Your stall "${registeredVendor?.businessName}" is now active on the ${currentPackage.titleEn} plan!`}
                </p>
              </div>

              {/* Vendor details & payment slip */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-left text-xs space-y-2.5 max-w-md mx-auto">
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">{language === 'sw' ? 'Namba ya Usajili (Vendor ID):' : 'Vendor ID:'}</span>
                  <span className="font-mono font-bold text-stone-900">{registeredVendor?.id}</span>
                </div>

                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">{language === 'sw' ? 'Kifurushi Kilicholipwa:' : 'Active Package:'}</span>
                  <span className="font-bold text-emerald-800">
                    {language === 'sw' ? currentPackage.titleSw : currentPackage.titleEn} (TZS {currentPackage.priceTZS.toLocaleString()} / mwezi)
                  </span>
                </div>

                <div className="flex justify-between border-b border-stone-200 pb-2 text-emerald-800 font-semibold">
                  <span>{language === 'sw' ? 'Ada ya Kifurushi cha Kwanza:' : 'First Month Fee Paid:'}</span>
                  <span className="font-mono font-bold text-emerald-700">
                    TZS {registeredVendor?.subscriptionPriceTZS?.toLocaleString()} (Imelipwa ✓)
                  </span>
                </div>

                {registeredVendor?.paymentRef && (
                  <div className="flex justify-between border-b border-stone-200 pb-2 text-[11px]">
                    <span className="text-stone-500">{language === 'sw' ? 'Kumbukumbu ya Malipo:' : 'Payment Ref:'}</span>
                    <span className="font-mono text-stone-700">{registeredVendor?.paymentRef}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-stone-500">{language === 'sw' ? 'Ukomo wa Bidhaa:' : 'Produce Limit:'}</span>
                  <span className="font-semibold text-stone-900">
                    {currentPackage.maxProducts === 999
                      ? (language === 'sw' ? 'Bila Kikomo' : 'Unlimited')
                      : `Hadi mazao ${currentPackage.maxProducts}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-500">{language === 'sw' ? 'Soko & Fremu:' : 'Market & Stall:'}</span>
                  <span className="font-semibold text-stone-900">{registeredVendor?.marketName} ({registeredVendor?.stallNumber})</span>
                </div>

                <div className="flex justify-between pt-1">
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
                  className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  {language === 'sw' ? 'Funga & Rudi Sokoni' : 'Done & Return to Market'}
                </button>
                <a
                  href={`https://wa.me/255768000111?text=Habari%20Sokoni%20Mkononi,%20nimesajili%20duka%20langu%20kwa%20Kifurushi%20cha%20TZS%20${currentPackage.priceTZS}%20Vendor%20ID:%20${registeredVendor?.id}%20katika%20${registeredVendor?.marketName}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
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
