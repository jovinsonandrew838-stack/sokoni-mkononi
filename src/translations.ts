import { Language } from './types';

export const t = {
  sw: {
    brandName: 'SokoLetu Dar',
    tagline: 'Mfumo wa Masoko ya Dar & Kamisheni ya 5%',
    navMarketplace: 'Soko la Mboga (Nunua)',
    navCommission: 'Dashibodi ya Kamisheni ya 5% (Mapato Yako)',
    navVendors: 'Wauza Mboga wa Masoko',
    navEmbed: 'Msimbo wa Website (API)',

    // Header actions
    withdrawCommission: 'Toa Kamisheni Yako (5%)',
    addVendor: '+ Sajili Muuzaji Mpya',
    simulateOrder: '⚡ Jaribu Oda Mpya ya Soko',

    // Marketplace
    allMarkets: 'Masoko Yote ya Dar',
    marketKariakoo: 'Soko la Kariakoo',
    marketIlala: 'Soko la Ilala',
    marketTandale: 'Soko la Tandale',
    marketBuguruni: 'Soko la Buguruni',
    marketMabibo: 'Soko la Mabibo',
    marketKawe: 'Soko la Kawe',
    marketTegeta: 'Soko la Tegeta',

    addToBasket: 'Weka Kwenye Kapu',
    inBasket: 'Kwenye Kapu',
    vendorLabel: 'Muuzaji',
    stallLabel: 'Banda/Kizimba',
    freshGuarantee: 'Mboga Fresh Kutoka Shambani Kupitia Masoko ya Dar',

    // Cart & Split Preview
    cartTitle: 'Kapu la Mboga & Muhtasari wa Gawio',
    deliveryInDar: 'Usafiri wa Boda/Bajaji (Dar es Salaam)',
    commissionExplanation: 'Mfumo unachukua 5% moja kwa moja kwa ajili ya website na 95% inakwenda kwa muuzaji wa soko.',
    platformShare: 'Kamisheni Yako ya Website (5%)',
    vendorShare: 'Pesa ya Muuzaji wa Soko (95%)',
    riderDelivery: 'Gharama ya Usafiri (Boda)',
    totalToPay: 'Jumla ya Kulipa Mteja',
    checkoutBtn: 'Lipa kwa M-Pesa / Tigo / Airtel',

    // Commission Dashboard
    totalCommissionEarned: 'Kamisheni Yako ya 5% (Mapato Halisi)',
    grossMarketSales: 'Jumla ya Mauzo Yote ya Masoko',
    vendorDisbursed: 'Pesa Zilizolipwa kwa Wauzaji (95%)',
    pendingVendorPayouts: 'Inayosubiri Kutumwa kwa Wauzaji',
    activeVendorsCount: 'Wauza Mboga Waliosajiliwa Masokoni',

    // Ledger
    orderNumber: 'Namba ya Oda',
    customer: 'Mteja & Eneo la Dar',
    vendor: 'Muuzaji & Soko',
    grossAmount: 'Mauzo ya Mboga',
    yourCommission5Pct: 'Kamisheni Yako (5%)',
    vendorPayout95Pct: 'Pesa ya Muuzaji (95%)',
    paymentStatus: 'Hali ya Malipo',
    vendorPayoutAction: 'Kitendo cha Malipo ya Muuzaji',
    disburseNow: 'Lipa Muuzaji M-Pesa Sasa',
    disbursed: 'Amelipwa ✓',

    // Calculator card
    calcTitle: 'Kikokotoo cha Mapato Yako ya 5%',
    calcDesc: 'Angalia kiasi utakachoingiza kwa kila mauzo ya mboga mboga yanayofanyika kupitia website yako:',

    // Modals
    withdrawModalTitle: 'Toa Kamisheni Yako ya 5%',
    withdrawModalDesc: 'Hamisha mapato yako ya website kwenda kwenye M-Pesa, Tigo Pesa, au Benki (CRDB/NMB).',
    addVendorModalTitle: 'Sajili Muuzaji Mpya wa Soko la Dar',
    addVendorModalDesc: 'Weka taarifa za muuza mboga ili aweze kuweka bidhaa na kupokea 95% ya mauzo yake.',
  },
  en: {
    brandName: 'SokoLetu Dar',
    tagline: 'Dar Markets & 5% Platform Commission Engine',
    navMarketplace: 'Fresh Produce Market',
    navCommission: '5% Platform Commission Dashboard',
    navVendors: 'Market Vendors',
    navEmbed: 'Website Integration (API)',

    // Header actions
    withdrawCommission: 'Withdraw 5% Commission',
    addVendor: '+ Onboard New Vendor',
    simulateOrder: '⚡ Simulate Market Order',

    // Marketplace
    allMarkets: 'All Dar Markets',
    marketKariakoo: 'Kariakoo Market',
    marketIlala: 'Ilala Market',
    marketTandale: 'Tandale Market',
    marketBuguruni: 'Buguruni Market',
    marketMabibo: 'Mabibo Market',
    marketKawe: 'Kawe Market',
    marketTegeta: 'Tegeta Market',

    addToBasket: 'Add to Basket',
    inBasket: 'In Basket',
    vendorLabel: 'Vendor',
    stallLabel: 'Stall No.',
    freshGuarantee: 'Fresh Produce Direct from Dar es Salaam Markets',

    // Cart & Split Preview
    cartTitle: 'Produce Basket & Split Breakdown',
    deliveryInDar: 'Boda / Delivery within Dar es Salaam',
    commissionExplanation: 'The system automatically splits each sale: 5% platform commission to you and 95% net to the market seller.',
    platformShare: 'Your Website Commission (5%)',
    vendorShare: 'Market Vendor Payout (95%)',
    riderDelivery: 'Delivery Fee',
    totalToPay: 'Total Customer Payment',
    checkoutBtn: 'Pay via Mobile Money / Card',

    // Commission Dashboard
    totalCommissionEarned: 'Your 5% Commission (Platform Profit)',
    grossMarketSales: 'Total Gross Market Sales (GMV)',
    vendorDisbursed: 'Disbursed to Vendors (95%)',
    pendingVendorPayouts: 'Pending Vendor Payouts',
    activeVendorsCount: 'Registered Market Vendors',

    // Ledger
    orderNumber: 'Order Number',
    customer: 'Customer & Location',
    vendor: 'Vendor & Market',
    grossAmount: 'Produce Total',
    yourCommission5Pct: 'Your 5% Commission',
    vendorPayout95Pct: 'Vendor 95% Payout',
    paymentStatus: 'Payment Status',
    vendorPayoutAction: 'Vendor Payout Action',
    disburseNow: 'Pay Vendor via M-Pesa',
    disbursed: 'Disbursed ✓',

    // Calculator card
    calcTitle: '5% Revenue Projections Calculator',
    calcDesc: 'See how much revenue your website earns based on daily market sales volume:',

    // Modals
    withdrawModalTitle: 'Withdraw Your 5% Commission',
    withdrawModalDesc: 'Transfer your platform earnings directly to your M-Pesa, Tigo Pesa, or Bank account.',
    addVendorModalTitle: 'Onboard a New Dar Market Vendor',
    addVendorModalDesc: 'Register a market vendor so they can list produce and receive 95% of their sales.',
  }
};
