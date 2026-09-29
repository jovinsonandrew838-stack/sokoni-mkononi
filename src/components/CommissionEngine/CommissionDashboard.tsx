import React, { useState } from 'react';
import {
  Currency,
  Language,
  MarketplaceOrder,
  Vendor,
  VendorRegistrationRecord,
} from '../../types';
import { t } from '../../translations';
import { formatMoney, formatTZS } from '../../utils/formatters';
import { sound } from '../../utils/audio';

interface CommissionDashboardProps {
  orders: MarketplaceOrder[];
  vendors: Vendor[];
  registrationFees: VendorRegistrationRecord[];
  currency: Currency;
  lang: Language;
  onOpenPayoutModal: () => void;
  onOpenAddVendorModal: () => void;
  onDisburseVendor: (orderId: string) => void;
}

export const CommissionDashboard: React.FC<CommissionDashboardProps> = ({
  orders,
  vendors,
  registrationFees,
  currency,
  lang,
  onOpenPayoutModal,
  onOpenAddVendorModal,
  onDisburseVendor,
}) => {
  const tr = t[lang];
  const [activeLedgerTab, setActiveLedgerTab] = useState<'orders' | 'registration_fees'>('orders');
  const [calcDailySalesTZS, setCalcDailySalesTZS] = useState(1000000); // 1 Million TZS per day default
  const [filterMarket, setFilterMarket] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 5% Revenue Calculations
  const totalGrossMarketSalesTZS = orders
    .filter((o) => o.status === 'completed')
    .reduce((acc, o) => acc + o.grossItemsTZS, 0);

  const totalCommissionEarned5PctTZS = orders
    .filter((o) => o.status === 'completed')
    .reduce((acc, o) => acc + o.platformCommission5PctTZS, 0);

  // TZS 2,000 Registration Fees Calculations
  const totalRegistrationFeesEarnedTZS = registrationFees.reduce(
    (acc, r) => acc + r.amountTZS,
    0
  );

  // Combined Total Platform Profit = 5% Commission + TZS 2,000 Onboarding Fees!
  const combinedPlatformRevenueTZS = totalCommissionEarned5PctTZS + totalRegistrationFeesEarnedTZS;

  const totalVendorPendingPayoutsTZS = orders
    .filter((o) => o.status === 'completed' && o.vendorPayoutStatus === 'pending')
    .reduce((acc, o) => acc + o.vendorNet95PctTZS, 0);

  const totalVendorDisbursedTZS = orders
    .filter((o) => o.status === 'completed' && o.vendorPayoutStatus === 'disbursed')
    .reduce((acc, o) => acc + o.vendorNet95PctTZS, 0);

  // Revenue projection math for the 5% calculator
  const dailyCommission = calcDailySalesTZS * 0.05;
  const monthlyCommission = dailyCommission * 30;
  const yearlyCommission = monthlyCommission * 12;

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (filterMarket !== 'all') {
      const match = o.items.some((it) => it.marketName === filterMarket);
      if (!match) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.referenceNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.deliveryLocation.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Page Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>{lang === 'sw' ? 'Mmiliki wa Website ya Masoko' : 'Marketplace Platform Owner'}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-emerald-700">5% Kamisheni + TZS 2,000 Usajili</span>
            <span aria-hidden="true">·</span>
            <span>Dar es Salaam</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {tr.navCommission}
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5 max-w-xl">
            {lang === 'sw'
              ? 'Fuatilia kamisheni yako ya 5% ya kila mauzo ya mboga pamoja na ada ya TZS 2,000 unayowatoza wauza mboga mara tu wanapojiunga.'
              : 'Track your 5% cut on all vegetable sales plus the TZS 2,000 onboarding fee charged to each seller upon registration.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenAddVendorModal();
            }}
            className="px-3.5 py-2 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>+ {tr.addVendor}</span>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono font-bold">
              TZS 2,000
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenPayoutModal();
            }}
            className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            {tr.withdrawCommission}
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Combined Platform Revenue (5% + TZS 2,000 fees) */}
        <div className="bg-white border-2 border-emerald-500/40 rounded-2xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-8 -mt-8 pointer-events-none"></div>
          <div className="flex items-center justify-between text-emerald-900 text-xs font-bold">
            <span>💰 {tr.combinedTotalEarnings}</span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-mono">
              Yako Yote
            </span>
          </div>
          <div className="my-3">
            <span className="font-mono text-3xl font-black text-emerald-700 tabular-nums">
              {formatMoney(combinedPlatformRevenueTZS, currency)}
            </span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px]">
            <span className="text-slate-500">
              5% ({formatMoney(totalCommissionEarned5PctTZS, currency)}) + Ada ({formatMoney(totalRegistrationFeesEarnedTZS, currency)})
            </span>
            <button
              type="button"
              onClick={onOpenPayoutModal}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              {lang === 'sw' ? 'Toa Pesa →' : 'Withdraw →'}
            </button>
          </div>
        </div>

        {/* Card 2: Vendor Onboarding Fees (TZS 2,000 x Vendors) */}
        <div className="bg-white border border-amber-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between bg-gradient-to-br from-white to-amber-50/30">
          <div className="flex items-center justify-between text-amber-900 text-xs font-semibold">
            <span>💳 {tr.totalRegistrationFeesEarned}</span>
            <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
              TZS 2,000 / muuzaji
            </span>
          </div>
          <div className="my-3">
            <span className="font-mono text-2xl font-black text-amber-800 tabular-nums">
              {formatMoney(totalRegistrationFeesEarnedTZS, currency)}
            </span>
          </div>
          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            {registrationFees.length} {lang === 'sw' ? 'wauzaji wamelipa ada ya usajili' : 'vendors registered'}
          </div>
        </div>

        {/* Card 3: Total Gross Produce Sales */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>{tr.grossMarketSales}</span>
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          </div>
          <div className="my-3">
            <span className="font-mono text-2xl font-extrabold text-slate-900 tabular-nums">
              {formatMoney(totalGrossMarketSalesTZS, currency)}
            </span>
          </div>
          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            {lang === 'sw' ? 'Kariakoo, Ilala, Tandale & Buguruni' : 'Gross market volume'}
          </div>
        </div>

        {/* Card 4: Vendor Payouts (95%) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>{tr.vendorDisbursed}</span>
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          </div>
          <div className="my-3">
            <span className="font-mono text-2xl font-extrabold text-slate-900 tabular-nums">
              {formatMoney(totalVendorDisbursedTZS, currency)}
            </span>
          </div>
          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            {formatMoney(totalVendorPendingPayoutsTZS, currency)} {lang === 'sw' ? 'inayosubiri' : 'pending'}
          </div>
        </div>
      </div>

      {/* Interactive 5% Revenue Calculator Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-2 text-xs font-mono uppercase text-emerald-400 font-bold">
          <span>🧮</span>
          <span>{tr.calcTitle}</span>
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-bold">
          {lang === 'sw'
            ? 'Ukadiriaji wa Mapato Yako ya Kamisheni (5% ya Kila Mauzo)'
            : 'Interactive 5% Marketplace Revenue Projection'}
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl">
          {tr.calcDesc}
        </p>

        {/* Slider & Quick Presets */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">
                {lang === 'sw' ? 'Mauzo ya Mboga kwa Siku (Dar):' : 'Estimated Daily Produce Sales in Dar:'}
              </span>
              <span className="font-mono font-bold text-emerald-400 text-base">
                {formatTZS(calcDailySalesTZS)}
              </span>
            </div>

            <input
              type="range"
              min="100000"
              max="10000000"
              step="100000"
              value={calcDailySalesTZS}
              onChange={(e) => setCalcDailySalesTZS(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500 cursor-pointer"
            />

            {/* Quick preset buttons */}
            <div className="flex gap-2">
              {[500000, 1000000, 3000000, 5000000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setCalcDailySalesTZS(preset);
                  }}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-colors cursor-pointer ${
                    calcDailySalesTZS === preset
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {formatTZS(preset).replace('TZS ', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Results Projection Cards */}
          <div className="md:col-span-6 grid grid-cols-3 gap-3">
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                {lang === 'sw' ? 'Kwa Siku (5%)' : 'Per Day (5%)'}
              </span>
              <span className="font-mono text-base sm:text-lg font-bold text-emerald-400 mt-1 block">
                {formatTZS(dailyCommission)}
              </span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                {lang === 'sw' ? 'Kwa Mwezi' : 'Per Month'}
              </span>
              <span className="font-mono text-base sm:text-lg font-bold text-emerald-400 mt-1 block">
                {formatTZS(monthlyCommission)}
              </span>
            </div>

            <div className="bg-emerald-950/70 border border-emerald-500/40 rounded-2xl p-4 text-center">
              <span className="text-[10px] text-emerald-300 uppercase tracking-wider block font-semibold">
                {lang === 'sw' ? 'Kwa Mwaka' : 'Per Year'}
              </span>
              <span className="font-mono text-base sm:text-lg font-black text-emerald-300 mt-1 block">
                {formatTZS(yearlyCommission)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ledger Section with Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Ledger Header & Tab Switcher */}
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveLedgerTab('orders');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                activeLedgerTab === 'orders'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              🥬 {lang === 'sw' ? 'Miamala ya Mauzo & Gawio la 5%' : 'Produce Orders (5% Split)'}
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveLedgerTab('registration_fees');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeLedgerTab === 'registration_fees'
                  ? 'bg-amber-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>💳 {lang === 'sw' ? 'Ada za Kujiunga (TZS 2,000)' : 'Vendor Onboarding Fees (TZS 2,000)'}</span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-mono font-bold">
                {registrationFees.length}
              </span>
            </button>
          </div>

          {activeLedgerTab === 'orders' && (
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tafuta oda, mteja, mtaa wa Dar..."
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-52 sm:w-60"
              />

              {/* Market Filter */}
              <select
                value={filterMarket}
                onChange={(e) => setFilterMarket(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none text-slate-800"
              >
                <option value="all">{lang === 'sw' ? 'Masoko Yote' : 'All Markets'}</option>
                <option value="Kariakoo">Soko la Kariakoo</option>
                <option value="Ilala">Soko la Ilala</option>
                <option value="Tandale">Soko la Tandale</option>
                <option value="Buguruni">Soko la Buguruni</option>
              </select>
            </div>
          )}
        </div>

        {/* Tab 1: Orders Table (5% Commission) */}
        {activeLedgerTab === 'orders' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">{tr.orderNumber}</th>
                  <th className="py-3 px-4">{tr.customer}</th>
                  <th className="py-3 px-4">{tr.grossAmount}</th>
                  <th className="py-3 px-4 text-emerald-800 bg-emerald-50/50">
                    {tr.yourCommission5Pct}
                  </th>
                  <th className="py-3 px-4 text-blue-800">{tr.vendorPayout95Pct}</th>
                  <th className="py-3 px-4">{tr.paymentStatus}</th>
                  <th className="py-3 px-4 text-right">{tr.vendorPayoutAction}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      Hakuna oda iliyopatikana.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => {
                    const vendorNames = Array.from(new Set(ord.items.map((i) => i.vendorName))).join(', ');
                    const marketNames = Array.from(new Set(ord.items.map((i) => i.marketName))).join(', ');

                    return (
                      <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                          {ord.referenceNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-900">{ord.customerName}</p>
                          <p className="text-[11px] text-slate-500">
                            📍 {ord.deliveryLocation} · {ord.customerPhone}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 tabular-nums">
                          {formatMoney(ord.grossItemsTZS, currency)}
                        </td>
                        {/* Exact 5% Platform Commission Highlight */}
                        <td className="py-3.5 px-4 font-mono font-black text-emerald-700 bg-emerald-50/50 tabular-nums">
                          +{formatMoney(ord.platformCommission5PctTZS, currency)}
                        </td>
                        {/* Exact 95% Vendor Payout */}
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-900 tabular-nums">
                          {formatMoney(ord.vendorNet95PctTZS, currency)}
                          <span className="block text-[10px] text-slate-400 font-sans font-normal truncate max-w-[140px]">
                            {vendorNames} ({marketNames})
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            {ord.channel.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {ord.vendorPayoutStatus === 'disbursed' ? (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                              {tr.disbursed}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                sound.playClick();
                                onDisburseVendor(ord.id);
                              }}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
                            >
                              {tr.disburseNow}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Vendor Registration Fees Table (TZS 2,000 Onboarding Records) */}
        {activeLedgerTab === 'registration_fees' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-amber-50/60 border-b border-amber-200 text-amber-900 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Ref ya Usajili</th>
                  <th className="py-3 px-4">Muuzaji Aliyejiunga</th>
                  <th className="py-3 px-4">Soko la Dar</th>
                  <th className="py-3 px-4">Namba ya Simu</th>
                  <th className="py-3 px-4">Mtandao</th>
                  <th className="py-3 px-4">Tarehe ya Kujiunga</th>
                  <th className="py-3 px-4 text-right">Ada Iliyolipwa (Kwako)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registrationFees.map((rec) => (
                  <tr key={rec.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      {rec.referenceNumber}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {rec.vendorName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      Soko la {rec.marketName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {rec.phone}
                    </td>
                    <td className="py-3.5 px-4 uppercase font-semibold text-amber-800">
                      {rec.channel}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {rec.date}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-700 tabular-nums">
                      +{formatMoney(rec.amountTZS, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
