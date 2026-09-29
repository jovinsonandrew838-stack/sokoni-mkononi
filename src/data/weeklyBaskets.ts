import { Product } from './products';
import denguImg from '../assets/images/dengu_safi_1790499903949.jpg';
import nyamaNgombeImg from '../assets/images/nyama_ngombe_1790499914097.jpg';
import samakiSatoImg from '../assets/images/samaki_sato_1790499924384.jpg';
import tikitiImg from '../assets/images/tikiti_maji_1790500653569.jpg';
import supuNzitoImg from '../assets/images/supu_nzito_halisi_1790501400230.jpg';

export interface WeeklyBasketItem {
  nameSw: string;
  nameEn: string;
  qty: string;
}

export interface WeeklyBasket {
  id: string;
  nameSw: string;
  nameEn: string;
  householdSizeSw: string;
  householdSizeEn: string;
  price: number;
  originalPrice: number;
  savingsTZS: number;
  badgeSw: string;
  badgeEn: string;
  popular?: boolean;
  image: string;
  descriptionSw: string;
  descriptionEn: string;
  items: WeeklyBasketItem[];
  colorTheme: string;
}

export const WEEKLY_BASKETS: WeeklyBasket[] = [
  {
    id: 'kikapu-bajeti-wiki',
    nameSw: 'Kikapu cha Bajeti / Watu Binafsi',
    nameEn: 'Budget Saver / Bachelor Weekly Basket',
    householdSizeSw: 'Watu 1 - 2',
    householdSizeEn: '1 - 2 Persons',
    price: 18000,
    originalPrice: 23000,
    savingsTZS: 5000,
    badgeSw: 'Okoa TZS 5,000',
    badgeEn: 'Save TZS 5,000',
    popular: false,
    image: denguImg,
    colorTheme: 'border-stone-300 bg-white',
    descriptionSw: 'Kikapu chenye mahitaji yote ya msingi ya wiki kwa mwanafunzi au mtu anayeishi peke yake.',
    descriptionEn: 'Essential weekly grocery pack designed for single professionals and students.',
    items: [
      { nameSw: 'Mchele Safi wa Kyela', nameEn: 'Aromatic Kyela Rice', qty: 'Kilo 2' },
      { nameSw: 'Nyanya za Mshumaa', nameEn: 'Fresh Vine Tomatoes', qty: 'Kilo 1.5' },
      { nameSw: 'Vitunguu Maji Safi', nameEn: 'Clean Red Onions', qty: 'Kilo 1' },
      { nameSw: 'Maharage ya Njano ya Mbeya', nameEn: 'Mbeya Yellow Beans', qty: 'Kilo 1' },
      { nameSw: 'Mchicha / Sukuma Wiki Fresh', nameEn: 'Fresh Collard Greens', qty: 'Mafungu 3' },
      { nameSw: 'Ndizi Mbivu Tamu', nameEn: 'Sweet Bananas', qty: 'Kichala 1' },
    ],
  },
  {
    id: 'kikapu-matunda-afya',
    nameSw: 'Kikapu cha Afya, Matunda & Detox',
    nameEn: 'Vitality, Detox & Fresh Fruit Basket',
    householdSizeSw: 'Familia au Afya Binafsi',
    householdSizeEn: 'Health & Wellness',
    price: 28000,
    originalPrice: 35000,
    savingsTZS: 7000,
    badgeSw: 'Vitamini & Kinga',
    badgeEn: 'Immunity Boost',
    popular: false,
    image: tikitiImg,
    colorTheme: 'border-orange-300 bg-orange-50/30',
    descriptionSw: 'Mchanganyiko safi wa matunda ya shambani na viungo vya kuimarisha kinga ya mwili wiki nzima.',
    descriptionEn: 'Refreshing assortment of immunity-boosting local tropical fruits and raw honey.',
    items: [
      { nameSw: 'Tikiti Maji Tamu Zima', nameEn: 'Whole Sweet Watermelon', qty: '1 Kubwa' },
      { nameSw: 'Pasheni Safi za Iringa', nameEn: 'Iringa Sweet Passion Fruits', qty: 'Kilo 2' },
      { nameSw: 'Ndizi Mbivu za Bukoba', nameEn: 'Bukoba Ripened Bananas', qty: 'Vichala 2' },
      { nameSw: 'Tangawizi Mbichi ya Shambani', nameEn: 'Farm Fresh Ginger', qty: 'Nusu Kilo' },
      { nameSw: 'Ndimu & Limau za Pwani', nameEn: 'Fresh Coastal Lemons', qty: 'Fungu 1' },
      { nameSw: 'Asali Mbichi ya Tabora', nameEn: 'Raw Wild Tabora Honey', qty: 'Nusu Lita' },
    ],
  },
  {
    id: 'kikapu-supu-chemsha',
    nameSw: 'Kikapu cha Supu Nzito & Chemsha',
    nameEn: 'Immunity Stew & Broth Basket',
    householdSizeSw: 'Watu 3 - 4',
    householdSizeEn: '3 - 4 Persons',
    price: 35000,
    originalPrice: 42000,
    savingsTZS: 7000,
    badgeSw: 'Lishe Bora',
    badgeEn: 'High Nutrition',
    popular: false,
    image: supuNzitoImg,
    colorTheme: 'border-emerald-300 bg-stone-50',
    descriptionSw: 'Kikapu maalum cha kuchemsha supu ya kuku wa kienyeji na ndizi za kupika zenye afya na lishe bora.',
    descriptionEn: 'Specialized package for traditional nutritious chicken stew and plantains.',
    items: [
      { nameSw: 'Kuku wa Kienyeji Mzima', nameEn: 'Whole Free-Range Hen', qty: 'Kuku 1 Mzima' },
      { nameSw: 'Ndizi za Kupika / Bukoba', nameEn: 'Green Cooking Plantains', qty: 'Mkungu Nusu' },
      { nameSw: 'Tangawizi Mbichi', nameEn: 'Fresh Ginger Root', qty: 'Nusu Kilo' },
      { nameSw: 'Vitunguu Saumu', nameEn: 'Whole Garlic Bulbs', qty: 'Robo Kilo' },
      { nameSw: 'Karoti Safi & Pilipili Mtama', nameEn: 'Farm Carrots & Peppercorns', qty: 'Fungu 1' },
      { nameSw: 'Ndimu za Pwani', nameEn: 'Fresh Green Limes', qty: 'Mafungu 2' },
    ],
  },
  {
    id: 'kikapu-familia-wastani',
    nameSw: 'Kikapu cha Familia ya Kawaida',
    nameEn: 'Standard Household Family Basket',
    householdSizeSw: 'Watu 3 - 5',
    householdSizeEn: '3 - 5 Persons',
    price: 45000,
    originalPrice: 56000,
    savingsTZS: 11000,
    badgeSw: 'Kinachopendwa Zaidi ⭐',
    badgeEn: 'Most Popular ⭐',
    popular: true,
    image: nyamaNgombeImg,
    colorTheme: 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20',
    descriptionSw: 'Kikapu kikamilifu chenye nyama, nafaka, mboga za majani na viungo vya kupika milo yote ya familia kwa wiki nzima.',
    descriptionEn: 'The ultimate household weekly food basket with meats, greens, grains and pantry essentials.',
    items: [
      { nameSw: 'Nyama ya Ng\'ombe Fresh (Mchinjio)', nameEn: 'Fresh Butchery Beef', qty: 'Kilo 1' },
      { nameSw: 'Mchele wa Kyela Super Aromatic', nameEn: 'Super Kyela Rice', qty: 'Kilo 4' },
      { nameSw: 'Nyanya Fresh za Shambani', nameEn: 'Fresh Tomatoes', qty: 'Kilo 3' },
      { nameSw: 'Vitunguu Maji', nameEn: 'Dry Red Onions', qty: 'Kilo 2' },
      { nameSw: 'Mboga za Majani (Sukuma & Mchicha)', nameEn: 'Mixed Leafy Greens', qty: 'Mafungu 5' },
      { nameSw: 'Karoti & Hoho', nameEn: 'Carrots & Bell Peppers', qty: 'Kilo 1' },
      { nameSw: 'Nazi Kavu za Pwani', nameEn: 'Fresh Coastal Coconuts', qty: 'Nazi 2' },
      { nameSw: 'Mafuta Safi ya Alizeti Singida', nameEn: 'Pure Singida Sunflower Oil', qty: 'Lita 1' },
    ],
  },
  {
    id: 'kikapu-familia-kubwa-sherehe',
    nameSw: 'Kikapu Kikubwa cha Familia / Wikendi',
    nameEn: 'Mega Feast & Large Family Basket',
    householdSizeSw: 'Watu 6 - 10',
    householdSizeEn: '6 - 10 Persons',
    price: 75000,
    originalPrice: 92000,
    savingsTZS: 17000,
    badgeSw: 'Okoa TZS 17,000 🔥',
    badgeEn: 'Save TZS 17,000 🔥',
    popular: false,
    image: samakiSatoImg,
    colorTheme: 'border-amber-400 bg-amber-50/40',
    descriptionSw: 'Kikapu kizito cha familia kubwa chenye samaki wa Ziwa Victoria, nyama, kuku, mchele, unga na tenga la mboga.',
    descriptionEn: 'Heavy duty weekly feast basket packed with Lake Victoria fish, beef, chicken, grains and bulk produce.',
    items: [
      { nameSw: 'Nyama ya Ng\'ombe Fresh', nameEn: 'Tender Beef Cuts', qty: 'Kilo 2' },
      { nameSw: 'Samaki Sato Fresh wa Ziwa', nameEn: 'Fresh Lake Victoria Tilapia', qty: 'Samaki 2 Wakubwa' },
      { nameSw: 'Kuku wa Kienyeji Mzima', nameEn: 'Whole Free-Range Hen', qty: 'Kuku 1 Mzima' },
      { nameSw: 'Mchele wa Kyela Daraja la Kwanza', nameEn: 'Grade 1 Kyela Rice', qty: 'Kilo 6' },
      { nameSw: 'Unga Safi wa Sembe wa Mahindi', nameEn: 'Premium Maize Flour', qty: 'Kilo 5' },
      { nameSw: 'Nyanya za Mshumaa (Tenga la Kati)', nameEn: 'Vine Tomatoes Crate', qty: 'Kilo 5' },
      { nameSw: 'Vitunguu Maji vya Tandale', nameEn: 'Tandale Red Onions', qty: 'Kilo 3' },
      { nameSw: 'Dagaa Wasafi wa Kigoma', nameEn: 'Clean Kigoma Silver Fish', qty: 'Nusu Kilo' },
      { nameSw: 'Mafuta ya Alizeti Singida', nameEn: 'Singida Sunflower Oil', qty: 'Lita 2' },
      { nameSw: 'Tikiti Maji Kubwa Tamu', nameEn: 'Crisp Jumbo Watermelon', qty: '1 Kubwa' },
    ],
  },
];

export function weeklyBasketToProduct(basket: WeeklyBasket): Product {
  return {
    id: basket.id,
    nameSw: basket.nameSw,
    nameEn: basket.nameEn,
    category: 'vifurushi',
    price: basket.price,
    originalPrice: basket.originalPrice,
    unit: 'kikapu kizima cha wiki',
    unitEn: 'complete weekly bundle',
    origin: 'Masoko ya Dar & Shambani Direct',
    freshness: 'Imepangwa Asubuhi ya Leo',
    freshnessEn: 'Packed Fresh Today',
    rating: 5.0,
    reviewsCount: 140,
    inStock: true,
    images: [basket.image],
    descriptionSw: `${basket.descriptionSw} Yaliyomo: ${basket.items.map((i) => `${i.nameSw} (${i.qty})`).join(', ')}.`,
    descriptionEn: `${basket.descriptionEn} Includes: ${basket.items.map((i) => `${i.nameEn} (${i.qty})`).join(', ')}.`,
    badge: basket.badgeSw,
    nutritionalHighlights: basket.items.map((i) => `${i.nameSw}: ${i.qty}`),
  };
}
