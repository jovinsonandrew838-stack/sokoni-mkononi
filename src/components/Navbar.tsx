import React from 'react';
import { ShoppingBag, Search, MapPin, PhoneCall, Globe, X, Store, Sparkles, Download, Layers, LayoutDashboard, Database } from 'lucide-react';
import { Language } from '../types';
import { DELIVERY_ZONES, DeliveryZone } from '../data/products';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  selectedZone: DeliveryZone;
  onSelectZone: (zone: DeliveryZone) => void;
  onOpenVendorModal: () => void;
  onOpenPackagesModal?: () => void;
  onOpenAdminDashboard: () => void;
  vendorsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  searchQuery,
  onSearchChange,
  cartCount,
  cartTotal,
  onOpenCart,
  selectedZone,
  onSelectZone,
  onOpenVendorModal,
  onOpenPackagesModal,
  onOpenAdminDashboard,
  vendorsCount,
}) => {
  const [isZoneDropdownOpen, setIsZoneDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
      {/* 1. Top Announcement Bar */}
      <div className="bg-emerald-900 text-emerald-50 text-xs px-4 py-1.5 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="truncate">
              {language === 'sw'
                ? 'Soko La Asubuhi Limefunguliwa: Mazao fresh kutoka shambani ndani ya masaa 2!'
                : 'Morning Fresh Market: Direct produce delivered in under 2 hours!'}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-xs">
            {/* Direct Source Code Download Link */}
            <a
              href="/sokoni-mkononi-source-code.zip"
              download="sokoni-mkononi-source-code.zip"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-[11px] transition-colors shadow-xs"
              title="Pakua faili la ZIP la source code ya mfumo wako"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Pakua Code (ZIP)</span>
            </a>

            <div className="flex items-center gap-1 text-emerald-200">
              <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
              <a href="tel:0704205872" className="hover:underline font-bold text-white">
                0704 205 872
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Logo */}
          <div className="shrink-0">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-xs group-hover:bg-emerald-800 transition-colors">
                <span className="tracking-tight">S</span>
                <span className="text-amber-300 text-xs sm:text-sm -ml-0.5 font-black">M</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black text-stone-900 tracking-tight leading-tight flex items-center gap-1">
                  Sokoni Mkononi
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                </span>
                <span className="text-[10px] text-stone-500 font-medium hidden sm:block">
                  {language === 'sw' ? 'Soko Lako La Vyakula' : 'Your Digital Fresh Market'}
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Search Bar */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={
                  language === 'sw'
                    ? 'Tafuta nyanya, mchele, samaki, nyama, asali...'
                    : 'Search fresh tomatoes, rice, fish, beef, honey...'
                }
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-stone-100 hover:bg-stone-50 border border-stone-300 rounded-xl text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
                  aria-label="Futa utafutaji"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Actions Column: Location, Language, and KIKAPU CHAKO */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Delivery Location dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsZoneDropdownOpen(!isZoneDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors"
                title="Badilisha eneo la kupelekewa"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="max-w-[85px] sm:max-w-[120px] truncate text-[11px] sm:text-xs">
                  {selectedZone.name.split('(')[0].trim()}
                </span>
              </button>

              {isZoneDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50">
                  <div className="px-3 py-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                    {language === 'sw' ? 'Chagua Eneo Lako' : 'Select Delivery Area'}
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-stone-100">
                    {DELIVERY_ZONES.map((zone) => (
                      <button
                        key={zone.id}
                        type="button"
                        onClick={() => {
                          onSelectZone(zone);
                          setIsZoneDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-emerald-50 transition-colors ${
                          selectedZone.id === zone.id ? 'bg-emerald-50/70 font-semibold' : ''
                        }`}
                      >
                        <div className="flex justify-between items-center text-stone-900">
                          <span>{zone.name}</span>
                          <span className="text-emerald-700 font-bold shrink-0 ml-2">
                            TSh {zone.fee.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-500 mt-0.5">
                          {zone.region} · {zone.estimatedHours}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Database & Admin Dashboard Button */}
            <button
              type="button"
              onClick={onOpenAdminDashboard}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs border border-indigo-700 shadow-xs transition-colors shrink-0 cursor-pointer"
              title={language === 'sw' ? 'Fungua Database na Dashibodi' : 'Open Database & Admin'}
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'sw' ? 'Database' : 'Database'}</span>
            </button>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => onLanguageChange(language === 'sw' ? 'en' : 'sw')}
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-100 rounded-xl transition-colors border border-stone-200 shrink-0"
              title="Badilisha Lugha / Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-stone-500" />
              <span>{language === 'sw' ? 'SW' : 'EN'}</span>
            </button>

            {/* KIKAPU CHAKO - Prominent Primary Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="flex items-center gap-2 sm:gap-2.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold transition-all shadow-md active:scale-95 shrink-0 border border-emerald-600 cursor-pointer"
              title={language === 'sw' ? 'Fungua Kikapu Chako' : 'Open Basket'}
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-stone-950 text-[10px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>

              <div className="flex flex-col text-left">
                <span className="text-[10px] text-emerald-200 font-bold uppercase tracking-tight leading-none">
                  {language === 'sw' ? 'Kikapu Chako' : 'Your Basket'}
                </span>
                <span className="font-extrabold text-xs sm:text-sm text-white leading-tight">
                  TSh {cartTotal.toLocaleString()}
                </span>
              </div>
            </button>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                language === 'sw'
                  ? 'Tafuta mboga, nyanya, mchele, samaki, nyama...'
                  : 'Search vegetables, rice, fish, meat...'
              }
              className="w-full pl-9 pr-8 py-2 text-xs bg-stone-100 border border-stone-300 rounded-xl text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Sub-Navbar Navigation Strip (Secondary Quick Links) */}
      <div className="bg-stone-50 border-t border-stone-200 px-4 py-1.5 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <a
              href="#vikapu-vya-wiki"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100/70 hover:bg-emerald-100 text-emerald-900 font-bold transition-colors"
            >
              <span>🧺</span>
              <span>{language === 'sw' ? 'Vikapu Maalum vya Wiki' : 'Weekly Baskets'}</span>
            </a>

            {onOpenPackagesModal && (
              <button
                type="button"
                onClick={onOpenPackagesModal}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-stone-200/70 text-stone-700 font-semibold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{language === 'sw' ? 'Vifurushi vya Wauzaji (2k-10k)' : 'Vendor Packages'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenVendorModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100/80 hover:bg-amber-100 text-amber-900 font-bold transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === 'sw' ? 'Uza Sokoni (Sajili Genge)' : 'Sell with Us'}</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-stone-500 text-[11px] shrink-0">
            <MapPin className="w-3 h-3 text-emerald-600" />
            <span>Kigamboni Ferry Hub · Dar es Salaam</span>
          </div>
        </div>
      </div>
    </header>
  );
};
