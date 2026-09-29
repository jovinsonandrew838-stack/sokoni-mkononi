import React from 'react';
import { Currency, Language, Vendor } from '../../types';
import { t } from '../../translations';
import { formatMoney } from '../../utils/formatters';
import { sound } from '../../utils/audio';

interface VendorDirectoryViewProps {
  vendors: Vendor[];
  currency: Currency;
  lang: Language;
  onOpenAddVendorModal: () => void;
}

export const VendorDirectoryView: React.FC<VendorDirectoryViewProps> = ({
  vendors,
  currency,
  lang,
  onOpenAddVendorModal,
}) => {
  const tr = t[lang];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Masoko ya Dar es Salaam</span>
            <span aria-hidden="true">·</span>
            <span>{vendors.length} {lang === 'sw' ? 'Wauza Mboga Waliosajiliwa' : 'Registered Vendors'}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'sw' ? 'Wauza Mboga Mboga wa Masoko ya Dar' : 'Dar es Salaam Market Vendors'}
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5 max-w-xl">
            {lang === 'sw'
              ? 'Orodha ya wachuuzi wa masoko ya Kariakoo, Ilala, Tandale, na Buguruni wanaouza mboga kupitia website yako na kupokea 95% ya mauzo.'
              : 'Directory of market stall vendors selling fresh produce via your site and receiving 95% net payouts.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenAddVendorModal();
          }}
          className="px-4 py-2.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5 self-start md:self-auto"
        >
          <span>+ {tr.addVendor}</span>
        </button>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {vendors.map((v) => (
          <div
            key={v.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Badge for Market */}
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  📍 Soko la {v.marketName}
                </span>
                <span className="text-amber-600 font-bold">★ {v.rating}</span>
              </div>

              <h3 className="font-bold text-slate-900 text-base">{v.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{v.stallNumber}</p>
              <p className="text-xs text-slate-600 font-medium mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                🥬 {v.specialty}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>{lang === 'sw' ? 'Namba ya Simu' : 'Phone'}:</span>
                <span className="font-mono text-slate-900">{v.phone}</span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>{lang === 'sw' ? 'Idadi ya Mauzo' : 'Sales Count'}:</span>
                <span className="font-mono font-bold text-slate-900">{v.totalSalesCount}</span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>{lang === 'sw' ? 'Mapato Yake (95%)' : 'Net 95% Earned'}:</span>
                <span className="font-mono font-bold text-blue-900">
                  {formatMoney(v.totalNetEarned95TZS, currency)}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{lang === 'sw' ? 'M-Pesa / Tigo' : 'Mobile Wallet'}</span>
                <span className="font-semibold uppercase text-emerald-700">{v.mno}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
