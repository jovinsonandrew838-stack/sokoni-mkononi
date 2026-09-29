import React from 'react';
import { Star, ShieldCheck, Heart, Users, MapPin, CheckCircle } from 'lucide-react';
import { Language } from '../types';

interface ReviewsSectionProps {
  language: Language;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ language }) => {
  const reviews = [
    {
      name: 'Mama Rehema',
      location: 'Mikocheni B, Dar es Salaam',
      rating: 5,
      commentSw: 'Nimependa sana namna picha kwenye tovuti zilivyo halisi! Nyanya, vitunguu na samaki niliopokea ni kama walivyopigwa picha, hakuna picha feki za mtandaoni. Waliniletea ndani ya lisaa limoja tu.',
      commentEn: 'I love how genuine the photos on this site are! The tomatoes, onions and fish I received matched the pictures exactly, no generic stock photo trickery. Delivered within an hour.',
      dateSw: 'Jana Asubuhi',
      dateEn: 'Yesterday Morning',
    },
    {
      name: 'Eng. Baraka Mtweve',
      location: 'Oysterbay, Dar es Salaam',
      rating: 5,
      commentSw: 'Mchele wa Kyela unanukia vibaya mno! Na mafuta ya alizeti ya Singida ni halisi yasiyo na harufu mbaya. Sokoni Mkononi mmenikomboa na adha ya joto la Kariakoo.',
      commentEn: 'The Kyela rice aroma filled the house! And the Singida sunflower oil is pure with zero off-taste. Sokoni Mkononi saved me from crowded market trips.',
      dateSw: 'Siku 3 zilizopita',
      dateEn: '3 days ago',
    },
    {
      name: 'Neema Kiwia',
      location: 'Sakina, Arusha',
      rating: 5,
      commentSw: 'Parachichi za Njombe na kuku wa kienyeji walikuwa safi na wenye viwango vya hali ya juu. Malipo ya M-Pesa yalikuwa ya haraka na rahisi.',
      commentEn: 'The Njombe avocados and farm chicken were top grade. Paying with M-Pesa was seamless and fast.',
      dateSw: 'Wiki hii',
      dateEn: 'This week',
    },
  ];

  const farms = [
    { name: 'Umoja Farmers Cooperative', region: 'Lushoto, Usambara', produce: 'Mboga za Majani & Sukuma Wiki' },
    { name: 'Shamba la Mchele Kyela', region: 'Kyela, Mbeya', produce: 'Mchele Safi wa Super' },
    { name: 'Singida Sunflower Press', region: 'Singida Vijijini', produce: 'Mafuta Asilia ya Alizeti' },
    { name: 'Wavuvi wa Ziwa Victoria', region: 'Mwanza', produce: 'Samaki Sato & Sangara' },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-emerald-700" />
            <span>{language === 'sw' ? 'Wateja Wetu Wanasemaje' : 'Customer Feedback'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {language === 'sw' ? 'Uzoefu Halisi Kutoka Jikoni' : 'Real Stories From Real Kitchens'}
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            {language === 'sw'
              ? 'Wateja zaidi ya 5,000+ wanaridhika na ubora wa mazao na uhalisia wa picha zetu.'
              : 'Over 5,000+ happy households enjoy transparent, farm-authentic quality.'}
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-stone-50 rounded-2xl p-5 border border-stone-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-400">{language === 'sw' ? rev.dateSw : rev.dateEn}</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  "{language === 'sw' ? rev.commentSw : rev.commentEn}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-stone-900">{rev.name}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-stone-500">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span>{rev.location}</span>
                  </div>
                </div>
                <span title="Mteja aliyethibitishwa">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Farm Direct Source Trust Strip */}
        <div className="bg-emerald-900 text-white rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-md">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">
                {language === 'sw' ? 'Moja kwa Moja Toka Shambani' : 'Direct From Farm Partners'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {language === 'sw' ? 'Wakulima Wetu wa Nyumbani' : 'Empowering Local Growers'}
              </h3>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                {language === 'sw'
                  ? 'Kila ununuzi unaofanya unasaidia wakulima wadogo na wavuvi kutoka Tanga, Iringa, Mbeya, Singida na Mwanza kupata bei ya haki bila madalali katikati.'
                  : 'Every basket supports local smallholders in Lushoto, Singida, Kyela, and Mwanza, eliminating exploitative middlemen.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {farms.map((f, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-xs">
                  <div className="font-bold text-emerald-200 truncate">{f.name}</div>
                  <div className="text-[11px] text-stone-300 mt-0.5">{f.region}</div>
                  <div className="text-[10px] text-amber-300 mt-1 font-medium">{f.produce}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
