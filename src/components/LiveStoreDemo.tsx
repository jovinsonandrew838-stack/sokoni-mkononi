/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DatabaseState, Product, Order, Vendor } from '../types';
import {
  ShoppingBag,
  Store,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  Phone,
  CreditCard,
  Plus,
  Minus
} from 'lucide-react';

interface LiveStoreDemoProps {
  db: DatabaseState;
  onCreateOrder: (
    order: Omit<Order, 'id' | 'created_at'>,
    items: Array<{ product_id: string; product_name: string; quantity: number; unit_price: number }>
  ) => void;
  onAddVendor: (vendor: Omit<Vendor, 'id' | 'registered_at'>) => void;
  onGoToExplorer: () => void;
}

export const LiveStoreDemo: React.FC<LiveStoreDemoProps> = ({
  db,
  onCreateOrder,
  onAddVendor,
  onGoToExplorer,
}) => {
  const [activeForm, setActiveForm] = useState<'order' | 'vendor'>('order');

  // Order form state
  const [selectedProductId, setSelectedProductId] = useState<string>(db.products[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(2);
  const [customerName, setCustomerName] = useState('Salma Bakari');
  const [phone, setPhone] = useState('0714 889 900');
  const [deliveryZone, setDeliveryZone] = useState('Kijitonyama');
  const [streetAddress, setStreetAddress] = useState('Barabara ya Ali Maua, Plot 34');
  const [paymentMethod, setPaymentMethod] = useState<Order['payment_method']>('mpesa');
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);

  // Vendor form state
  const [vendorBusiness, setVendorBusiness] = useState('Vyakula Asilia Kigamboni');
  const [vendorOwner, setVendorOwner] = useState('Mwanaidi Hamisi');
  const [vendorPhone, setVendorPhone] = useState('0787 654 321');
  const [vendorMarket, setVendorMarket] = useState('Soko la Kigamboni Ferry');
  const [vendorStall, setVendorStall] = useState('Fremu Na. 08');
  const [vendorPlan, setVendorPlan] = useState<Vendor['subscriptionPlan']>('pro');
  const [vendorSuccessMsg, setVendorSuccessMsg] = useState<string | null>(null);

  const selectedProduct = db.products.find((p) => p.id === selectedProductId) || db.products[0];

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const subtotal = selectedProduct.price * quantity;
    const deliveryFee = 3000;
    const total = subtotal + deliveryFee;

    onCreateOrder(
      {
        customer_name: customerName,
        phone,
        delivery_zone: deliveryZone,
        street_address: streetAddress,
        payment_method: paymentMethod,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        status: 'pending',
        notes: 'Oda ya moja kwa moja kupitia mfumo wa Sokoni Mkononi.',
      },
      [
        {
          product_id: selectedProduct.id,
          product_name: selectedProduct.name_sw,
          quantity,
          unit_price: selectedProduct.price,
        },
      ]
    );

    setOrderSuccessMsg(
      `Hongera! Oda ya TZS ${total.toLocaleString()} ya ${customerName} imehifadhiwa kwenye database!`
    );
    setTimeout(() => setOrderSuccessMsg(null), 5000);
  };

  const handleVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = vendorPlan === 'starter' ? 2000 : vendorPlan === 'pro' ? 5000 : 10000;
    onAddVendor({
      business_name: vendorBusiness,
      owner_name: vendorOwner,
      phone: vendorPhone,
      market_name: vendorMarket,
      stall_number: vendorStall,
      category: 'Mboga na Matunda',
      city: 'Dar es Salaam',
      subscription_plan: vendorPlan,
      subscription_price_tzs: price,
      status: 'active',
    });

    setVendorSuccessMsg(
      `Mfanyabiashara "${vendorBusiness}" kutoka ${vendorMarket} amehifadhiwa rasmi kwenye database!`
    );
    setTimeout(() => setVendorSuccessMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Majaribio ya Moja kwa Moja (Live Database Sandbox)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Weka oda au sajili mfanyabiashara hapa ili uone jinsi database inavyopokea, inavyopunguza stoo ya bidhaa, na inavyohifadhi kumbukumbu bila kupoteza chochote.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveForm('order')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeForm === 'order'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Agiza Bidhaa (Order)
          </button>
          <button
            onClick={() => setActiveForm('vendor')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeForm === 'vendor'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Sajili Muuzaji (Vendor)
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {(orderSuccessMsg || vendorSuccessMsg) && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{orderSuccessMsg || vendorSuccessMsg}</span>
          </div>
          <button
            onClick={onGoToExplorer}
            className="underline hover:text-emerald-950 font-bold ml-4 shrink-0"
          >
            Tazama Kwenye Majedwali &rarr;
          </button>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 max-w-2xl mx-auto">
        {activeForm === 'order' ? (
          <form onSubmit={handleOrderSubmit} className="space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-indigo-600" />
                Fomu ya Kuweka Oda (Simulate Order)
              </span>
              <span className="text-[11px] text-slate-400">Inaandika kwenye `orders` & `order_items`</span>
            </div>

            {/* Select Product */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">
                Chagua Bidhaa ya Kuagiza:
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-indigo-500 font-medium"
              >
                {db.products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name_sw} — TZS {p.price.toLocaleString()} ({p.unit}) [Stoo: {p.stock_quantity}]
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-700">Idadi (Quantity):</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-sm font-mono text-slate-900 w-6 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Jina la Mteja</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nambari ya Simu</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Eneo la Kuletewa</label>
                <select
                  value={deliveryZone}
                  onChange={(e) => setDeliveryZone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500"
                >
                  <option value="Kijitonyama">Kijitonyama</option>
                  <option value="Mikocheni">Mikocheni</option>
                  <option value="Sinza">Sinza</option>
                  <option value="Masaki / Oysterbay">Masaki / Oysterbay</option>
                  <option value="Kariakoo & Posta">Kariakoo & Posta</option>
                  <option value="Mbezi Beach">Mbezi Beach</option>
                  <option value="Tegeta">Tegeta</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Njia ya Malipo</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500 uppercase"
                >
                  <option value="mpesa">M-Pesa</option>
                  <option value="tigopesa">Tigo Pesa</option>
                  <option value="airtel">Airtel Money</option>
                  <option value="halopesa">HaloPesa</option>
                  <option value="cash">Pesa Taslimu (Cash)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mtaa na Namba ya Nyumba</label>
              <input
                type="text"
                required
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500"
              />
            </div>

            {/* Price calculation summary */}
            {selectedProduct && (
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-slate-600 block text-[11px]">Jumla ya Malipo (pamoja na nauli):</span>
                  <span className="text-base font-extrabold text-indigo-950">
                    TZS {(selectedProduct.price * quantity + 3000).toLocaleString()}
                  </span>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  Agiza & Hifadhi Kwenye DB
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </form>
        ) : (
          <form onSubmit={handleVendorSubmit} className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Store className="w-4 h-4 text-indigo-600" />
                Usajili wa Mfanyabiashara wa Soko (Vendor Onboarding)
              </span>
              <span className="text-[11px] text-slate-400">Inaandika kwenye `vendors` table</span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Jina la Biashara / Fremu
              </label>
              <input
                type="text"
                required
                value={vendorBusiness}
                onChange={(e) => setVendorBusiness(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Jina la Mmiliki</label>
                <input
                  type="text"
                  required
                  value={vendorOwner}
                  onChange={(e) => setVendorOwner(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Namba ya Simu</label>
                <input
                  type="text"
                  required
                  value={vendorPhone}
                  onChange={(e) => setVendorPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Soko Kuu</label>
                <select
                  value={vendorMarket}
                  onChange={(e) => setVendorMarket(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500"
                >
                  <option value="Soko Kuu la Kariakoo">Soko Kuu la Kariakoo</option>
                  <option value="Soko la Tandale">Soko la Tandale</option>
                  <option value="Soko la Ilala (Boma)">Soko la Ilala (Boma)</option>
                  <option value="Soko la Buguruni">Soko la Buguruni</option>
                  <option value="Soko la Kigamboni Ferry">Soko la Kigamboni Ferry</option>
                  <option value="Soko la Kisutu">Soko la Kisutu</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Fremu / Kibanda</label>
                <input
                  type="text"
                  value={vendorStall}
                  onChange={(e) => setVendorStall(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Kifurushi (Plan)</label>
              <select
                value={vendorPlan}
                onChange={(e) => setVendorPlan(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500"
              >
                <option value="starter">Starter Plan (TZS 2,000 / mwezi)</option>
                <option value="pro">Pro Plan (TZS 5,000 / mwezi)</option>
                <option value="vip">VIP Plan (TZS 10,000 / mwezi)</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                Sajili Mfanyabiashara kwenye Database
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
