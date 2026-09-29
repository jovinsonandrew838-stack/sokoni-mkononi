import React, { useState } from 'react';
import { Plus, Minus, Check, Star, RefreshCw, Eye, Sparkles } from 'lucide-react';
import { Product } from '../data/products';
import { Language } from '../types';

interface ProductCardProps {
  product: Product;
  language: Language;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onOpenDetails: (product: Product) => void;
  onOpenImageCustomizer: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  onOpenDetails,
  onOpenImageCustomizer,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const currentImage = product.images[activeImageIndex] || product.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateQuantity(product.id, quantityInCart + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateQuantity(product.id, Math.max(0, quantityInCart - 1));
  };

  const handleImageSwitch = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setActiveImageIndex(index);
    setImageError(false);
  };

  const handleOpenCustomizer = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenImageCustomizer(product);
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <img
          src={
            imageError
              ? 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
              : currentImage
          }
          alt={language === 'sw' ? product.nameSw : product.nameEn}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Highlight Tag - Non-pill subtle banner */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 bg-stone-900/85 backdrop-blur-sm text-amber-300 text-[11px] font-semibold px-2 py-0.5 rounded">
            {product.badge}
          </div>
        )}

        {/* Change Image / Image Variety Button */}
        <button
          type="button"
          onClick={handleOpenCustomizer}
          title={language === 'sw' ? 'Badilisha au chagua picha nyingine ya bidhaa hii' : 'Switch or customize photo for this item'}
          className="absolute top-2.5 right-2.5 bg-white/90 hover:bg-white text-stone-700 hover:text-emerald-700 p-1.5 rounded-lg shadow-sm border border-stone-200/80 transition-all opacity-90 group-hover:opacity-100 flex items-center gap-1 text-[11px] font-medium"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline text-[10px] font-medium text-stone-600">
            {language === 'sw' ? 'Picha' : 'Photo'}
          </span>
        </button>

        {/* Photo view indicator dots / miniature switchers if product has alternate images */}
        {product.images.length > 1 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-stone-950/60 backdrop-blur-sm p-1 rounded-md">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => handleImageSwitch(e, idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeImageIndex === idx ? 'bg-amber-400 w-3.5' : 'bg-white/60 hover:bg-white'
                }`}
                title={`${language === 'sw' ? 'Mtazamo wa picha' : 'Photo view'} ${idx + 1}`}
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/75 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
          <Eye className="w-3 h-3" />
          <span>{language === 'sw' ? 'Tazama zaidi' : 'Quick view'}</span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata - Zero Pill Discipline: quiet text with subtle dots */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1 font-normal">
            <span className="text-emerald-800 font-medium">{product.origin}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="truncate">{language === 'sw' ? product.freshness : product.freshnessEn}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {language === 'sw' ? product.nameSw : product.nameEn}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed font-normal">
            {language === 'sw' ? product.descriptionSw : product.descriptionEn}
          </p>
        </div>

        {/* Rating & Reviews */}
        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-stone-600">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-stone-800">{product.rating.toFixed(1)}</span>
            <span className="text-stone-400 text-[11px]">({product.reviewsCount})</span>
          </div>

          <div className="text-[11px] text-stone-500">
            {language === 'sw' ? `Kwa ${product.unit}` : `Per ${product.unitEn}`}
          </div>
        </div>

        {/* Price & Add to Cart Controls */}
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-stone-900 tracking-tight">
                TSh {product.price.toLocaleString()}
              </span>
            </div>
            {product.originalPrice && (
              <span className="text-[11px] text-stone-400 line-through">
                TSh {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add / Stepper Actions */}
          {quantityInCart === 0 ? (
            <button
              type="button"
              onClick={handleQuickAdd}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                justAdded
                  ? 'bg-emerald-800 text-white'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-95'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{language === 'sw' ? 'Imeongezwa' : 'Added'}</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'sw' ? 'Weka Kikapuni' : 'Add'}</span>
                </>
              )}
            </button>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-300"
            >
              <button
                type="button"
                onClick={handleDecrement}
                className="w-7 h-7 flex items-center justify-center rounded text-stone-700 hover:bg-white hover:text-stone-900 transition-colors"
                aria-label="Punguza idadi"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-xs font-bold text-stone-900">
                {quantityInCart}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                className="w-7 h-7 flex items-center justify-center rounded text-stone-700 hover:bg-white hover:text-stone-900 transition-colors"
                aria-label="Ongeza idadi"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
