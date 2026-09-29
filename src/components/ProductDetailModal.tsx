import React, { useState } from 'react';
import { X, Star, MapPin, Clock, ShieldCheck, Plus, Minus, Check, RefreshCw, ChefHat, Heart } from 'lucide-react';
import { Product } from '../data/products';
import { Language } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  language: Language;
  quantityInCart: number;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onOpenImageCustomizer: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  language,
  quantityInCart,
  onClose,
  onAddToCart,
  onUpdateQuantity,
  onOpenImageCustomizer,
}) => {
  if (!product) return null;

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const activePhoto = product.images[activePhotoIndex] || product.images[0];

  const handleAdd = () => {
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-stone-200 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-stone-500 hover:text-stone-900 transition-colors shadow-sm"
          aria-label="Funga dirisha"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Visual Showcase */}
          <div className="p-4 sm:p-6 bg-stone-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
            <div>
              {/* Main Photo with smooth aspect ratio */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-stone-200 shadow-sm">
                <img
                  src={activePhoto}
                  alt={product.nameSw}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <div className="absolute top-3 left-3 bg-stone-900/80 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded">
                    {product.badge}
                  </div>
                )}
                {/* Photo Switcher Tool */}
                <button
                  type="button"
                  onClick={() => onOpenImageCustomizer(product)}
                  className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-stone-700 hover:text-emerald-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow border border-stone-200 flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'sw' ? 'Badilisha Picha' : 'Change Photo'}</span>
                </button>
              </div>

              {/* Thumbnails to verify photo variety */}
              {product.images.length > 1 && (
                <div className="mt-3 flex items-center gap-2">
                  {product.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        activePhotoIndex === idx
                          ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                          : 'border-stone-200 hover:border-stone-400 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`View ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quality Assurance note */}
            <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center gap-2 text-xs text-stone-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {language === 'sw'
                  ? 'Kikaguzi cha ubora: Mazao yanakaguliwa kabla ya kukabidhiwa.'
                  : 'Quality checked: Inspected by farm leads before delivery.'}
              </span>
            </div>
          </div>

          {/* Details & Action */}
          <div className="p-5 sm:p-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Origin & Freshness metadata */}
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  {product.origin}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  {language === 'sw' ? product.freshness : product.freshnessEn}
                </span>
              </div>

              {/* Title & Price */}
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
                  {language === 'sw' ? product.nameSw : product.nameEn}
                </h1>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-stone-900 tracking-tight">
                    TSh {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-stone-400 line-through">
                      TSh {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-xs text-stone-500">
                    / {language === 'sw' ? product.unit : product.unitEn}
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5 text-xs text-stone-600">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400'
                          : 'fill-stone-200 text-stone-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-stone-900">{product.rating}</span>
                <span className="text-stone-400">({product.reviewsCount} {language === 'sw' ? 'tathmini' : 'reviews'})</span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {language === 'sw' ? product.descriptionSw : product.descriptionEn}
              </p>

              {/* Cooking Tip if available */}
              {(product.cookingTipSw || product.cookingTipEn) && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs text-stone-800">
                  <div className="font-bold flex items-center gap-1.5 text-amber-900 mb-1">
                    <ChefHat className="w-3.5 h-3.5 text-amber-700" />
                    <span>{language === 'sw' ? 'Ushauri wa Mpishi' : 'Chef’s Tip'}</span>
                  </div>
                  <p className="text-stone-700">
                    {language === 'sw' ? product.cookingTipSw : product.cookingTipEn}
                  </p>
                </div>
              )}

              {/* Nutritional Highlights */}
              {product.nutritionalHighlights && (
                <div className="text-xs text-stone-600">
                  <span className="font-bold text-stone-800">
                    {language === 'sw' ? 'Faida za Kiafya: ' : 'Nutritional Highlights: '}
                  </span>
                  <span>{product.nutritionalHighlights.join(' · ')}</span>
                </div>
              )}
            </div>

            {/* Bottom Add to Cart CTA */}
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
              <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(product.id, Math.max(0, quantityInCart - 1))}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-stone-700 hover:bg-white hover:text-stone-900 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-black text-stone-900">
                  {quantityInCart}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (quantityInCart === 0) {
                      handleAdd();
                    } else {
                      onUpdateQuantity(product.id, quantityInCart + 1);
                    }
                  }}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-stone-700 hover:bg-white hover:text-stone-900 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 py-3 px-5 rounded-xl font-bold text-sm bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{language === 'sw' ? 'Imeongezwa Kikapuni' : 'Added to Basket'}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>
                      {language === 'sw'
                        ? `Ongeza Kikapuni (TSh ${(product.price * Math.max(1, quantityInCart)).toLocaleString()})`
                        : `Add to Cart (TSh ${(product.price * Math.max(1, quantityInCart)).toLocaleString()})`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
