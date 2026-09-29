/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Currency,
  Language,
  MarketplaceOrder,
  PayoutRecord,
  ProduceItem,
  Vendor,
} from './types';
import {
  INITIAL_VENDORS,
  INITIAL_PRODUCE,
  INITIAL_ORDERS,
  INITIAL_PAYOUT_HISTORY,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { MarketplaceView } from './components/Marketplace/MarketplaceView';
import { CommissionDashboard } from './components/CommissionEngine/CommissionDashboard';
import { VendorDirectoryView } from './components/Vendors/VendorDirectoryView';
import { MarketplaceCheckoutModal } from './components/Marketplace/MarketplaceCheckoutModal';
import { PayoutModal } from './components/Dashboard/PayoutModal';
import { AddVendorModal } from './components/Vendors/AddVendorModal';
import { WebsiteEmbedModal } from './components/Dashboard/WebsiteEmbedModal';
import { generateRef } from './utils/formatters';
import { sound } from './utils/audio';

export default function App() {
  const [lang, setLang] = useState<Language>('sw');
  const [currency, setCurrency] = useState<Currency>('TZS');
  const [currentTab, setCurrentTab] = useState<'marketplace' | 'commission' | 'vendors'>('marketplace');

  // Persistence
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem('soko_vendors');
    return saved ? JSON.parse(saved) : INITIAL_VENDORS;
  });

  const [produceList] = useState<ProduceItem[]>(INITIAL_PRODUCE);

  const [orders, setOrders] = useState<MarketplaceOrder[]>(() => {
    const saved = localStorage.getItem('soko_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [payouts, setPayouts] = useState<PayoutRecord[]>(() => {
    const saved = localStorage.getItem('soko_payouts');
    return saved ? JSON.parse(saved) : INITIAL_PAYOUT_HISTORY;
  });

  const [cart, setCart] = useState<ProduceItem[]>(() => [
    INITIAL_PRODUCE[0], // Pre-populate 1 item so users immediately see the 5% split in action!
  ]);

  // Modals
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPayoutOpen, setIsPayoutOpen] = useState(false);
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('soko_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('soko_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('soko_payouts', JSON.stringify(payouts));
  }, [payouts]);

  // Calculate 5% Commission Available
  const totalCommissionEarned5PctTZS = orders
    .filter((o) => o.status === 'completed')
    .reduce((acc, o) => acc + o.platformCommission5PctTZS, 0);

  const totalOwnerWithdrawnTZS = payouts
    .filter((po) => po.recipientType === 'platform_owner' && po.status === 'completed')
    .reduce((acc, po) => acc + po.amountTZS, 0);

  const availableCommissionTZS = Math.max(0, totalCommissionEarned5PctTZS - totalOwnerWithdrawnTZS);

  // Handlers
  const handleOrderCompleted = (newOrder: MarketplaceOrder) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Update vendor sales stats
    setVendors((prev) =>
      prev.map((v) => {
        const itemForThisVendor = newOrder.items.find((i) => i.vendorId === v.id);
        if (itemForThisVendor) {
          return {
            ...v,
            totalSalesCount: v.totalSalesCount + 1,
            totalSoldTZS: v.totalSoldTZS + newOrder.grossItemsTZS,
            totalNetEarned95TZS: v.totalNetEarned95TZS + newOrder.vendorNet95PctTZS,
            pendingPayoutTZS: v.pendingPayoutTZS + newOrder.vendorNet95PctTZS,
          };
        }
        return v;
      })
    );

    setCart([]);
  };

  const handleDisburseVendor = (orderId: string) => {
    sound.playSuccess();
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, vendorPayoutStatus: 'disbursed' } : o))
    );
  };

  const handleConfirmPayout = (newPayout: PayoutRecord) => {
    setPayouts((prev) => [newPayout, ...prev]);
  };

  const handleAddVendor = (newVendor: Vendor) => {
    setVendors((prev) => [newVendor, ...prev]);
  };

  // Quick simulate incoming market order from Dar
  const handleSimulateRandomOrder = () => {
    sound.playClick();
    const customers = [
      { name: 'Khadija Said', phone: '+255 754 990 112', loc: 'Sinza Palestina' },
      { name: 'Baraka Joseph', phone: '+255 713 224 810', loc: 'Kinondoni Morocco' },
      { name: 'Grace Mlay', phone: '+255 788 441 902', loc: 'Mikocheni Kwa Warioba' },
      { name: 'Hussein Ally', phone: '+255 622 391 004', loc: 'Kijitonyama Makumbusho' },
    ];
    const randCust = customers[Math.floor(Math.random() * customers.length)];
    const randProduce = produceList[Math.floor(Math.random() * produceList.length)];
    const gross = randProduce.priceTZS * 2;
    const comm5 = Math.round(gross * 0.05); // 5%
    const vendor95 = gross - comm5;         // 95%

    const simOrder: MarketplaceOrder = {
      id: `ord-${Date.now()}`,
      referenceNumber: generateRef('SK-DAR'),
      customerName: randCust.name,
      customerPhone: randCust.phone,
      deliveryLocation: randCust.loc,
      items: [{ ...randProduce, quantity: 2 }],
      grossItemsTZS: gross,
      platformCommission5PctTZS: comm5,
      vendorNet95PctTZS: vendor95,
      deliveryFeeTZS: 3000,
      totalPaidByCustomerTZS: gross + 3000,
      channel: (['mpesa', 'tigopesa', 'airtel'] as const)[Math.floor(Math.random() * 3)],
      status: 'completed',
      vendorPayoutStatus: 'pending',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      timestamp: Date.now(),
      operatorRef: `MP${Math.floor(100000 + Math.random() * 900000)}.TZ`,
    };

    handleOrderCompleted(simOrder);
    sound.playSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Bar with 3-Zone contract */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        currency={currency}
        setCurrency={setCurrency}
        onOpenEmbedModal={() => setIsEmbedOpen(true)}
        onOpenPayoutModal={() => setIsPayoutOpen(true)}
        onSimulateOrder={handleSimulateRandomOrder}
        totalCommission5PctTZS={availableCommissionTZS}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentTab === 'marketplace' && (
          <MarketplaceView
            produceList={produceList}
            cart={cart}
            setCart={setCart}
            vendors={vendors}
            currency={currency}
            lang={lang}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
          />
        )}

        {currentTab === 'commission' && (
          <CommissionDashboard
            orders={orders}
            vendors={vendors}
            currency={currency}
            lang={lang}
            onOpenPayoutModal={() => setIsPayoutOpen(true)}
            onOpenAddVendorModal={() => setIsAddVendorOpen(true)}
            onDisburseVendor={handleDisburseVendor}
          />
        )}

        {currentTab === 'vendors' && (
          <VendorDirectoryView
            vendors={vendors}
            currency={currency}
            lang={lang}
            onOpenAddVendorModal={() => setIsAddVendorOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      {isCheckoutOpen && (
        <MarketplaceCheckoutModal
          cart={cart}
          currency={currency}
          lang={lang}
          onSuccess={handleOrderCompleted}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}

      {isPayoutOpen && (
        <PayoutModal
          availableBalanceTZS={availableCommissionTZS}
          onConfirmPayout={handleConfirmPayout}
          onClose={() => setIsPayoutOpen(false)}
          lang={lang}
        />
      )}

      {isAddVendorOpen && (
        <AddVendorModal
          onAddVendor={handleAddVendor}
          onClose={() => setIsAddVendorOpen(false)}
          lang={lang}
        />
      )}

      {isEmbedOpen && (
        <WebsiteEmbedModal
          onClose={() => setIsEmbedOpen(false)}
          lang={lang}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">SokoLetu Dar</span>
            <span aria-hidden="true">·</span>
            <span>{lang === 'sw' ? 'Mfumo wa Gawio la 5% kwa Masoko ya Dar es Salaam' : 'Dar Markets 5% Split Engine'}</span>
            <span aria-hidden="true">·</span>
            <span>Kariakoo, Ilala, Tandale & Buguruni</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsEmbedOpen(true)}
              className="hover:text-slate-800 cursor-pointer"
            >
              {lang === 'sw' ? 'Msimbo wa Kuunganisha (API)' : 'Marketplace API'}
            </button>
            <span aria-hidden="true">·</span>
            <span>M-Pesa · Tigo Pesa · Airtel Money</span>
            <span aria-hidden="true">·</span>
            <span>© 2026 SokoLetu</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
