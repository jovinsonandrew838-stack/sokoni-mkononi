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
  onOpenGitHubModal: () => void;
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
  onOpenGitHubModal,
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
        <div className="flex items-center gap-2">
          {/* GitHub Repo Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenGitHubModal();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Unganisha na GitHub (sokoni-mkononi)"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="hidden lg:inline">GitHub</span>
          </button>

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
