import React from 'react';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Heart, Sparkles, Globe, MessageCircle, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  language: Language;
  onOpenVendorModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onOpenVendorModal }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 text-xs border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info & Socials */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                SM
              </div>
              <span className="text-lg font-black text-white">Sokoni Mkononi</span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed font-normal">
              {language === 'sw'
                ? 'Soko lako la kiganjani la mazao safi ya shambani na vyakula bora vya Kitanzania. Bei halisi za asubuhi, ufikishwaji wa haraka mlangoni kwako.'
                : 'Your digital fresh food marketplace. Farm-fresh produce, authentic regional grains, and wholesome local meats at genuine morning market prices.'}
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'sw' ? 'Picha 100% Halisi za Kila Zao' : '100% Unique Authentic Photography'}</span>
            </div>

            {/* Social Media Networks */}
            <div className="pt-2">
              <div className="text-xs font-bold text-stone-200 mb-2">
                {language === 'sw' ? 'Tufuatilie Mitandaoni:' : 'Follow Us:'}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="https://wa.me/255704205872?text=Habari%20Sokoni%20Mkononi,%20nahitaji%20kuweka%20oda"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-8 h-8 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors shadow-sm"
                  title="WhatsApp: 0704205872"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com/sokonimkononi"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-lg bg-pink-700/80 hover:bg-pink-600 text-white flex items-center justify-center transition-colors shadow-sm"
                  title="Instagram: @sokonimkononi"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com/sokonimkononi"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-lg bg-blue-700/80 hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-sm"
                  title="Facebook: @sokonimkononi"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://x.com/sokonimkononi"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                  className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-white flex items-center justify-center transition-colors shadow-sm"
                  title="X (Twitter): @sokonimkononi"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com/@sokonimkononi"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-lg bg-red-700/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-sm"
                  title="YouTube: @sokonimkononi"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="https://tiktok.com/@sokonimkononi"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="px-2.5 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-[11px] flex items-center justify-center transition-colors shadow-sm"
                  title="TikTok: @sokonimkononi"
                >
                  TikTok
                </a>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-stone-100 text-sm">
              {language === 'sw' ? 'Aina za Mazao' : 'Produce Categories'}
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>{language === 'sw' ? 'Mboga za Majani & Viungo' : 'Fresh Vegetables & Herbs'}</li>
              <li>{language === 'sw' ? 'Matunda Mabichi ya Pwani & Bara' : 'Tropical Seasonal Fruits'}</li>
              <li>{language === 'sw' ? 'Samaki wa Ziwa & Nyama ya Ng\'ombe' : 'Fresh Fish & Prime Beef'}</li>
              <li>{language === 'sw' ? 'Mchele wa Kyela, Maharage ya Njano & Sembe' : 'Kyela Rice, Yellow Beans & Sembe'}</li>
              <li>{language === 'sw' ? 'Mafuta ya Alizeti, Asali ya Tabora & Siagi' : 'Sunflower Oil, Tabora Honey & Butter'}</li>
              {onOpenVendorModal && (
                <li className="pt-2">
                  <button
                    type="button"
                    onClick={onOpenVendorModal}
                    className="text-amber-400 hover:text-amber-300 font-bold hover:underline flex items-center gap-1 text-xs"
                  >
                    <span>{language === 'sw' ? '★ Jisajili Kama Mfanyabiashara wa Soko' : '★ Register As Market Vendor'}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-stone-100 text-sm">
              {language === 'sw' ? 'Mawasiliano & Ofisi' : 'Contact & Headquarters'}
            </h4>
            <ul className="space-y-2.5 text-stone-400">
              <li className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <a href="tel:0704205872" className="text-emerald-400 hover:text-emerald-300 font-bold">
                    0704 205 872
                  </a>
                  <span className="text-[11px] text-stone-400 block">+255 704 205 872 (M-Pesa / WhatsApp)</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <a href="mailto:info@sokonimkononi.co.tz" className="hover:text-stone-200">
                    info@sokonimkononi.co.tz
                  </a>
                  <span className="text-[11px] text-stone-400 block">huduma@sokonimkononi.co.tz</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <a href="https://www.sokonimkononi.co.tz" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline font-medium">
                    www.sokonimkononi.co.tz
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-stone-200 font-semibold block">Kigamboni Ferry</span>
                  <span className="text-[11px] text-stone-400 block">Dar es Salaam, Tanzania</span>
                </div>
              </li>
              <li className="flex items-center gap-2 pt-1 text-[11px] text-stone-400">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{language === 'sw' ? 'Kila siku: Saa 12:00 Asubuhi - 4:00 Usiku' : 'Daily: 6:00 AM - 10:00 PM'}</span>
              </li>
            </ul>
          </div>

          {/* Payment Methods & Guarantee */}
          <div className="space-y-3">
            <h4 className="font-bold text-stone-100 text-sm">
              {language === 'sw' ? 'Malipo Salama' : 'Secure Payments'}
            </h4>
            <p className="text-stone-400 text-xs">
              {language === 'sw'
                ? 'Lipa kirahisi kwa 0704 205 872 kupitia mitandao yote ya simu au pesa taslimu unapopokea bidhaa zako.'
                : 'Pay seamlessly to 0704 205 872 via mobile money or cash on delivery.'}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['M-PESA', 'TIGO PESA', 'AIRTEL MONEY', 'HALOPESA', 'LIPA UNAPOPOKEA'].map((m) => (
                <span key={m} className="px-2 py-1 bg-stone-800 text-stone-300 rounded text-[10px] font-bold tracking-wider">
                  {m}
                </span>
              ))}
            </div>
            <div className="text-[11px] text-stone-400 flex items-center gap-1.5 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{language === 'sw' ? 'Uhakikisho wa Mazao Safi au Kurudishiwa Pesa' : '100% Freshness Guarantee or Refund'}</span>
            </div>
            <div className="p-2.5 bg-stone-800/80 rounded-xl border border-stone-700/60 text-[11px] text-stone-300">
              <span className="font-semibold text-emerald-400 block">
                {language === 'sw' ? '📍 Makao Makuu & Eneo la Usambazaji:' : '📍 Hub & Logistics Center:'}
              </span>
              <span>Kigamboni Ferry, Dar es Salaam</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} Sokoni Mkononi (www.sokonimkononi.co.tz). {language === 'sw' ? 'Haki zote zimehifadhiwa.' : 'All rights reserved.'}</p>
          <p className="flex items-center gap-1">
            <span>{language === 'sw' ? 'Imetengenezwa Kigamboni Ferry kwa ajili ya Watanzania' : 'Crafted at Kigamboni Ferry for Tanzanians'}</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
