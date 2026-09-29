import React, { useState } from 'react';
import { DarMarket, Language, Vendor, VendorRegistrationRecord } from '../../types';
import { t } from '../../translations';
import { sound } from '../../utils/audio';
import { generateRef } from '../../utils/formatters';

interface AddVendorModalProps {
  onAddVendor: (v: Vendor, regRecord: VendorRegistrationRecord) => void;
  onClose: () => void;
  lang: Language;
}

export const AddVendorModal: React.FC<AddVendorModalProps> = ({
  onAddVendor,
  onClose,
  lang,
}) => {
  const tr = t[lang];
  const [name, setName] = useState('');
  const [marketName, setMarketName] = useState<DarMarket>('Kariakoo');
  const [stallNumber, setStallNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [mno, setMno] = useState<'mpesa' | 'tigopesa' | 'airtel' | 'halopesa'>('mpesa');
  const [specialty, setSpecialty] = useState('');
  
  // Payment states for the TZS 2,000 registration fee
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<VendorRegistrationRecord | null>(null);

  const registrationFeeAmountTZS = 2000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    sound.playUssdBeep();

    const formattedPhone = phone.startsWith('+255') ? phone.trim() : `+255 ${phone.trim()}`;
    const regRef = generateRef('REG-TZS-2000');
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    setTimeout(() => {
      sound.playSuccess();
      const newVendor: Vendor = {
        id: `ven-${Date.now()}`,
        name: name.trim(),
        marketName,
        stallNumber: stallNumber.trim() || 'Banda No. 01',
        phone: formattedPhone,
        mno,
        specialty: specialty.trim() || 'Mboga za Majani na Viungo',
        rating: 5.0,
        totalSalesCount: 0,
        totalSoldTZS: 0,
        totalNetEarned95TZS: 0,
        pendingPayoutTZS: 0,
        registrationFeePaid: true,
        registrationFeeTZS: registrationFeeAmountTZS,
        registrationDate: nowStr,
        registrationRef: regRef,
      };

      const regRecord: VendorRegistrationRecord = {
        id: `reg-${Date.now()}`,
        vendorId: newVendor.id,
        vendorName: newVendor.name,
        marketName: newVendor.marketName,
        phone: newVendor.phone,
        amountTZS: registrationFeeAmountTZS,
        channel: mno,
        referenceNumber: regRef,
        date: nowStr,
        timestamp: Date.now(),
        status: 'completed',
      };

      onAddVendor(newVendor, regRecord);
      setPaymentSuccess(regRecord);
      setIsProcessingPayment(false);
    }, 1300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-7 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {!paymentSuccess ? (
          <>
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  {tr.addVendorModalTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {tr.addVendorModalDesc}
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

            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  {lang === 'sw' ? 'Jina Kamili la Muuzaji' : 'Vendor Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Mfano: Mama Furaha John"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    {lang === 'sw' ? 'Soko Analilofanya Kazi' : 'Market Location'} *
                  </label>
                  <select
                    value={marketName}
                    onChange={(e) => setMarketName(e.target.value as DarMarket)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Kariakoo">Soko la Kariakoo</option>
                    <option value="Ilala">Soko la Ilala</option>
                    <option value="Tandale">Soko la Tandale</option>
                    <option value="Buguruni">Soko la Buguruni</option>
                    <option value="Mabibo">Soko la Mabibo</option>
                    <option value="Kawe">Soko la Kawe</option>
                    <option value="Tegeta">Soko la Tegeta</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    {lang === 'sw' ? 'Namba ya Banda / Kizimba' : 'Stall / Shed No.'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Banda No. 23B"
                    value={stallNumber}
                    onChange={(e) => setStallNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    {lang === 'sw' ? 'Namba ya Simu ya Muuzaji' : 'Phone Number'} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0754 123 456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    {lang === 'sw' ? 'Mtandao wa Kulipia Ada' : 'Mobile Network'} *
                  </label>
                  <select
                    value={mno}
                    onChange={(e) => setMno(e.target.value as 'mpesa' | 'tigopesa' | 'airtel' | 'halopesa')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-semibold"
                  >
                    <option value="mpesa">Vodacom M-Pesa</option>
                    <option value="tigopesa">Tigo Pesa</option>
                    <option value="airtel">Airtel Money</option>
                    <option value="halopesa">Halopesa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  {lang === 'sw' ? 'Aina ya Mboga Anazouza' : 'Produce Specialty'}
                </label>
                <input
                  type="text"
                  placeholder="Mfano: Nyanya za Mshumaa, Mchicha & Vitunguu"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* TZS 2,000 REGISTRATION FEE HIGHLIGHT BOX */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between font-bold text-amber-950">
                  <span className="flex items-center gap-1.5">
                    <span>💳</span>
                    <span>{tr.vendorRegistrationFee}</span>
                  </span>
                  <span className="font-mono text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded text-xs font-black">
                    TZS 2,000
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  {tr.registrationFeeDesc}
                </p>
                <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-900">
                  <span>{lang === 'sw' ? 'Inakatwa kupitia:' : 'Charged via:'}</span>
                  <span className="font-semibold uppercase">{mno} ({phone || 'Namba ya Simu'})</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm cursor-pointer shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>{lang === 'sw' ? 'Inatuma ombi la USSD (TZS 2,000)...' : 'Prompting USSD (TZS 2,000)...'}</span>
                    </>
                  ) : (
                    <span>
                      {lang === 'sw'
                        ? 'Toza TZS 2,000 & Kamilisha Usajili'
                        : 'Charge TZS 2,000 & Complete Registration'}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Receipt of Successful Registration & TZS 2,000 Fee Payment */
          <div className="text-slate-900 space-y-4">
            <div className="text-center pb-4 border-b border-dashed border-slate-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600 font-bold mb-2">
                ✓
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                {lang === 'sw' ? 'Ada ya Usajili Imelipwa Kikamilifu!' : 'Registration Fee Paid Successfully!'}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Ref: {paymentSuccess.referenceNumber}
              </p>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-4 text-xs space-y-2 border border-emerald-100">
              <div className="flex justify-between font-bold text-emerald-950">
                <span>{lang === 'sw' ? 'Ada ya Kujiunga Iliyolipwa:' : 'Registration Fee Collected:'}</span>
                <span className="font-mono text-emerald-700 text-sm">
                  +TZS 2,000
                </span>
              </div>
              <p className="text-[11px] text-emerald-700">
                {lang === 'sw'
                  ? 'Kiasi cha TZS 2,000 kimeongezwa mara moja kwenye mapato yako ya website kama mmiliki wa mtandao.'
                  : 'TZS 2,000 has been credited directly to your platform revenue balance.'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>{lang === 'sw' ? 'Muuzaji Mpya:' : 'New Vendor:'}</span>
                <span className="font-bold text-slate-900">{paymentSuccess.vendorName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{lang === 'sw' ? 'Soko & Njia:' : 'Market & Channel:'}</span>
                <span className="font-semibold text-slate-900">
                  Soko la {paymentSuccess.marketName} ({paymentSuccess.channel.toUpperCase()})
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl cursor-pointer"
            >
              {lang === 'sw' ? 'Funga & Tazama Dashibodi' : 'Done & View Dashboard'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
