import React from 'react';
import { X, Check, Sparkles, Store, ShieldCheck, Zap, Award } from 'lucide-react';
import { Language, PackageTier } from '../types';
import { VENDOR_PACKAGES } from '../data/packages';

interface PackagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectPackage: (tier: PackageTier) => void;
}

export const PackagesModal: React.FC<PackagesModalProps> = ({
  isOpen,
  onClose,
  language,
  onSelectPackage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-stone-200 shadow-2xl relative">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-stone-900 text-lg sm:text-xl leading-tight">
                {language === 'sw'
                  ? 'Vifurushi vya Malipo ya Kila Mwezi kwa Wafanyabiashara'
                  : 'Monthly Subscription Packages for Market Vendors'}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {language === 'sw'
                  ? 'Chagua kifurushi kinachofaa ukubwa wa duka lako ili kuongeza mauzo na wateja wa Dar'
                  : 'Choose the best monthly package suited to your stall size and sales goals'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Packages Cards Grid */}
        <div className="p-5 sm:p-7">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {VENDOR_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all relative border-2 ${
                  pkg.popular
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-lg ring-2 ring-emerald-500/20'
                    : 'border-stone-200 bg-white hover:border-stone-300 shadow-sm'
                }`}
              >
                {/* Popular Ribbon */}
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{language === 'sw' ? 'Inapendekezwa Zaidi' : 'Most Popular'}</span>
                  </div>
                )}

                <div>
                  {/* Title & Tagline */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      {pkg.id === 'starter' && 'Shaba / Bronze'}
                      {pkg.id === 'pro' && 'Fedha / Silver'}
                      {pkg.id === 'vip' && 'Dhahabu / Gold'}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${pkg.badgeColor}`}>
                      {pkg.maxProducts === 999
                        ? (language === 'sw' ? 'Bidhaa Bila Kikomo' : 'Unlimited Items')
                        : `${pkg.maxProducts} ${language === 'sw' ? 'Bidhaa' : 'Items'}`}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-stone-900 text-lg sm:text-xl">
                    {language === 'sw' ? pkg.titleSw : pkg.titleEn}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 min-h-[32px]">
                    {language === 'sw' ? pkg.taglineSw : pkg.taglineEn}
                  </p>

                  {/* Price */}
                  <div className="my-5 pb-5 border-b border-stone-200/80">
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-2xl sm:text-3xl font-black text-stone-900">
                        TZS {pkg.priceTZS.toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold text-stone-500">
                        {language === 'sw' ? '/ mwezi' : '/ month'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      {language === 'sw'
                        ? 'Hulipwa mara moja kila baada ya siku 30'
                        : 'Billed every 30 days via mobile money'}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 mb-6 text-xs text-stone-700">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-900 block mb-2">
                      {language === 'sw' ? 'Sifa za Package Hii:' : 'Package Features:'}
                    </span>
                    {(language === 'sw' ? pkg.featuresSw : pkg.featuresEn).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Choose button */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectPackage(pkg.id);
                    onClose();
                  }}
                  className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                    pkg.popular
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-95'
                      : 'bg-stone-900 hover:bg-stone-800 text-white active:scale-95'
                  }`}
                >
                  <Store className="w-4 h-4 text-amber-300" />
                  <span>
                    {language === 'sw'
                      ? `Chagua Kifurushi cha TZS ${pkg.priceTZS.toLocaleString()}`
                      : `Select TZS ${pkg.priceTZS.toLocaleString()} Plan`}
                  </span>
                </button>
              </div>
            ))}
          </div>

          {/* Guarantee Footer */}
          <div className="mt-7 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                {language === 'sw'
                  ? 'Unaweza kubadili (upgrade) au kusitisha kifurushi chako wakati wowote bila faini yoyote.'
                  : 'You can upgrade or switch your vendor package at any time without penalties.'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-stone-500 font-medium shrink-0 text-[11px]">
              <span>M-Pesa</span>
              <span>•</span>
              <span>Tigo Pesa</span>
              <span>•</span>
              <span>Airtel Money</span>
              <span>•</span>
              <span>Halopesa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
