/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ImageCustomizerModal } from './components/ImageCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { VendorRegistrationModal } from './components/VendorRegistrationModal';
import { PackagesModal } from './components/PackagesModal';
import { RecipesSection } from './components/RecipesSection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { PRODUCTS, DELIVERY_ZONES, DeliveryZone, Product } from './data/products';
import { CartItem, Language, OrderDetails, PackageTier, Vendor } from './types';
import { Sparkles, SlidersHorizontal, RefreshCw, CheckCircle2, ShoppingBag, MessageCircle } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('sw');
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<DeliveryZone>(DELIVERY_ZONES[0]);
  const [registeredVendors, setRegisteredVendors] = useState<Vendor[]>([
    {
      id: 'VND-1042',
      businessName: 'Genge la Mama Neema',
      ownerName: 'Neema Joseph',
      phone: '0704 205 872',
      marketName: 'Soko la Kigamboni Ferry',
      stallNumber: 'Fremu Na. 04, Mkabili wa Kivuko cha Ferry',
      category: 'mboga',
      city: 'Dar es Salaam',
      registeredAt: '2026-09-20',
      status: 'active',
      productsCount: 12,
      subscriptionPlan: 'pro',
      subscriptionPriceTZS: 5000,
      subscriptionBillingCycle: 'monthly',
      registrationFeePaid: true,
      registrationFeeTZS: 5000,
      paymentMethod: 'mpesa',
      paymentRef: 'MP260920.0911.A1',
    },
    {
      id: 'VND-2088',
      businessName: 'Mwaloni Fresh Fish Supply',
      ownerName: 'Hamisi Bakari',
      phone: '0655 444 333',
      marketName: 'Soko Kuu la Mwanza (Mwaloni)',
      stallNumber: 'Fremu 08, Eneo la Samaki',
      category: 'nyama',
      city: 'Mwanza',
      registeredAt: '2026-09-22',
      status: 'active',
      productsCount: 8,
      subscriptionPlan: 'vip',
      subscriptionPriceTZS: 10000,
      subscriptionBillingCycle: 'monthly',
      registrationFeePaid: true,
      registrationFeeTZS: 10000,
      paymentMethod: 'tigopesa',
      paymentRef: 'TP260922.1402.B2',
    },
  ]);

  // Modals state
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [customizerProduct, setCustomizerProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isPackagesModalOpen, setIsPackagesModalOpen] = useState(false);
  const [preselectedTier, setPreselectedTier] = useState<PackageTier>('starter');
  const [notification, setNotification] = useState<string | null>(null);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    const msg = language === 'sw'
      ? `${product.nameSw} imeongezwa kikapuni!`
      : `${product.nameEn} added to basket!`;
    triggerNotification(msg);
  };

  const handleAddMultipleToCart = (newProducts: Product[]) => {
    setCart((prev) => {
      let updated = [...prev];
      newProducts.forEach((p) => {
        const foundIndex = updated.findIndex((i) => i.product.id === p.id);
        if (foundIndex >= 0) {
          updated[foundIndex] = {
            ...updated[foundIndex],
            quantity: updated[foundIndex].quantity + 1,
          };
        } else {
          updated.push({ product: p, quantity: 1 });
        }
      });
      return updated;
    });

    const msg = language === 'sw'
      ? `Viungo vya pishi vimeongezwa kikapuni!`
      : `Recipe ingredients added to basket!`;
    triggerNotification(msg);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const triggerNotification = (text: string) => {
    setNotification(text);
    setTimeout(() => {
      setNotification((curr) => (curr === text ? null : curr));
    }, 2800);
  };

  // Live image updater directly responding to user request
  const handleUpdateProductImage = (productId: string, newImageUrl: string) => {
    setProductsList((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const reorderedImages = [newImageUrl, ...prod.images.filter((img) => img !== newImageUrl)];
          return {
            ...prod,
            images: reorderedImages,
          };
        }
        return prod;
      })
    );

    // Also update any currently open detail modal
    if (detailProduct && detailProduct.id === productId) {
      setDetailProduct((curr) =>
        curr
          ? {
              ...curr,
              images: [newImageUrl, ...curr.images.filter((img) => img !== newImageUrl)],
            }
          : null
      );
    }

    triggerNotification(
      language === 'sw'
        ? 'Picha ya zao hili imesasishwa kikamilifu!'
        : 'Product photo updated successfully!'
    );
  };

  // Shuffle / Refresh all images to showcase variety
  const handleRandomizeImages = () => {
    setProductsList((prev) =>
      prev.map((prod) => {
        if (prod.images.length > 1) {
          // cycle to next image
          const nextImages = [...prod.images.slice(1), prod.images[0]];
          return { ...prod, images: nextImages };
        }
        return prod;
      })
    );
    triggerNotification(
      language === 'sw'
        ? 'Picha zimebadilishwa kwa mitazamo tofauti!'
        : 'Product photo angles rotated!'
    );
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesNameSw = product.nameSw.toLowerCase().includes(query);
        const matchesNameEn = product.nameEn.toLowerCase().includes(query);
        const matchesDescSw = product.descriptionSw.toLowerCase().includes(query);
        const matchesDescEn = product.descriptionEn.toLowerCase().includes(query);
        const matchesOrigin = product.origin.toLowerCase().includes(query);
        return matchesNameSw || matchesNameEn || matchesDescSw || matchesDescEn || matchesOrigin;
      }
      return true;
    });
  }, [productsList, selectedCategory, searchQuery]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const getQuantityInCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl border border-stone-700 flex items-center gap-2.5 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        selectedZone={selectedZone}
        onSelectZone={setSelectedZone}
        onOpenVendorModal={() => {
          setPreselectedTier('starter');
          setIsVendorModalOpen(true);
        }}
        onOpenPackagesModal={() => setIsPackagesModalOpen(true)}
        vendorsCount={registeredVendors.length}
      />

      <main className="flex-1">
        {/* Hero Banner & Category Filter Strip */}
        <HeroSection
          language={language}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onOpenVendorModal={() => {
            setPreselectedTier('starter');
            setIsVendorModalOpen(true);
          }}
          onOpenPackagesModal={() => setIsPackagesModalOpen(true)}
          vendorsCount={registeredVendors.length}
        />

        {/* Product Catalog Section */}
        <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          {/* Section Subheader & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                  {selectedCategory === 'all'
                    ? (language === 'sw' ? 'Mazao Yote ya Leo Sokoni' : 'All Fresh Market Produce')
                    : (language === 'sw' ? 'Mazao Yaliyochaguliwa' : 'Selected Category')}
                </h2>
                <span className="text-xs font-bold bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full">
                  {filteredProducts.length}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {language === 'sw'
                  ? 'Kila zao lina picha yake maalum ya kipekee. Bonyeza kitufe cha "Picha" kwenye bidhaa yoyote kuangalia au kubadilisha mitazamo.'
                  : 'Every item features dedicated, authentic photography. Click "Photo" on any product card to preview or customize.'}
              </p>
            </div>

            {/* Quick Action: Rotate / Shuffle Photo Views */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleRandomizeImages}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 hover:border-emerald-600 hover:bg-emerald-50/50 text-stone-700 hover:text-emerald-800 text-xs font-semibold transition-colors"
                title={language === 'sw' ? 'Badilisha mitazamo ya picha za mazao' : 'Switch photo angles'}
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'sw' ? 'Badilisha Mitazamo ya Picha' : 'Rotate Photo Angles'}</span>
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 p-8">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-bold text-stone-800 text-base mb-1">
                {language === 'sw' ? 'Hakuna zao lililopatikana' : 'No products found'}
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
                {language === 'sw'
                  ? 'Jaribu kubadilisha neno la utafutaji au chagua aina nyingine ya mazao.'
                  : 'Try adjusting your search query or selecting a different category.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800"
              >
                {language === 'sw' ? 'Onyesha Mazao Yote' : 'Show All Items'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  language={language}
                  quantityInCart={getQuantityInCart(product.id)}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onOpenDetails={(p) => setDetailProduct(p)}
                  onOpenImageCustomizer={(p) => setCustomizerProduct(p)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Recipes & Cooking Ideas Section */}
        <RecipesSection
          language={language}
          allProducts={productsList}
          onAddMultipleToCart={handleAddMultipleToCart}
        />

        {/* Customer Reviews & Farm Source Section */}
        <ReviewsSection language={language} />
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onOpenVendorModal={() => setIsVendorModalOpen(true)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        language={language}
        quantityInCart={detailProduct ? getQuantityInCart(detailProduct.id) : 0}
        onClose={() => setDetailProduct(null)}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        onOpenImageCustomizer={(p) => {
          setCustomizerProduct(p);
        }}
      />

      {/* Image Customizer / Variety Switcher Modal */}
      <ImageCustomizerModal
        product={customizerProduct}
        language={language}
        onClose={() => setCustomizerProduct(null)}
        onUpdateProductImage={handleUpdateProductImage}
      />

      {/* Market Vendor Registration Modal with Packages */}
      <VendorRegistrationModal
        isOpen={isVendorModalOpen}
        onClose={() => setIsVendorModalOpen(false)}
        language={language}
        existingVendorsCount={registeredVendors.length}
        initialPackageTier={preselectedTier}
        onRegisterVendor={(newVendor) => {
          setRegisteredVendors((prev) => [newVendor, ...prev]);
          triggerNotification(
            language === 'sw'
              ? `Biashara yako ya "${newVendor.businessName}" imesajiliwa na kifurushi cha TZS ${newVendor.subscriptionPriceTZS.toLocaleString()}/mwezi kiko hewani!`
              : `Your stall "${newVendor.businessName}" is now active on the TZS ${newVendor.subscriptionPriceTZS.toLocaleString()}/mo plan!`
          );
        }}
      />

      {/* Monthly Packages Modal */}
      <PackagesModal
        isOpen={isPackagesModalOpen}
        onClose={() => setIsPackagesModalOpen(false)}
        language={language}
        onSelectPackage={(tier) => {
          setPreselectedTier(tier);
          setIsVendorModalOpen(true);
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        language={language}
        selectedZone={selectedZone}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        selectedZone={selectedZone}
        language={language}
        onOrderSuccess={(order) => {
          // Clear cart on successful order
          setCart([]);
        }}
      />

      {/* Floating WhatsApp Support Button */}
      <a
        href="https://wa.me/255704205872?text=Habari%20Sokoni%20Mkononi,%20nahitaji%20msaada%20wa%20kuweka%20oda"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Support 0704205872"
        className="fixed bottom-5 right-5 z-30 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3.5 shadow-2xl flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 border-2 border-white"
        title="Wasiliana Nasi WhatsApp: 0704 205 872"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        <span className="hidden sm:inline font-bold text-xs pr-1">
          {language === 'sw' ? 'Msaada / WhatsApp (0704 205 872)' : 'WhatsApp (0704 205 872)'}
        </span>
      </a>
    </div>
  );
}
