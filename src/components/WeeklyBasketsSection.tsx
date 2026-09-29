import React, { useState } from 'react';
import { ShoppingBag, Check, Sparkles, Users, ArrowRight, ShieldCheck, Heart, Eye } from 'lucide-react';
import { Language } from '../types';
import { Product } from '../data/products';
import { WEEKLY_BASKETS, WeeklyBasket, weeklyBasketToProduct } from '../data/weeklyBaskets';

interface WeeklyBasketsSectionProps {
  language: Language;
  onAddToCart: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
}

export const WeeklyBasketsSection: React.FC<WeeklyBasketsSectionProps> = ({
  language,
  onAddToCart,
  onOpenDetails,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'budget' | 'family' | 'feast'>('all');

  const filteredBaskets = WEEKLY_BASKETS.filter((b) => {
    if (selectedFilter === 'budget') return b.price <= 30000;
    if (selectedFilter === 'family') return b.price > 30000 && b.price <= 50000;
    if (selectedFilter === 'feast') return b.price > 50000;
    return true;
  });

  return (
    <section id="vikapu-vya-wiki" className="py-12 sm:py-16 bg-gradient-to-b from-stone-50 via-emerald-50/20 to-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {language === 'sw'
                  ? 'Vikapu Maalum vya Wiki kwa Ajili ya Wateja'
                  : 'Curated Weekly Family Baskets for Customers'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 tracking-tight leading-tight">
              {language === 'sw' ? (
                <>
                  Okoa Hadi{' '}
                  <span className="text-emerald-700 underline decoration-amber-400 decoration-4">
                    TZS 17,000
                  </span>{' '}
                  kwa Kikapu cha Wiki
                </>
              ) : (
                <>
                  Save Up To{' '}
                  <span className="text-emerald-700 underline decoration-amber-400 decoration-4">
                    TZS 17,000
                  </span>{' '}
                  With Weekly Baskets
                </>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mt-1.5 leading-relaxed">
              {language === 'sw'
                ? 'Pata mchanganyiko kamili wa nyama, samaki, nafaka, mboga za majani na matunda ya familia kwa bei ya chini ya soko kuliko kununua kimoja kimoja.'
                : 'Get complete bundles of meats, fish, fresh vegetables, grains and seasonal fruits at discounted bulk market rates.'}
            </p>
          </div>

          {/* Quick Price/Audience Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none self-start md:self-auto">
            {[
              { id: 'all', sw: 'Vikapu Vyote', en: 'All Baskets' },
              { id: 'budget', sw: 'Chini ya 30,000/=', en: 'Under 30,000/=' },
              { id: 'family', sw: 'Familia (35k - 45k)', en: 'Family (35k - 45k)' },
              { id: 'feast', sw: 'Familia Kubwa (75k)', en: 'Mega Feast (75k)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedFilter === tab.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {language === 'sw' ? tab.sw : tab.en}
              </button>
            ))}
          </div>
        </div>

        {/* Baskets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBaskets.map((basket) => {
            const productRep = weeklyBasketToProduct(basket);
            return (
              <div
                key={basket.id}
                className={`rounded-3xl border-2 transition-all duration-300 hover:shadow-xl flex flex-col justify-between overflow-hidden relative group ${
                  basket.popular
                    ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-stone-200 bg-white hover:border-emerald-300 shadow-xs'
                }`}
              >
                {/* Popular / Savings Ribbon */}
                <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5">
                  <span className="bg-amber-400 text-stone-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">
                    {language === 'sw' ? basket.badgeSw : basket.badgeEn}
                  </span>
                  {basket.popular && (
                    <span className="bg-emerald-700 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">
                      {language === 'sw' ? 'Maarufu Zaidi' : 'Most Popular'}
                    </span>
                  )}
                </div>

                {/* Top Image & Household Size */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-100">
                  <img
                    src={basket.image}
                    alt={language === 'sw' ? basket.nameSw : basket.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  
                  {/* Household Size Tag */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-semibold">
                    <Users className="w-3.5 h-3.5 text-amber-300" />
                    <span>{language === 'sw' ? basket.householdSizeSw : basket.householdSizeEn}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenDetails(productRep)}
                    className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/90 hover:bg-white text-stone-900 transition-all shadow-sm cursor-pointer"
                    title={language === 'sw' ? 'Angalia maelezo zaidi' : 'View full details'}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-lg leading-tight group-hover:text-emerald-800 transition-colors">
                      {language === 'sw' ? basket.nameSw : basket.nameEn}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1.5 leading-relaxed line-clamp-2">
                      {language === 'sw' ? basket.descriptionSw : basket.descriptionEn}
                    </p>

                    {/* Price and Savings Callout */}
                    <div className="my-4 pt-3 border-t border-stone-100 flex items-baseline justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-2xl font-black text-emerald-800">
                            TZS {basket.price.toLocaleString()}
                          </span>
                          <span className="font-mono text-xs text-stone-400 line-through">
                            TZS {basket.originalPrice.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400">
                          {language === 'sw' ? 'Bei ya kikapu kizima cha wiki' : 'Complete weekly bundle price'}
                        </span>
                      </div>

                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                        {language === 'sw'
                          ? `Okoa ${basket.savingsTZS.toLocaleString()}/=`
                          : `Save ${basket.savingsTZS.toLocaleString()}/=`}
                      </span>
                    </div>

                    {/* Items List Breakdown */}
                    <div className="space-y-1.5 mb-5 bg-stone-50/70 p-3 rounded-2xl border border-stone-200/70">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block mb-1">
                        {language === 'sw' ? 'Yaliyomo Ndani ya Kikapu Hiki:' : 'Included In This Basket:'}
                      </span>
                      {basket.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs text-stone-800">
                          <div className="flex items-center gap-1.5 truncate pr-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                            <span className="truncate">{language === 'sw' ? item.nameSw : item.nameEn}</span>
                          </div>
                          <span className="font-mono font-bold text-[11px] text-stone-600 shrink-0">
                            {item.qty}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onAddToCart(productRep)}
                      className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-amber-300" />
                      <span>
                        {language === 'sw'
                          ? `Weka Kikapu Chote (${basket.price.toLocaleString()}/=)`
                          : `Add Basket (${basket.price.toLocaleString()}/=)`}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits bar for customers */}
        <div className="mt-8 p-4 sm:p-5 bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                {language === 'sw'
                  ? 'Uhuru wa Kubadilisha Vitu Kwenye Kikapu Chako'
                  : 'Customizable Weekly Baskets'}
              </h4>
              <p className="text-[11px] text-stone-500">
                {language === 'sw'
                  ? 'Unahitaji kuongeza zao jingine au kupunguza? Unaweza kuandika kwenye maelezo ya oda (Notes) wakati wa kulipa au kupitia WhatsApp.'
                  : 'Need to swap or add extra items? Mention your preference in order notes at checkout or via WhatsApp.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <span>{language === 'sw' ? 'Inafikishwa ndani ya masaa 2 Dar' : 'Delivered within 2 hours in Dar'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
