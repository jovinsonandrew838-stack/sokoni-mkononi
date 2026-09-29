import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, MapPin, Truck } from 'lucide-react';
import { CartItem, Language } from '../types';
import { DeliveryZone } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  language: Language;
  selectedZone: DeliveryZone;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  language,
  selectedZone,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeDeliveryThreshold = 60000;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : selectedZone.fee;
  const total = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-stone-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              <h2 className="font-extrabold text-stone-900 text-lg">
                {language === 'sw' ? 'Kikapu Chako' : 'Your Basket'}
              </h2>
              <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {items.reduce((sum, item) => sum + item.quantity, 0)} {language === 'sw' ? 'vitu' : 'items'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery notice */}
          <div className="bg-emerald-50 px-4 py-2.5 text-xs text-emerald-900 flex items-center justify-between border-b border-emerald-100">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="truncate">
                {language === 'sw' ? 'Eneo: ' : 'Zone: '} {selectedZone.name.split('(')[0]}
              </span>
            </div>
            <span className="font-bold shrink-0">
              {isFreeDelivery
                ? (language === 'sw' ? 'Bure!' : 'Free!')
                : `TSh ${selectedZone.fee.toLocaleString()}`}
            </span>
          </div>

          {/* Free delivery progress */}
          {subtotal < freeDeliveryThreshold && (
            <div className="bg-amber-50 px-4 py-2 text-[11px] text-amber-900 border-b border-amber-100">
              {language === 'sw' ? (
                <span>
                  Bado <strong>TSh {(freeDeliveryThreshold - subtotal).toLocaleString()}</strong> kupata usafirishaji wa BURE!
                </span>
              ) : (
                <span>
                  Add <strong>TSh {(freeDeliveryThreshold - subtotal).toLocaleString()}</strong> more for FREE delivery!
                </span>
              )}
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <ShoppingBag className="w-16 h-16 stroke-1 text-stone-300 mb-3" />
                <p className="text-stone-700 font-bold text-base mb-1">
                  {language === 'sw' ? 'Kikapu chako kiko tupu' : 'Your basket is empty'}
                </p>
                <p className="text-xs text-stone-500 max-w-xs mb-4">
                  {language === 'sw'
                    ? 'Chagua mazao safi ya shambani, matunda, nafaka na nyama uanze ununuzi.'
                    : 'Choose farm-fresh vegetables, fruits, grains and poultry to get started.'}
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors"
                >
                  {language === 'sw' ? 'Angalia Mazao Sokoni' : 'Browse Fresh Market'}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="py-3.5 flex gap-3 items-center">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.nameSw}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate">
                      {language === 'sw' ? item.product.nameSw : item.product.nameEn}
                    </h4>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      TSh {item.product.price.toLocaleString()} / {language === 'sw' ? item.product.unit : item.product.unitEn}
                    </div>

                    {/* Stepper & Line Price */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs sm:text-sm font-extrabold text-stone-900">
                          TSh {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-stone-400 hover:text-red-600 transition-colors p-1"
                          title="Ondoa bidhaa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>{language === 'sw' ? 'Jumla ya Bidhaa' : 'Subtotal'}</span>
                  <span className="font-semibold text-stone-900">TSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'sw' ? 'Gharama ya Usafirishaji' : 'Delivery Fee'}</span>
                  <span className="font-semibold text-stone-900">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">{language === 'sw' ? 'Bure' : 'Free'}</span>
                    ) : (
                      `TSh ${deliveryFee.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm sm:text-base font-black text-stone-900">
                  <span>{language === 'sw' ? 'Jumla Kuu' : 'Total Amount'}</span>
                  <span className="text-emerald-800">TSh {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onProceedToCheckout}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
              >
                <span>{language === 'sw' ? 'Endelea na Malipo' : 'Proceed to Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'sw' ? 'Lipa kwa M-Pesa / Tigo Pesa' : 'Pay via M-Pesa / Tigo Pesa'}</span>
                </span>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-stone-400 hover:text-red-600 underline font-normal"
                >
                  {language === 'sw' ? 'Futa Yote' : 'Clear Basket'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
