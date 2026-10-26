import React from 'react';
import { Sparkles, Truck, ShieldCheck, Award, HeartHandshake, Store, Layers } from 'lucide-react';
import { Language } from '../types';
import { CATEGORIES } from '../data/products';
import denguImg from '../assets/images/dengu_safi_1790499903949.jpg';
import nyamaNgombeImg from '../assets/images/nyama_ngombe_1790499914097.jpg';
import samakiSatoImg from '../assets/images/samaki_sato_1790499924384.jpg';
import naziImg from '../assets/images/nazi_halisi_1790500642273.jpg';
import tikitiImg from '../assets/images/tikiti_maji_1790500653569.jpg';
import dagaaImg from '../assets/images/dagaa_halisi_1790500681909.jpg';
import asaliImg from '../assets/images/asali_halisi_1790500730083.jpg';

interface HeroSectionProps {
  language: Language;
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onOpenVendorModal: () => void;
  onOpenPackagesModal?: () => void;
  vendorsCount?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  selectedCategory,
  onSelectCategory,
  onOpenVendorModal,
  onOpenPackagesModal,
  vendorsCount = 0,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-850 to-stone-900 text-white">
      {/* Background Decorative Graphic Grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 pt-8 pb-12 sm:pt-12 sm:pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            {/* Visual Variety Guarantee Banner */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-xs font-semibold text-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {language === 'sw'
                  ? 'Picha Halisi za Kipekee: Kila zao lina picha yake maalum bila kufanana!'
                  : 'Distinct Authentic Photos: Every fresh produce item features its own unique photography!'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15]">
              {language === 'sw' ? (
                <>
                  Mazao Mabichi ya Shambani,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-yellow-200">
                    Sokoni Mkononi Mwako.
                  </span>
                </>
              ) : (
                <>
                  Farm-Fresh Groceries,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-yellow-200">
                    Direct To Your Doorstep.
                  </span>
                </>
              )}
            </h1>

            <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {language === 'sw'
                ? 'Agiza nyanya nyekundu, mchele wa Kyela, ndizi za Bukoba, samaki wabichi wa Ziwa Victoria na mafuta ya alizeti kwa bei halisi ya sokoni na uletewe ndani ya masaa 2.'
                : 'Order vine-ripened tomatoes, Kyela aromatic rice, Bukoba sweet bananas, and Lake Victoria fish at true local market prices delivered in under 2 hours.'}
            </p>

            {/* Value Props Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-left">
                <Truck className="w-5 h-5 text-amber-300 mb-1.5" />
                <div className="font-bold text-xs text-white">
                  {language === 'sw' ? 'Masaa 1 - 2' : 'Under 2 Hrs'}
                </div>
                <div className="text-[11px] text-stone-300">
                  {language === 'sw' ? 'Ufikishwaji wa haraka' : 'Speedy delivery'}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-left">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1.5" />
                <div className="font-bold text-xs text-white">
                  {language === 'sw' ? '100% Asilia' : '100% Farm Fresh'}
                </div>
                <div className="text-[11px] text-stone-300">
                  {language === 'sw' ? 'Bila madawa mabaya' : 'Clean & wholesome'}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-left">
                <Award className="w-5 h-5 text-amber-300 mb-1.5" />
                <div className="font-bold text-xs text-white">
                  {language === 'sw' ? 'Bei ya Sokoni' : 'Market Rates'}
                </div>
                <div className="text-[11px] text-stone-300">
                  {language === 'sw' ? 'Hakuna madalali' : 'Direct from farms'}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-left">
                <HeartHandshake className="w-5 h-5 text-emerald-400 mb-1.5" />
                <div className="font-bold text-xs text-white">
                  {language === 'sw' ? 'M-Pesa / Tigo' : 'Mobile Money'}
                </div>
                <div className="text-[11px] text-stone-300">
                  {language === 'sw' ? 'Lipa pia unapopokea' : 'Pay on delivery'}
                </div>
              </div>
            </div>

            {/* Customer Weekly Baskets CTA Banner */}
            <div className="pt-2">
              <a
                href="#vikapu-vya-wiki"
                className="block bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 border border-emerald-400/40 rounded-2xl p-3.5 sm:p-4 text-left transition-all shadow-lg hover:shadow-emerald-900/30 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl">🧺</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-400 text-stone-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                          {language === 'sw' ? 'Vifurushi vya Wateja' : 'Customer Packages'}
                        </span>
                        <span className="text-xs sm:text-sm font-extrabold text-white">
                          {language === 'sw' ? 'Vikapu Maalum vya Wiki (Kuanzia 18,000/=)' : 'Weekly Grocery Baskets (From 18,000/=)'}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-100 mt-0.5">
                        {language === 'sw'
                          ? 'Mchele, nyama, samaki, mboga na matunda ya wiki nzima kwa mkupuo mmoja. Okoa hadi TZS 17,000!'
                          : 'Rice, meats, fish, fresh greens and fruit packages for the entire week. Save up to TZS 17,000!'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-300 group-hover:text-white transition-colors self-end sm:self-auto shrink-0">
                    <span>{language === 'sw' ? 'Angalia Vikapu Hapa' : 'Explore Baskets'}</span>
                    <span>→</span>
                  </div>
                </div>
              </a>
            </div>

            {/* Small Vendors Registration & Monthly Packages Prompt Bar */}
            <div className="pt-2">
              <div className="bg-amber-400/15 border border-amber-300/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                        {language === 'sw'
                          ? 'Wafanyabiashara wa Masokoni: Kariakoo, Tandale, Ilala, Buguruni'
                          : 'Market Vendors: Kariakoo, Tandale, Ilala, Buguruni'}
                      </h4>
                      <span className="hidden sm:inline bg-amber-400/90 text-stone-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                        TZS 2,000 · 5,000 · 10,000
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-300 mt-1">
                      {language === 'sw'
                        ? 'Chagua vifurushi vya malipo ya kila mwezi vya kuanzia TZS 2,000, 5,000 (Popular) au 10,000 (VIP) kuweka meza yako hewani.'
                        : 'Choose monthly vendor packages starting at TZS 2,000, 5,000 or 10,000 to list your stall online.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {onOpenPackagesModal && (
                    <button
                      type="button"
                      onClick={onOpenPackagesModal}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-amber-300" />
                      <span>{language === 'sw' ? 'Tazama Vifurushi' : 'View Packages'}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onOpenVendorModal}
                    className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>{language === 'sw' ? 'Sajili Duka Lako' : 'Register Stall'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Composition */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-md">
              {/* Main Feature Highlight Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-stone-900 group">
                <img
                  src={denguImg}
                  alt="Dengu Safi ya Morogoro"
                  className="w-full h-64 sm:h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-amber-400 text-stone-950 text-[10px] font-black uppercase tracking-wider mb-1.5">
                    {language === 'sw' ? 'Mzigo Mpya Leo' : 'Fresh Harvest Today'}
                  </span>
                  <h3 className="font-extrabold text-white text-lg sm:text-xl">
                    {language === 'sw' ? 'Dengu Safi ya Morogoro' : 'Clean Morogoro Green Grams'}
                  </h3>
                  <p className="text-stone-300 text-xs mt-1">
                    {language === 'sw'
                      ? 'Imepepetwa vizuri, haina kokoto wala vumbi. Kilo 1: TSh 4,500'
                      : 'Sorted thoroughly, zero grit or stones. 1 KG: TSh 4,500'}
                  </p>
                </div>
              </div>

              {/* Floating Thumbnails Grid representing real unique items */}
              <div className="grid grid-cols-3 gap-2.5 mt-3">
                <div className="rounded-2xl overflow-hidden border border-white/20 shadow-md relative group bg-stone-900">
                  <img
                    src={nyamaNgombeImg}
                    alt="Nyama ya Ng'ombe"
                    className="w-full h-20 sm:h-24 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[10px] font-bold text-white leading-tight">
                      {language === 'sw' ? "Ng'ombe" : 'Beef'}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden border border-white/20 shadow-md relative group bg-stone-900">
                  <img
                    src={samakiSatoImg}
                    alt="Samaki Sato"
                    className="w-full h-20 sm:h-24 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[10px] font-bold text-white leading-tight">
                      {language === 'sw' ? 'Sato Fresh' : 'Fresh Tilapia'}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden border border-white/20 shadow-md relative group bg-stone-900">
                  <img
                    src={asaliImg}
                    alt="Asali ya Tabora"
                    className="w-full h-20 sm:h-24 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[10px] font-bold text-white leading-tight">
                      {language === 'sw' ? 'Asali Halisi' : 'Pure Honey'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Horizontal Filter Bar */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-stone-100'
              }`}
            >
              <span>{language === 'sw' ? 'Mazao Yote' : 'All Products'}</span>
            </button>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-stone-200'
                  }`}
                >
                  <span>{language === 'sw' ? cat.nameSw : cat.nameEn}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-emerald-700 text-white' : 'bg-black/25 text-stone-300'}`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
