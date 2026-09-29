import React, { useState } from 'react';
import { X, Check, Image as ImageIcon, Sparkles, RefreshCw, Upload, ExternalLink } from 'lucide-react';
import { Product } from '../data/products';
import { Language } from '../types';
import denguImg from '../assets/images/dengu_safi_1790499903949.jpg';
import nyamaNgombeImg from '../assets/images/nyama_ngombe_1790499914097.jpg';
import samakiSatoImg from '../assets/images/samaki_sato_1790499924384.jpg';
import tangawiziImg from '../assets/images/tangawizi_mbichi_1790500630887.jpg';
import naziImg from '../assets/images/nazi_halisi_1790500642273.jpg';
import tikitiImg from '../assets/images/tikiti_maji_1790500653569.jpg';
import pasheniImg from '../assets/images/pasheni_halisi_1790500665612.jpg';
import dagaaImg from '../assets/images/dagaa_halisi_1790500681909.jpg';
import maharageNjanoImg from '../assets/images/maharage_ya_njano_1790500695294.jpg';
import karangaMbichiImg from '../assets/images/karanga_mbichi_1790500706472.jpg';
import kundeImg from '../assets/images/kunde_halisi_1790500719131.jpg';
import asaliImg from '../assets/images/asali_halisi_1790500730083.jpg';
import siagiHalisiImg from '../assets/images/siagi_halisi_1790500743213.jpg';
import siagiKarangaImg from '../assets/images/siagi_ya_karanga_1790500756603.jpg';
import ungaSembeImg from '../assets/images/unga_sembe_halisi_1790501412267.jpg';

interface ImageCustomizerModalProps {
  product: Product | null;
  language: Language;
  onClose: () => void;
  onUpdateProductImage: (productId: string, newImageUrl: string) => void;
}

