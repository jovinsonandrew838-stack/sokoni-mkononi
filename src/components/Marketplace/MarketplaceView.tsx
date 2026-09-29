import React, { useState } from 'react';
import {
  Currency,
  DarMarket,
  Language,
  ProduceItem,
  Vendor,
} from '../../types';
import { t } from '../../translations';
import { formatMoney } from '../../utils/formatters';
import { sound } from '../../utils/audio';

interface MarketplaceViewProps {
  produceList: ProduceItem[];
  cart: ProduceItem[];
  setCart: React.Dispatch<React.SetStateAction<ProduceItem[]>>;
  vendors: Vendor[];
  currency: Currency;
  lang: Language;
  onOpenCheckout: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  produceList,
  cart,
  setCart,
  vendors,
  currency,
  lang,
  onOpenCheckout,
}) => {
  const tr = t[lang];
  const [selectedMarket, setSelectedMarket] = useState<DarMarket | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState('Sinza Kijiweni');

  const markets: (DarMarket | 'all')[] = ['all', 'Kariakoo', 'Ilala', 'Tandale', 'Buguruni'];

  const filteredProduce = produceList.filter((item) => {
    if (selectedMarket !== 'all' && item.marketName !== selectedMarket) {
      return false;
    }
    return true;
  });

  const addToCart = (item: ProduceItem) => {
    sound.playClick();
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateCartQty = (id: string, delta: number) => {
    sound.playClick();
    setCart((prev) =>
      prev
        .map((p) => {
          if (p.id === id) {
            const nextQty = p.quantity + delta;
            return nextQty > 0 ? { ...p, quantity: nextQty } : null;
          }
          return p;
        })
        .filter(Boolean) as ProduceItem[]
    );
  };

  // Calculations for 5% Split
  const grossProduceTZS = cart.reduce((acc, it) => acc + it.priceTZS * it.quantity, 0);
  const platformCommission5PctTZS = Math.round(grossProduceTZS * 0.05); // 5% COMMISSION FOR THE USER!
  const vendorNet95PctTZS = grossProduceTZS - platformCommission5PctTZS; // 95% FOR THE SELLER!
  const deliveryFeeTZS = cart.length > 0 ? 3000 : 0; // Flat Boda rate in Dar
  const totalPayableTZS = grossProduceTZS + deliveryFeeTZS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Editorial Hero Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <span>Dar es Salaam Fresh Markets</span>
          <span aria-hidden="true">·</span>
          <span>{lang === 'sw' ? 'Wauza Mboga Halisi' : 'Authentic Market Sellers'}</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-emerald-700">5% Platform Split</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'sw'
                ? 'Soko la Mboga Mboga za Masoko ya Dar es Salaam'
                : 'Dar es Salaam Fresh Vegetable Marketplace'}
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl">
              {lang === 'sw'
                ? 'Nunua mboga safi za leo moja kwa moja kutoka kwa wachuuzi wa masoko ya Kariakoo, Ilala, na Tandale. Kila mauzo yanayofanyika, website inakata 5% kama kamisheni na 95% inakwenda kwa muuzaji.'
                : 'Connect customers to vegetable sellers across Dar markets. 5% platform commission is automatically routed to you on every sale, with 95% paid to the vendor.'}
            </p>
          </div>

          {/* Market Filter Chips */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
            {markets.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedMarket(m);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedMarket === m
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m === 'all' ? (lang === 'sw' ? 'Masoko Yote ya Dar' : 'All Dar Markets') : `Soko la ${m}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Produce Catalog (8 cols) + Split Basket (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Produce Cards Grid (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredProduce.map((item) => {
              const inCart = cart.find((c) => c.id === item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Image */}
                  <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                      📍 Soko la {item.marketName}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Vendor attribution */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-medium text-emerald-800">
                          {tr.vendorLabel}: {item.vendorName}
                        </span>
                        <span className="font-mono text-[11px]">{item.unit}</span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                        {lang === 'sw' ? item.nameSw : item.name}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1">
                        {item.category} · {lang === 'sw' ? 'Mboga Fresh' : 'Fresh Harvest'}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                          {lang === 'sw' ? 'Bei ya Soko' : 'Market Price'}
                        </span>
                        <span className="font-mono font-bold text-base text-slate-900 tabular-nums">
                          {formatMoney(item.priceTZS, currency)}
                        </span>
                      </div>

                      {inCart ? (
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-2 py-1">
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.id, -1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-emerald-800 font-bold hover:bg-emerald-200 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-mono text-xs font-bold text-emerald-900">
                            {inCart.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.id, 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-emerald-800 font-bold hover:bg-emerald-200 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addToCart(item)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <span>+ {tr.addToBasket}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sticky Basket & 5% Split Live Visualizer (4 cols) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs sticky top-20 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-base">🧺</span>
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                  {tr.cartTitle}
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {cart.reduce((a, b) => a + b.quantity, 0)} {lang === 'sw' ? 'vitu' : 'items'}
              </span>
            </div>

            {/* Delivery destination picker in Dar */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                📍 {lang === 'sw' ? 'Eneo la Kuletewa Dar es Salaam' : 'Delivery Destination in Dar'}
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Sinza Kijiweni">Sinza Kijiweni (Boda TZS 3,000)</option>
                <option value="Mikocheni B">Mikocheni B / Rose Garden (Boda TZS 3,000)</option>
                <option value="Kinondoni Manyanya">Kinondoni Manyanya (Boda TZS 2,500)</option>
                <option value="Masaki / Oysterbay">Masaki / Oysterbay (Boda TZS 4,000)</option>
                <option value="Kijitonyama / Sayansi">Kijitonyama Sayansi (Boda TZS 2,500)</option>
                <option value="Mbezi Beach">Mbezi Beach (Boda TZS 4,500)</option>
                <option value="Ilala Boma">Ilala Boma (Boda TZS 2,500)</option>
                <option value="Kariakoo Msimbazi">Kariakoo Msimbazi (Boda TZS 2,000)</option>
              </select>
            </div>

            {/* Basket Items List */}
            <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  <p>Kapu lako halina mboga bado.</p>
                  <p className="mt-1">Bofya "+ Weka Kwenye Kapu" kuchagua mboga kutoka masokoni.</p>
                </div>
              ) : (
                cart.map((it) => (
                  <div key={it.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-slate-900 truncate">
                        {lang === 'sw' ? it.nameSw : it.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {it.vendorName} (Soko la {it.marketName})
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono font-bold text-slate-900">
                        {formatMoney(it.priceTZS * it.quantity, currency)}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {it.quantity} x {formatMoney(it.priceTZS, currency)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* LIVE 5% COMMISSION SPLIT BOX (Highlights the user's business requirement) */}
            {cart.length > 0 && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs space-y-2.5">
                <div className="flex items-center justify-between font-bold text-emerald-950 pb-1.5 border-b border-emerald-200/60">
                  <span className="flex items-center gap-1">
                    <span>⚡</span> {lang === 'sw' ? 'Mgawanyo wa Malipo (Gawio la 5%)' : 'Split Payment Breakdown (5%)'}
                  </span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-mono">
                    Moja kwa moja
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-700">
                  <span>{lang === 'sw' ? 'Jumla ya Mboga za Soko' : 'Produce Gross Subtotal'}</span>
                  <span className="font-mono font-semibold">{formatMoney(grossProduceTZS, currency)}</span>
                </div>

                {/* THE 5% PLATFORM CUT */}
                <div className="flex justify-between items-center text-emerald-900 font-bold bg-white p-2 rounded-xl border border-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>{tr.platformShare}</span>
                  </span>
                  <span className="font-mono tabular-nums text-emerald-700">
                    +{formatMoney(platformCommission5PctTZS, currency)}
                  </span>
                </div>

                {/* THE 95% VENDOR CUT */}
                <div className="flex justify-between items-center text-blue-900 font-medium bg-blue-50/60 p-2 rounded-xl border border-blue-200">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span>{tr.vendorShare}</span>
                  </span>
                  <span className="font-mono tabular-nums text-blue-800">
                    {formatMoney(vendorNet95PctTZS, currency)}
                  </span>
                </div>

                {/* Delivery */}
                <div className="flex justify-between items-center text-slate-600">
                  <span>🛵 {tr.riderDelivery}</span>
                  <span className="font-mono">{formatMoney(deliveryFeeTZS, currency)}</span>
                </div>
              </div>
            )}

            {/* Total to pay by Customer */}
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {tr.totalToPay}
              </span>
              <span className="font-mono text-xl font-black text-slate-900 tabular-nums">
                {formatMoney(totalPayableTZS, currency)}
              </span>
            </div>

            {/* Checkout Action Button */}
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() => {
                sound.playClick();
                onOpenCheckout();
              }}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{tr.checkoutBtn}</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <p className="text-[11px] text-slate-400 text-center">
              ✓ {lang === 'sw' ? 'Inasaidiwa na M-Pesa, Tigo Pesa, Airtel & Kadi' : 'Supports M-Pesa, Tigo Pesa, Airtel & Bank'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
