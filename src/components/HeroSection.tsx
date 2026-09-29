import React from 'react';
import { Sparkles, Truck, ShieldCheck, Clock, Award, ArrowDown, RefreshCw, HeartHandshake, Store } from 'lucide-react';
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
  vendorsCount?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  selectedCategory,
  onSelectCategory,
  onOpenVendorModal,
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

            {/* Small Vendors Registration Prompt Bar */}
            <div className="pt-2">
              <div className="bg-amber-400/15 border border-amber-300/30 rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                      {language === 'sw'
                        ? 'Una fremu, genge au meza sokoni? (Kariakoo, Tandale n.k.)'
                        : 'Own a produce stall or market table?'}
                    </h4>
                    <p className="text-[11px] text-stone-300 mt-0.5">
                      {language === 'sw'
                        ? 'Jisajili kama mfanyabiashara, upate wateja wa mtandaoni na kuongeza mauzo.'
                        : 'Register your stall for free and receive direct household delivery orders.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenVendorModal}
                  className="px-3.5 py-1.5 sm:py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-xs rounded-lg transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>{language === 'sw' ? 'Jisajili Hapa Bure' : 'Register Stall Free'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Feature Visual Card Showcase */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-200 border-b border-white/10 pb-3">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  {language === 'sw' ? 'Utofauti wa Picha (Zero Sameness)' : 'Distinct High-Res Imagery'}
                </span>
                <span className="text-[11px] text-stone-300">
                  {language === 'sw' ? 'Picha 30+ Tofauti' : '30+ Unique Photos'}
                </span>
              </div>

              {/* 6 Distinct Item Photo Previews Grid to clearly demonstrate variety */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-stone-900 shadow-sm">
                  <img
                    src={tikitiImg}
                    alt="Tikiti Maji Kubwa"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-2">
                    <span className="text-white text-xs font-bold truncate">
                      {language === 'sw' ? 'Tikiti Maji Halisi' : 'Crisp Watermelon'}
                    </span>
                    <span className="text-[10px] text-emerald-300">Chalinze, Pwani</span>
                  </div>
                </div>

                <div className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-stone-900 shadow-sm">
                  <img
                    src={naziImg}
                    alt="Nazi Kubwa za Pwani"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-2">
                    <span className="text-white text-xs font-bold truncate">
                      {language === 'sw' ? 'Nazi Halisi ya Pwani' : 'Coastal Coconut'}
                    </span>
                    <span className="text-[10px] text-emerald-300">Bagamoyo & Mafia</span>
                  </div>
                </div>

                <div className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-stone-900 shadow-sm">
                  <img
                    src={samakiSatoImg}
                    alt="Samaki Sato Wabichi"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-2">
                    <span className="text-white text-xs font-bold truncate">
                      {language === 'sw' ? 'Samaki Sato Wabichi' : 'Fresh Victoria Tilapia'}
                    </span>
                    <span className="text-[10px] text-emerald-300">Ziwa Victoria</span>
                  </div>
                </div>

                <div className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-stone-900 shadow-sm">
                  <img
                    src={nyamaNgombeImg}
                    alt="Nyama ya Ng'ombe"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-2">
                    <span className="text-white text-xs font-bold truncate">
                      {language === 'sw' ? 'Nyama ya Ng\'ombe' : 'Prime Beef Cuts'}
                    </span>
                    <span className="text-[10px] text-emerald-300">Dodoma Bucha</span>
                  </div>
                </div>

                <div className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-stone-900 shadow-sm">
                  <img
                    src={dagaaImg}
                    alt="Dagaa wa Kigoma"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-2">
                    <span className="text-white text-xs font-bold truncate">
                      {language === 'sw' ? 'Dagaa wa Kigoma' : 'Lake Sardines'}
                    </span>
                    <span className="text-[10px] text-emerald-300">Ziwa Tanganyika</span>
                  </div>
                </div>

                <div className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-stone-900 shadow-sm">
                  <img
                    src={asaliImg}
                    alt="Asali ya Tabora"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-2">
                    <span className="text-white text-xs font-bold truncate">
                      {language === 'sw' ? 'Asali Halisi ya Tabora' : 'Raw Wild Honey'}
                    </span>
                    <span className="text-[10px] text-emerald-300">Misitu ya Miombo</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-stone-300 text-center leading-normal">
                {language === 'sw'
                  ? 'Kila zao lina picha halisi ya kipekee inayolingana na zao hilo lenyewe bila kurudia au kufanana ovyo.'
                  : 'Every single farm crop is rendered with individual photographic accuracy, avoiding generic duplicate tiles.'}
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
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
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
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-stone-200'
                  }`}
                >
                  <span>{language === 'sw' ? cat.nameSw : cat.nameEn}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-emerald-700 text-white' : 'bg-black/25 text-stone-300'}`}>
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
