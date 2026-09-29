import React, { useState } from 'react';
import {
  Currency,
  Language,
  MarketplaceOrder,
  PaymentChannel,
  ProduceItem,
} from '../../types';
import { t } from '../../translations';
import { formatMoney, generateRef } from '../../utils/formatters';
import { sound } from '../../utils/audio';

interface MarketplaceCheckoutModalProps {
  cart: ProduceItem[];
  currency: Currency;
  lang: Language;
  onSuccess: (order: MarketplaceOrder) => void;
  onClose: () => void;
}

export const MarketplaceCheckoutModal: React.FC<MarketplaceCheckoutModalProps> = ({
  cart,
  currency,
  lang,
  onSuccess,
  onClose,
}) => {
  const tr = t[lang];
  const [customerName, setCustomerName] = useState('Neema Mwambene');
  const [customerPhone, setCustomerPhone] = useState('754112390');
  const [deliveryLocation, setDeliveryLocation] = useState('Sinza Kijiweni (Mtaa wa Samaki)');
  const [channel, setChannel] = useState<PaymentChannel>('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessReceipt, setShowSuccessReceipt] = useState<MarketplaceOrder | null>(null);

  const grossProduceTZS = cart.reduce((acc, it) => acc + it.priceTZS * it.quantity, 0);
  const platformCommission5PctTZS = Math.round(grossProduceTZS * 0.05); // Exact 5% Platform Commission!
  const vendorNet95PctTZS = grossProduceTZS - platformCommission5PctTZS; // Exact 95% to Vendor!
  const deliveryFeeTZS = 3000;
  const totalPaidByCustomerTZS = grossProduceTZS + deliveryFeeTZS;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    sound.playUssdBeep();

    setTimeout(() => {
      sound.playSuccess();
      const newOrder: MarketplaceOrder = {
        id: `ord-${Date.now()}`,
        referenceNumber: generateRef('SK-DAR'),
        customerName: customerName.trim(),
        customerPhone: `+255 ${customerPhone.trim()}`,
        deliveryLocation: deliveryLocation.trim(),
        items: [...cart],
        grossItemsTZS: grossProduceTZS,
        platformCommission5PctTZS,
        vendorNet95PctTZS,
        deliveryFeeTZS,
        totalPaidByCustomerTZS,
        channel,
        status: 'completed',
        vendorPayoutStatus: 'pending',
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        timestamp: Date.now(),
        operatorRef: `MP${Math.floor(100000 + Math.random() * 900000)}.TZ`,
      };

      onSuccess(newOrder);
      setShowSuccessReceipt(newOrder);
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {!showSuccessReceipt ? (
          <div className="p-6 sm:p-7">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  {lang === 'sw' ? 'Malipo ya Mboga & Gawio la 5%' : 'Checkout & 5% Split Payment'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'sw'
                    ? 'Lipa kwa simu yako ili oda ipelekwe sokoni kuandaliwa.'
                    : 'Pay securely via mobile money to disburse to market vendors.'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePay} className="mt-5 space-y-4">
              {/* Customer Info */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    {lang === 'sw' ? 'Jina la Mteja' : 'Customer Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    {lang === 'sw' ? 'Namba ya Simu ya Kulipia (M-Pesa / Tigo / Airtel)' : 'Phone Number'} *
                  </label>
                  <div className="flex rounded-xl border border-slate-300 overflow-hidden shadow-xs">
                    <span className="px-3 py-2 bg-slate-100 text-xs font-semibold text-slate-600 border-r border-slate-200">
                      +255
                    </span>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    {lang === 'sw' ? 'Eneo la Kuletewa (Dar es Salaam)' : 'Street / Delivery Landmark'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Payment Channel Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  {lang === 'sw' ? 'Chagua Njia ya Malipo' : 'Select Payment Method'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setChannel('mpesa');
                    }}
                    className={`p-2 rounded-xl border text-xs font-semibold text-center cursor-pointer ${
                      channel === 'mpesa' ? 'border-red-600 bg-red-50 text-red-900' : 'border-slate-200'
                    }`}
                  >
                    Vodacom M-Pesa
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setChannel('tigopesa');
                    }}
                    className={`p-2 rounded-xl border text-xs font-semibold text-center cursor-pointer ${
                      channel === 'tigopesa' ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-slate-200'
                    }`}
                  >
                    Tigo Pesa
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setChannel('airtel');
                    }}
                    className={`p-2 rounded-xl border text-xs font-semibold text-center cursor-pointer ${
                      channel === 'airtel' ? 'border-red-500 bg-red-50 text-red-900' : 'border-slate-200'
                    }`}
                  >
                    Airtel Money
                  </button>
                </div>
              </div>

              {/* Summary with 5% Split Callout */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{lang === 'sw' ? 'Jumla ya Mboga za Soko:' : 'Produce Total:'}</span>
                  <span className="font-mono">{formatMoney(grossProduceTZS, currency)}</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-semibold bg-emerald-100/60 p-1.5 rounded-lg">
                  <span>💰 {lang === 'sw' ? 'Kamisheni Yako ya Website (5%):' : 'Platform 5% Cut:'}</span>
                  <span className="font-mono">+{formatMoney(platformCommission5PctTZS, currency)}</span>
                </div>
                <div className="flex justify-between text-blue-800 font-semibold bg-blue-100/60 p-1.5 rounded-lg">
                  <span>🧺 {lang === 'sw' ? 'Inakwenda kwa Muuzaji (95%):' : 'Vendor 95% Payout:'}</span>
                  <span className="font-mono">{formatMoney(vendorNet95PctTZS, currency)}</span>
                </div>
                <div className="flex justify-between text-slate-500 pt-1 border-t border-slate-200">
                  <span>🛵 {lang === 'sw' ? 'Usafiri wa Boda Dar:' : 'Delivery Fee:'}</span>
                  <span className="font-mono">{formatMoney(deliveryFeeTZS, currency)}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold text-sm pt-1 border-t border-slate-200">
                  <span>{lang === 'sw' ? 'Jumla ya Kulipa:' : 'Total Payable:'}</span>
                  <span className="font-mono text-emerald-700">
                    {formatMoney(totalPaidByCustomerTZS, currency)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>{lang === 'sw' ? 'Inatuma ombi la USSD kwenye simu...' : 'Sending USSD prompt...'}</span>
                  </>
                ) : (
                  <span>
                    {lang === 'sw'
                      ? `Thibitisha & Lipa ${formatMoney(totalPaidByCustomerTZS, currency)}`
                      : `Confirm & Pay ${formatMoney(totalPaidByCustomerTZS, currency)}`}
                  </span>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Success Split Receipt */
          <div className="p-6 sm:p-7 text-slate-900 space-y-4">
            <div className="text-center pb-4 border-b border-dashed border-slate-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600 font-bold mb-2">
                ✓
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                {lang === 'sw' ? 'Malipo Yamekamilika & Gawio la 5% Limewekwa!' : 'Payment Complete & 5% Split Executed!'}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Ref: {showSuccessReceipt.referenceNumber}
              </p>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-4 text-xs space-y-2 border border-emerald-100">
              <div className="flex justify-between font-bold text-emerald-950">
                <span>{lang === 'sw' ? 'Kamisheni Yako ya Website (5%):' : 'Platform 5% Profit:'}</span>
                <span className="font-mono text-emerald-700 text-sm">
                  +{formatMoney(showSuccessReceipt.platformCommission5PctTZS, currency)}
                </span>
              </div>
              <p className="text-[11px] text-emerald-700">
                {lang === 'sw'
                  ? 'Kiasi hiki kimeingizwa moja kwa moja kwenye Salio Lako la Website tayari kutoa.'
                  : 'Credited directly to your platform commission balance.'}
              </p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 text-xs space-y-2 border border-blue-100">
              <div className="flex justify-between font-bold text-blue-950">
                <span>{lang === 'sw' ? 'Pesa ya Muuza Mboga (95%):' : 'Vendor Net 95%:'}</span>
                <span className="font-mono text-blue-800 text-sm">
                  {formatMoney(showSuccessReceipt.vendorNet95PctTZS, currency)}
                </span>
              </div>
              <p className="text-[11px] text-blue-700">
                {lang === 'sw'
                  ? 'Imepelekwa kwa muuzaji wa soko kuandaa mboga za kupeleka kwa mteja.'
                  : 'Ready for market stall vendor order fulfillment.'}
              </p>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl cursor-pointer"
              >
                {lang === 'sw' ? 'Funga & Angalia Dashibodi ya Kamisheni' : 'Done & View Dashboard'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
