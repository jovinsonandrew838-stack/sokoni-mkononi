import React from 'react';
import { Language, Currency } from '../types';
import { t } from '../translations';
import { sound } from '../utils/audio';

interface NavbarProps {
  currentTab: 'marketplace' | 'commission' | 'vendors';
  setCurrentTab: (tab: 'marketplace' | 'commission' | 'vendors') => void;
  lang: Language;
  setLang: (lang: Language) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  onOpenEmbedModal: () => void;
  onOpenPayoutModal: () => void;
  onSimulateOrder: () => void;
  totalCommission5PctTZS: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  currency,
  setCurrency,
  onOpenEmbedModal,
  onOpenPayoutModal,
  onSimulateOrder,
  totalCommission5PctTZS,
}) => {
  const tr = t[lang];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark in display font */}
        <button
          onClick={() => {
            sound.playClick();
            setCurrentTab('marketplace');
          }}
          className="text-left group cursor-pointer focus-visible:outline-none flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
            🥬
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
            {tr.brandName}
          </span>
        </button>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => {
              sound.playClick();
              setCurrentTab('marketplace');
            }}
            className={`transition-colors cursor-pointer py-1 border-b-2 ${
              currentTab === 'marketplace'
                ? 'text-emerald-700 border-emerald-600 font-semibold'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            {tr.navMarketplace}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setCurrentTab('commission');
            }}
            className={`transition-colors cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${
              currentTab === 'commission'
                ? 'text-emerald-700 border-emerald-600 font-semibold'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <span>{tr.navCommission}</span>
            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
              5%
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setCurrentTab('vendors');
            }}
            className={`transition-colors cursor-pointer py-1 border-b-2 ${
              currentTab === 'vendors'
                ? 'text-emerald-700 border-emerald-600 font-semibold'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            {tr.navVendors}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenEmbedModal();
            }}
            className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer py-1"
          >
            {tr.navEmbed}
          </button>

          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 ml-1">
            <button
              onClick={() => {
                sound.playClick();
                setCurrency('TZS');
              }}
              className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-colors ${
                currency === 'TZS'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              TZS
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setCurrency('USD');
              }}
              className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-colors ${
                currency === 'USD'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              USD
            </button>
          </div>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          {/* Language Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setLang(lang === 'sw' ? 'en' : 'sw');
            }}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
            title="Badili Lugha / Switch Language"
          >
            {lang === 'sw' ? '🇺🇸 EN' : '🇹🇿 SW'}
          </button>

          {/* Quick Simulate Order button */}
          <button
            type="button"
            onClick={onSimulateOrder}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
            title="Jaribu ununuzi wa mboga na gawio la 5%"
          >
            <span>{tr.simulateOrder}</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenPayoutModal();
            }}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs"
          >
            {tr.withdrawCommission}
          </button>
        </div>
      </div>
    </header>
  );
};
