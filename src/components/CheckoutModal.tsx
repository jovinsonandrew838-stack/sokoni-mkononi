import React, { useState } from 'react';
import { X, Check, ShieldCheck, Phone, MapPin, Truck, CreditCard, Sparkles, ArrowLeft } from 'lucide-react';
import { CartItem, Language, OrderDetails } from '../types';
import { DELIVERY_ZONES, DeliveryZone } from '../data/products';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  selectedZone: DeliveryZone;
  language: Language;
  onOrderSuccess: (order: OrderDetails) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  selectedZone: initialZone,
  language,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [zone, setZone] = useState<DeliveryZone>(initialZone);
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('express');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'tigopesa' | 'airtel' | 'halopesa' | 'cash'>('mpesa');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'form' | 'payment_prompt' | 'success'>('form');
  const [createdOrder, setCreatedOrder] = useState<OrderDetails | null>(null);

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeDelivery = subtotal >= 60000;
  const deliveryFee = isFreeDelivery ? 0 : zone.fee;
  const total = subtotal + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !streetAddress.trim()) {
      alert(language === 'sw' ? 'Tafadhali jaza taarifa zote muhimu.' : 'Please fill all required fields.');
      return;
    }

    setIsProcessing(true);
    setStep('payment_prompt');

    // Simulate mobile money push notification or COD confirmation
    setTimeout(() => {
      setIsProcessing(false);
      const newOrder: OrderDetails = {
        orderId: `SMK-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName,
        phone,
        deliveryZone: zone.name,
        streetAddress,
        paymentMethod,
        items,
        subtotal,
        deliveryFee,
        total,
        notes,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setCreatedOrder(newOrder);
      setStep('success');
      onOrderSuccess(newOrder);
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-stone-200 shadow-2xl relative">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
              SM
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-base sm:text-lg">
                {step === 'success'
                  ? (language === 'sw' ? 'Agizo Limethibitishwa!' : 'Order Confirmed!')
                  : (language === 'sw' ? 'Kamilisha Agizo Lako' : 'Complete Your Order')}
              </h3>
              <p className="text-xs text-stone-500">
                {language === 'sw' ? 'Sokoni Mkononi Fast Express' : 'Fast Fresh Delivery'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6">
          {step === 'form' && (
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Order Summary Pill */}
              <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-3 flex justify-between items-center text-xs">
                <div>
                  <span className="text-emerald-950 font-bold">
                    {items.length} {language === 'sw' ? 'Aina ya Mazao' : 'Items'}
                  </span>
                  <span className="text-emerald-800 ml-1.5">
                    ({items.reduce((s, i) => s + i.quantity, 0)} {language === 'sw' ? 'jumla' : 'total'})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-stone-500 mr-1">{language === 'sw' ? 'Jumla:' : 'Total:'}</span>
                  <span className="font-black text-emerald-900 text-sm">
                    TSh {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  {language === 'sw' ? '1. Taarifa za Mpokeaji' : '1. Recipient Details'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      {language === 'sw' ? 'Jina Kamili *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="mf. Jovin Andrew"
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      {language === 'sw' ? 'Namba ya Simu (M-Pesa / Tigo) *' : 'Mobile Number *'}
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0704 205 872"
                        className="w-full pl-8 pr-3 py-2 text-xs border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                      <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address & Zone */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <div className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  {language === 'sw' ? '2. Eneo la Kupelekewa' : '2. Delivery Location'}
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {language === 'sw' ? 'Wilaya / Mkoa' : 'Delivery Zone'}
                  </label>
                  <select
                    value={zone.id}
                    onChange={(e) => {
                      const found = DELIVERY_ZONES.find((z) => z.id === e.target.value);
                      if (found) setZone(found);
                    }}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {DELIVERY_ZONES.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name} - TSh {z.fee.toLocaleString()} ({z.estimatedHours})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {language === 'sw' ? 'Mtaa / Nyumba / Alama Iliyo Karibu *' : 'Street / House / Landmark *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder={
                      language === 'sw'
                        ? 'mf. Sinza Mori, Karibu na Kanisa la KKKT, Nyumba namba 14'
                        : 'e.g. Masaki, Chole Road near Shoppers Plaza'
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                {/* Time slot option */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setDeliveryTimeSlot('express')}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      deliveryTimeSlot === 'express'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <Truck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{language === 'sw' ? 'Express (Haraka)' : 'Express'}</span>
                    </div>
                    <span className="text-[11px] text-stone-500 mt-0.5 block">
                      {zone.estimatedHours}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryTimeSlot('tomorrow')}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      deliveryTimeSlot === 'tomorrow'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{language === 'sw' ? 'Kesho Asubuhi' : 'Morning Slot'}</span>
                    </div>
                    <span className="text-[11px] text-stone-500 mt-0.5 block">
                      {language === 'sw' ? 'Saa 1:00 - 3:00 Asubuhi' : '7:00 AM - 9:00 AM'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  {language === 'sw' ? '3. Njia ya Malipo' : '3. Payment Method'}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'mpesa', name: 'M-Pesa (Vodacom)', color: 'text-red-600' },
                    { id: 'tigopesa', name: 'Tigo Pesa (Mixx)', color: 'text-blue-600' },
                    { id: 'airtel', name: 'Airtel Money', color: 'text-red-500' },
                    { id: 'halopesa', name: 'Halopesa', color: 'text-orange-600' },
                    { id: 'cash', name: 'Lipa Unapopokea (COD)', color: 'text-emerald-700' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                        paymentMethod === method.id
                          ? 'border-emerald-600 bg-emerald-50/60 font-bold text-stone-900 ring-1 ring-emerald-500'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span className="truncate">{method.name}</span>
                      {paymentMethod === method.id && (
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special instructions */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {language === 'sw' ? 'Maelekezo Maalum kwa Mpishi au Dereva (Hiari)' : 'Special Instructions (Optional)'}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    language === 'sw'
                      ? 'mf. Panga nyanya zisizobonyea sana, samaki asafishwe vizuri.'
                      : 'e.g. Choose firm tomatoes, please ensure fish is scaled clean.'
                  }
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {language === 'sw'
                      ? `Thibitisha na Ulipe TSh ${total.toLocaleString()}`
                      : `Confirm & Pay TSh ${total.toLocaleString()}`}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* Payment Prompt Simulation Screen */}
          {step === 'payment_prompt' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center animate-spin">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="font-extrabold text-stone-900 text-lg">
                {language === 'sw' ? 'Ombi la Malipo Linatumwa kwenye Simu Yako...' : 'Sending Mobile Payment Prompt...'}
              </h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                {language === 'sw'
                  ? `Tafadhali angalia simu namba ${phone}. Ujumbe wa ${paymentMethod.toUpperCase()} utatokea ukiomba PIN yako ili kukamilisha malipo ya TSh ${total.toLocaleString()}.`
                  : `Please check your mobile phone (${phone}). A secure push prompt will ask for your PIN to authorize TSh ${total.toLocaleString()}.`}
              </p>
              <div className="pt-4 text-xs font-semibold text-emerald-800 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>{language === 'sw' ? 'Tunathibitisha na mtandao...' : 'Connecting to network...'}</span>
              </div>
            </div>
          )}

          {/* Success Screen */}
          {step === 'success' && createdOrder && (
            <div className="space-y-5 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-lg">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h4 className="font-black text-stone-900 text-xl">
                  {language === 'sw' ? 'Ahsante Sana!' : 'Order Placed Successfully!'}
                </h4>
                <p className="text-xs text-stone-600 mt-1">
                  {language === 'sw'
                    ? 'Agizo lako limepokelewa na timu yetu ya soko inaanza kuliandaa sasa hivi.'
                    : 'Your order is confirmed and our market curators are picking fresh items right now.'}
                </p>
              </div>

              {/* Order Card Receipt */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">{language === 'sw' ? 'Namba ya Agizo:' : 'Order ID:'}</span>
                  <span className="font-mono font-bold text-stone-900">{createdOrder.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{language === 'sw' ? 'Mpokeaji:' : 'Customer:'}</span>
                  <span className="font-semibold text-stone-900">{createdOrder.customerName} ({createdOrder.phone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{language === 'sw' ? 'Eneo la Kushusha:' : 'Destination:'}</span>
                  <span className="font-semibold text-stone-900">{createdOrder.streetAddress}, {zone.name.split('(')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{language === 'sw' ? 'Njia ya Malipo:' : 'Payment:'}</span>
                  <span className="font-semibold text-stone-900 uppercase">{createdOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-2 font-bold text-sm">
                  <span>{language === 'sw' ? 'Jumla Iliyolipwa:' : 'Total Amount:'}</span>
                  <span className="text-emerald-800 font-black">TSh {createdOrder.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                >
                  {language === 'sw' ? 'Rudi Sokoni / Endelea na Manunuzi' : 'Continue Shopping'}
                </button>
                <a
                  href={`https://wa.me/255704205872?text=Habari%20Sokoni%20Mkononi,%20ninaulizia%20agizo%20langu%20namba%20${createdOrder.orderId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{language === 'sw' ? 'Fuatilia kwa WhatsApp' : 'Track via WhatsApp'}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
