import React from 'react';
import { ShoppingBag, Search, MapPin, PhoneCall, Globe, X, Store, Sparkles } from 'lucide-react';
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
  vendorsCount,
}) => {
  const [isZoneDropdownOpen, setIsZoneDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200">
      {/* Top Banner Notice */}
      <div className="bg-emerald-800 text-emerald-50 text-xs px-4 py-1.5 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              {language === 'sw'
                ? 'Soko La Asubuhi Limefunguliwa: Mazao yote yamewasili fresh kutoka shambani!'
                : 'Morning Fresh Market Open: Farm-direct produce delivered in under 2 hours!'}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-emerald-200 text-xs">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
              <a href="tel:0704205872" className="hover:underline font-bold text-white">
                0704 205 872
              </a>
              <span className="text-emerald-300">(M-Pesa / WhatsApp)</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-emerald-100">
              <MapPin className="w-3 h-3 text-amber-300" />
              <span>Kigamboni Ferry, Dar es Salaam</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shadow-sm group-hover:bg-emerald-800 transition-colors">
                <span className="tracking-tight">S</span>
                <span className="text-amber-300 text-sm -ml-0.5 font-black">M</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight leading-tight flex items-center gap-1">
                  Sokoni Mkononi
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                </span>
                <span className="text-[11px] text-stone-500 tracking-wide font-medium">
                  {language === 'sw' ? 'Soko Lako La Vyakula' : 'Your Digital Fresh Market'}
                </span>
              </div>
            </a>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={
                  language === 'sw'
                    ? 'Tafuta nyanya, mchele wa Kyela, ndizi, kuku, asali, au viungo...'
                    : 'Search fresh tomatoes, Kyela rice, bananas, fish, honey...'
                }
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
                  aria-label="Futa utafutaji"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Delivery Location dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsZoneDropdownOpen(!isZoneDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs sm:text-sm font-medium transition-colors"
                title="Badilisha eneo la kupelekewa"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="max-w-[100px] sm:max-w-[130px] truncate">
                  {selectedZone.name.split('(')[0].trim()}
                </span>
              </button>

              {isZoneDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-50">
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

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => onLanguageChange(language === 'sw' ? 'en' : 'sw')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200"
              title="Badilisha Lugha / Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-stone-500" />
              <span>{language === 'sw' ? 'SW' : 'EN'}</span>
            </button>

            {/* Packages Trigger Button */}
            {onOpenPackagesModal && (
              <button
                type="button"
                onClick={onOpenPackagesModal}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
                title={language === 'sw' ? 'Vifurushi vya malipo vya wauzaji kuanzia TZS 2,000' : 'Vendor monthly packages from TZS 2,000'}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{language === 'sw' ? 'Vifurushi vya Wauzaji' : 'Vendor Packages'}</span>
              </button>
            )}

            {/* Vendor Registration Button for Small Market Sellers */}
            <button
              type="button"
              onClick={onOpenVendorModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
              title={language === 'sw' ? 'Jisajili kama mfanyabiashara wa soko' : 'Register as a market vendor'}
            >
              <Store className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">
                {language === 'sw' ? 'Uza Sokoni' : 'Sell with Us'}
              </span>
              <span className="sm:hidden">
                {language === 'sw' ? 'Genge' : 'Sell'}
              </span>
            </button>

            {/* Cart Trigger Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all shadow-sm active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-stone-950 text-[10px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold">
                TSh {cartTotal.toLocaleString()}
              </span>
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
              className="w-full pl-9 pr-8 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
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
    </header>
  );
};
