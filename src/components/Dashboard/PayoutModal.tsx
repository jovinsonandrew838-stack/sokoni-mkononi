import React, { useState } from 'react';
import { Language, PayoutRecord } from '../../types';
import { t } from '../../translations';
import { formatTZS, generateRef } from '../../utils/formatters';
import { sound } from '../../utils/audio';

interface PayoutModalProps {
  availableBalanceTZS: number;
  onConfirmPayout: (payout: PayoutRecord) => void;
  onClose: () => void;
  lang: Language;
}

export const PayoutModal: React.FC<PayoutModalProps> = ({
  availableBalanceTZS,
  onConfirmPayout,
  onClose,
  lang,
}) => {
  const tr = t[lang];
  const [provider, setProvider] = useState<'mpesa' | 'tigopesa' | 'crdb' | 'nmb'>('crdb');
  const [amountStr, setAmountStr] = useState('50000');
  const [accountNumber, setAccountNumber] = useState('01504829910200');
  const [accountName, setAccountName] = useState('Jovinson Andrew');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const withdrawAmount = parseInt(amountStr.replace(/\D/g, '') || '0', 10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) {
      setError(lang === 'sw' ? 'Weka kiasi halali cha kutoa.' : 'Please enter a valid payout amount.');
      return;
    }
    if (withdrawAmount > availableBalanceTZS && availableBalanceTZS > 0) {
      setError(
        lang === 'sw'
          ? `Kiasi ulichoweka kinazidi salio la kamisheni (${formatTZS(availableBalanceTZS)}).`
          : `Amount exceeds your commission balance (${formatTZS(availableBalanceTZS)}).`
      );
      return;
    }

    setIsProcessing(true);
    sound.playClick();

    setTimeout(() => {
      sound.playSuccess();
      const newPayout: PayoutRecord = {
        id: `po-${Date.now()}`,
        payoutRef: generateRef('PO-OWNER'),
        recipientType: 'platform_owner',
        destinationName: `${accountName} (${provider.toUpperCase()})`,
        accountNumber,
        provider,
        amountTZS: withdrawAmount,
        feeTZS: 0,
        status: 'completed',
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        timestamp: Date.now(),
        note: lang === 'sw' ? 'Kamisheni ya 5% ya Website' : '5% Platform Commission Payout',
      };
      onConfirmPayout(newPayout);
      setIsProcessing(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 sm:p-7 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-start pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              {tr.withdrawModalTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {tr.withdrawModalDesc}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Current balance indicator */}
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 flex justify-between items-center">
            <span className="text-xs text-emerald-800 font-medium">
              {lang === 'sw' ? 'Salio la Kamisheni ya 5%:' : 'Available 5% Commission:'}
            </span>
            <span className="font-mono text-base font-bold text-emerald-900">
              {formatTZS(availableBalanceTZS)}
            </span>
          </div>

          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              {lang === 'sw' ? 'Chagua Njia ya Kupokelea:' : 'Destination:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setProvider('crdb');
                  setAccountNumber('01504829910200');
                }}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold cursor-pointer ${
                  provider === 'crdb' ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900' : 'border-slate-200'
                }`}
              >
                CRDB Bank
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setProvider('nmb');
                  setAccountNumber('20810034918');
                }}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold cursor-pointer ${
                  provider === 'nmb' ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900' : 'border-slate-200'
                }`}
              >
                NMB Bank
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setProvider('mpesa');
                  setAccountNumber('+255 754 000 123');
                }}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold cursor-pointer ${
                  provider === 'mpesa' ? 'border-red-600 bg-red-50/50 text-red-900' : 'border-slate-200'
                }`}
              >
                Vodacom M-Pesa
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setProvider('tigopesa');
                  setAccountNumber('+255 713 000 456');
                }}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold cursor-pointer ${
                  provider === 'tigopesa' ? 'border-blue-600 bg-blue-50/50 text-blue-900' : 'border-slate-200'
                }`}
              >
                Tigo Pesa
              </button>
            </div>
          </div>

          {/* Account Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {lang === 'sw' ? 'Jina la Akaunti / Simu' : 'Account Name'}
              </label>
              <input
                type="text"
                required
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {lang === 'sw' ? 'Namba ya Akaunti / Simu' : 'Account/Phone'}
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Amount to Withdraw */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                {lang === 'sw' ? 'Kiasi cha Kutoa (TZS):' : 'Withdraw Amount (TZS):'}
              </label>
              {availableBalanceTZS > 0 && (
                <button
                  type="button"
                  onClick={() => setAmountStr(availableBalanceTZS.toString())}
                  className="text-[11px] text-emerald-700 font-semibold hover:underline"
                >
                  {lang === 'sw' ? 'Toa Yote' : 'Max All'}
                </button>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-slate-400">TZS</span>
              <input
                type="text"
                required
                value={amountStr}
                onChange={(e) => {
                  setError(null);
                  setAmountStr(e.target.value);
                }}
                className="w-full pl-12 pr-3.5 py-2.5 text-base font-mono font-bold rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>{lang === 'sw' ? 'Inatuma pesa...' : 'Processing payout...'}</span>
                </>
              ) : (
                <span>{lang === 'sw' ? 'Thibitisha Kutoa Kamisheni' : 'Confirm Commission Payout'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