// Preset distinct high-res alternatives for common product categories to guarantee no similarity
const PHOTO_ALTERNATIVES: Record<string, { labelSw: string; labelEn: string; url: string }[]> = {
  'unga-wa-sembe': [
    { labelSw: 'Unga wa Sembe Halisi wa Mahindi', labelEn: 'Pure Sifted Maize Flour & Scoop', url: ungaSembeImg },
    { labelSw: 'Unga wa Mahindi Kwenye Bakuli', labelEn: 'Fine Milled Maize Meal in Bowl', url: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&w=800&q=80' },
  ],
  'tangawizi-mbichi': [
    { labelSw: 'Tangawizi Mbichi na Vipande Vyake', labelEn: 'Fresh Ginger Root & Slices', url: tangawiziImg },
    { labelSw: 'Tangawizi Safi ya Kigoma', labelEn: 'Raw Fresh Harvest Root', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80' },
  ],
  'nazi-ya-kukuna': [
    { labelSw: 'Nazi Halisi ya Pwani Iliyopasuliwa', labelEn: 'Fresh Halved Coastal Coconut', url: naziImg },
    { labelSw: 'Nazi Kavu ya Kukuna Tui', labelEn: 'Mature Whole & Split Coconuts', url: 'https://images.unsplash.com/photo-1544378730-8b5104b18790?auto=format&fit=crop&w=800&q=80' },
  ],
  'tikiti-maji': [
    { labelSw: 'Tikiti Maji Lililokatwa Kipande Chekundu', labelEn: 'Whole Watermelon & Juicy Red Slice', url: tikitiImg },
    { labelSw: 'Tikiti Nzima la Shambani', labelEn: 'Field-Fresh Whole Watermelon', url: 'https://images.unsplash.com/photo-1589533610925-1cffc309ebaa?auto=format&fit=crop&w=800&q=80' },
  ],
  'pasheni-iringa': [
    { labelSw: 'Pasheni Halisi Zilizoiva na Kupasuliwa', labelEn: 'Fresh Passion Fruits & Pulp', url: pasheniImg },
    { labelSw: 'Pasheni za Zambarau za Iringa', labelEn: 'Purple Highland Passion Fruits', url: 'https://images.unsplash.com/photo-1526318897912-39656a894677?auto=format&fit=crop&w=800&q=80' },
  ],
  'dagaa-kigoma': [
    { labelSw: 'Dagaa Wasafi wa Ziwa Kwenye Ungo', labelEn: 'Sun-Dried Dagaa in Woven Basket', url: dagaaImg },
    { labelSw: 'Dagaa wa Kigoma Wasio na Mchanga', labelEn: 'Crisp Dried Silver Sardines', url: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=800&q=80' },
  ],
  'maharage-ya-njano': [
    { labelSw: 'Maharage ya Njano ya Mbeya Kwenye Bakuli', labelEn: 'Mbeya Yellow Beans in Rustic Bowl', url: maharageNjanoImg },
    { labelSw: 'Maharage ya Njano ya Shambani', labelEn: 'Dry Raw Yellow Beans', url: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=80' },
  ],
  'karanga-mbichi': [
    { labelSw: 'Karanga Mbichi Nyekundu Kwenye Bakuli', labelEn: 'Raw Red-Skin Peanuts in Bowl', url: karangaMbichiImg },
    { labelSw: 'Karanga Safi Zilizomenywa', labelEn: 'Shelled Red Groundnuts', url: 'https://images.unsplash.com/photo-1567892705666-880c5d315904?auto=format&fit=crop&w=800&q=80' },
  ],
  'kunde-safi': [
    { labelSw: 'Kunde Safi za Kienyeji Kwenye Bakuli', labelEn: 'Black-Eyed Peas in Carved Bowl', url: kundeImg },
    { labelSw: 'Mbegu za Kunde za Msimu Huu', labelEn: 'Harvested Dry Cowpeas', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80' },
  ],
  'asali-mbichi-tabora': [
    { labelSw: 'Asali Mbichi ya Dhahabu na Chane la Nyuki', labelEn: 'Raw Golden Honey & Honeycomb', url: asaliImg },
    { labelSw: 'Asali Inayodondoka Kwenye Chupa', labelEn: 'Golden Honey Drizzle', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80' },
    { labelSw: 'Chane la Asali (Honeycomb)', labelEn: 'Wild Honeycomb Comb', url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80' },
  ],
  'siagi-halisi-ngombe': [
    { labelSw: 'Siagi Halisi ya Maziwa ya Ng\'ombe', labelEn: 'Farm-Fresh Churned Butter Block', url: siagiHalisiImg },
    { labelSw: 'Siagi Safi ya Shambani', labelEn: 'Natural Dairy Butter', url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80' },
  ],
  'siagi-ya-karanga': [
    { labelSw: 'Siagi Asilia ya Karanga Kwenye Kopo', labelEn: 'Stone-Ground Peanut Butter Jar', url: siagiKarangaImg },
    { labelSw: 'Siagi Halisi ya Ng\'ombe', labelEn: 'Pure Churned Farm Butter', url: siagiHalisiImg },
  ],
  'samaki-sato': [
    { labelSw: 'Samaki Sato Mbichi Kwenye Barafu', labelEn: 'Whole Tilapia on Crushed Ice', url: samakiSatoImg },
    { labelSw: 'Samaki Safi wa Ziwa Victoria', labelEn: 'Fresh Lake Victoria Catch', url: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=800&q=80' },
    { labelSw: 'Samaki Aliyesafishwa Tayari', labelEn: 'Cleaned Dressed Fish', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80' },
  ],
  'nyama-ya-ngombe': [
    { labelSw: 'Nyama Safi ya Ng\'ombe ya Bucha', labelEn: 'Fresh Beef Stew Cuts on Board', url: nyamaNgombeImg },
    { labelSw: 'Vipande vya Rosti na Mifupa', labelEn: 'Cubed Beef with Bone', url: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80' },
    { labelSw: 'Nyama Nyekundu Laini', labelEn: 'Prime Lean Cuts', url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80' },
  ],
  'dengu-safi': [
    { labelSw: 'Dengu za Kijani Kwenye Bakuli', labelEn: 'Green Mung Beans in Bowl', url: denguImg },
    { labelSw: 'Mbegu za Dengu za Shambani', labelEn: 'Farm Mung Beans on Burlap', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' },
  ],
  'nyanya-mshumaa': [
    { labelSw: 'Kwenye Mti wa Shambani', labelEn: 'On the Vine', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80' },
    { labelSw: 'Sokoni Kwenye Kikapu', labelEn: 'In Woven Market Basket', url: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=800&q=80' },
    { labelSw: 'Zilizokatwa Tayari kwa Rosti', labelEn: 'Sliced Fresh for Stew', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80' },
    { labelSw: 'Kwenye Meza ya Jikoni', labelEn: 'Rustic Kitchen Prep', url: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&w=800&q=80' },
  ],
  'vitunguu-maji': [
    { labelSw: 'Vitunguu Vikavu vya Singida', labelEn: 'Dried Singida Bulbs', url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80' },
    { labelSw: 'Mrundikano Sokoni', labelEn: 'Bulk Market Pile', url: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80' },
    { labelSw: 'Vitunguu Vilivyokatwa Vipande', labelEn: 'Diced & Ring Slices', url: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=800&q=80' },
  ],
  'sukuma-wiki': [
    { labelSw: 'Majani Mabichi ya Lushoto', labelEn: 'Crisp Field Greens', url: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6fa57?auto=format&fit=crop&w=800&q=80' },
    { labelSw: 'Mchicha & Sukuma ya Kijani', labelEn: 'Leafy Bundle Display', url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80' },
    { labelSw: 'Zilizochanwa & Kupangwa', labelEn: 'Harvested Green Leaves', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80' },
  ],
  'parachichi-njombe': [
    { labelSw: 'Parachichi Lililokatwa Laini', labelEn: 'Halved with Golden Pit', url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80' },
    { labelSw: 'Mazao ya Mti wa Hass', labelEn: 'Tree-fresh Hass Avocado', url: 'https://images.unsplash.com/photo-1519162584292-56dfc9eb5db4?auto=format&fit=crop&w=800&q=80' },
    { labelSw: 'Mchanganyiko wa Saladi', labelEn: 'Sliced Avocado Salad', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80' },
  ],
  'mchele-kyela': [
    { labelSw: 'Mchele wa Kyela Kwenye Bakuli', labelEn: 'Raw Polished Rice in Bowl', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' },
    { labelSw: 'Chembe za Mchele Mrefu', labelEn: 'Close-up Aromatic Grains', url: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80' },
    { labelSw: 'Wali Mweupe Ulioiva', labelEn: 'Steamed Fluffy Rice', url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80' },
  ],
};

export const ImageCustomizerModal: React.FC<ImageCustomizerModalProps> = ({
  product,
  language,
  onClose,
  onUpdateProductImage,
}) => {
  if (!product) return null;

  const currentActive = product.images[0];
  const [selectedUrl, setSelectedUrl] = useState<string>(currentActive);
  const [customInputUrl, setCustomInputUrl] = useState<string>('');
  const [previewError, setPreviewError] = useState<boolean>(false);

  // Fallback preset options if specific product has none
  const categoryAlternatives = PHOTO_ALTERNATIVES[product.id] || [
    { labelSw: 'Picha ya Kwanza Asilia', labelEn: 'Default Primary Photo', url: product.images[0] },
    ...(product.images[1] ? [{ labelSw: 'Picha ya Pili', labelEn: 'Second View Angle', url: product.images[1] }] : []),
    ...(product.images[2] ? [{ labelSw: 'Picha ya Tatu', labelEn: 'Third View Angle', url: product.images[2] }] : []),
  ];

  const handleApply = (urlToUse: string) => {
    onUpdateProductImage(product.id, urlToUse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'sw' ? 'Badilisha Picha ya Bidhaa' : 'Customize Product Photo'}</span>
            </div>
            <h2 className="text-lg font-bold text-stone-900">
              {language === 'sw' ? product.nameSw : product.nameEn}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Note explaining image variety */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed">
            <span className="font-bold">
              {language === 'sw' ? 'Hakikisho la Picha Tofauti: ' : 'Visual Variety Guarantee: '}
            </span>
            {language === 'sw'
              ? 'Tumechagua picha maalum zenye muonekano halisi na tofauti kwa kila zao ili zisionekane za kufanana. Chagua picha unayopendelea hapa chini au weka kiungo chako mwenyewe.'
              : 'Each product has dedicated, non-repetitive photographic assets capturing authentic harvest, market, and kitchen states. Select an alternative below or paste a custom photo URL.'}
          </div>

          {/* Current Active Preview */}
          <div>
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
              {language === 'sw' ? 'Picha Iliyochaguliwa Sasa' : 'Currently Selected Photo'}
            </div>
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={selectedUrl}
                alt="Selected preview"
                onError={() => setPreviewError(true)}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-stone-950/70 text-white text-[11px] px-2 py-0.5 rounded backdrop-blur-sm">
                {language === 'sw' ? product.origin : product.origin}
              </div>
            </div>
          </div>

          {/* Preset Distinct Alternatives */}
          <div>
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
              {language === 'sw' ? 'Chagua Kutoka Picha Zilizopo' : 'Choose From Distinct Photo Styles'}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categoryAlternatives.map((alt, idx) => {
                const isSelected = selectedUrl === alt.url;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedUrl(alt.url);
                      setPreviewError(false);
                    }}
                    className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                        : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <div className="aspect-[4/3] bg-stone-100">
                      <img
                        src={alt.url}
                        alt={alt.labelEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="p-2 bg-white text-[11px] font-medium text-stone-800 flex items-center justify-between">
                      <span className="truncate">{language === 'sw' ? alt.labelSw : alt.labelEn}</span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 ml-1">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Image URL Option */}
          <div className="pt-2 border-t border-stone-100">
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              {language === 'sw'
                ? 'Au weka kiungo (URL) cha picha mpya:'
                : 'Or enter custom image URL:'}
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={customInputUrl}
                onChange={(e) => setCustomInputUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                type="button"
                onClick={() => {
                  if (customInputUrl.trim()) {
                    setSelectedUrl(customInputUrl.trim());
                    setPreviewError(false);
                  }
                }}
                disabled={!customInputUrl.trim()}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 text-stone-800 text-xs font-semibold rounded-lg transition-colors"
              >
                {language === 'sw' ? 'Hakiki' : 'Preview'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            {language === 'sw' ? 'Ghairi' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={() => handleApply(selectedUrl)}
            className="px-5 py-2 text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{language === 'sw' ? 'Weka Picha Hii' : 'Apply Selected Photo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
