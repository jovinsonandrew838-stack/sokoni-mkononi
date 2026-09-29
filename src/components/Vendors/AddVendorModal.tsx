import React, { useState } from 'react';
import { DarMarket, Language, Vendor } from '../../types';
import { t } from '../../translations';
import { sound } from '../../utils/audio';

interface AddVendorModalProps {
  onAddVendor: (v: Vendor) => void;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();

    const newVendor: Vendor = {
      id: `ven-${Date.now()}`,
      name: name.trim(),
      marketName,
      stallNumber: stallNumber.trim() || 'Banda No. 01',
      phone: phone.startsWith('+255') ? phone.trim() : `+255 ${phone.trim()}`,
      mno,
      specialty: specialty.trim() || 'Mboga za Majani na Viungo',
      rating: 5.0,
      totalSalesCount: 0,
      totalSoldTZS: 0,
      totalNetEarned95TZS: 0,
      pendingPayoutTZS: 0,
    };

    onAddVendor(newVendor);
    sound.playSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-7 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
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
                {lang === 'sw' ? 'Namba ya Simu (M-Pesa)' : 'Phone Number'} *
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
                {lang === 'sw' ? 'Mtandao wa Kupokelea 95%' : 'Payout Wallet'} *
              </label>
              <select
                value={mno}
                onChange={(e) => setMno(e.target.value as 'mpesa' | 'tigopesa' | 'airtel' | 'halopesa')}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
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
              {lang === 'sw' ? 'Aina ya Mboga / Viungo Anavyouza' : 'Produce Specialty'}
            </label>
            <input
              type="text"
              placeholder="Mfano: Nyanya za Mshumaa, Mchicha & Vitunguu"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs sm:text-sm cursor-pointer shadow-sm transition-all"
            >
              {lang === 'sw' ? 'Sajili Muuzaji Huyu' : 'Save & Onboard Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
