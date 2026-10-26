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
import { WeeklyBasketsSection } from './components/WeeklyBasketsSection';
import { RecipesSection } from './components/RecipesSection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { DatabaseStudioView } from './components/DatabaseStudioView';
import { DatabaseEngine } from './db/dbEngine';
import { DELIVERY_ZONES, DeliveryZone, Product } from './data/products';
import { CartItem, Language, OrderDetails, PackageTier, Vendor } from './types';
import { CheckCircle2, ShoppingBag, MessageCircle, Database, LayoutDashboard, Sparkles, Store, RefreshCw } from 'lucide-react';

export default function App() {
  const engine = DatabaseEngine.getInstance();
  const [language, setLanguage] = useState<Language>('sw');

  // Top-level View Switcher: 'store' (Duka la Wateja) vs 'database' (Database Studio & SQL)
  const [currentView, setCurrentView] = useState<'store' | 'database'>('store');
  
  // State backed by DatabaseEngine (persistent storage)
  const [productsList, setProductsList] = useState<Product[]>(() => engine.getProducts());
  const [registeredVendors, setRegisteredVendors] = useState<Vendor[]>(() => engine.getVendors());
  const [orders, setOrders] = useState<OrderDetails[]>(() => engine.getOrders());

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<DeliveryZone>(DELIVERY_ZONES[0]);

  // Modals state
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [customizerProduct, setCustomizerProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isPackagesModalOpen, setIsPackagesModalOpen] = useState(false);
  const [preselectedTier, setPreselectedTier] = useState<PackageTier>('starter');
  const [notification, setNotification] = useState<string | null>(null);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Admin Actions synced with DatabaseEngine
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderDetails['status']) => {
    engine.updateOrderStatus(orderId, newStatus);
    setOrders(engine.getOrders());
    triggerNotification(
      language === 'sw'
        ? `Hali ya oda ${orderId} imesasishwa kuwa "${newStatus}" kwenye database.`
        : `Order ${orderId} status updated to "${newStatus}" in database.`
    );
  };

  const handleUpdateProductPrice = (productId: string, newPrice: number) => {
    engine.updateProductPrice(productId, newPrice);
    setProductsList(engine.getProducts());
    triggerNotification(
      language === 'sw'
        ? `Bei ya zao imesasishwa kuwa TSh ${newPrice.toLocaleString()}`
        : `Product price updated to TSh ${newPrice.toLocaleString()}`
    );
  };

  const handleToggleProductStock = (productId: string) => {
    engine.toggleProductStock(productId);
    setProductsList(engine.getProducts());
  };

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
    const msg =
      language === 'sw'
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
    const msg =
      language === 'sw'
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

  const handleRandomizeImages = () => {
    setProductsList((prev) =>
      prev.map((prod) => {
        if (prod.images.length > 1) {
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
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-emerald-200 relative">
      {/* 🚀 QUICK SYSTEM SWITCHER BAR (ALWAYS VISIBLE AT TOP) */}
      <div className="bg-stone-950 text-white px-3 sm:px-6 py-2 border-b border-stone-800 sticky top-0 z-50 flex items-center justify-between text-xs shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="font-extrabold tracking-tight text-white hidden sm:inline">
            Sokoni Mkononi
          </span>
          <span className="text-stone-400 font-medium text-[11px] hidden md:inline">
            • Database: <strong className="text-emerald-400 font-mono">Inafanya Kazi</strong> (Oda: {orders.length} | Mazao: {productsList.length} | Wauzaji: {registeredVendors.length})
          </span>
        </div>

        {/* 1-Click Toggle Switcher */}
        <div className="inline-flex p-1 bg-stone-900 rounded-xl border border-stone-700/80 shadow-xs">
          <button
            onClick={() => {
              setCurrentView('store');
              setIsAdminDashboardOpen(false);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs cursor-pointer ${
              currentView === 'store' && !isAdminDashboardOpen
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>🛒 Duka la Wateja</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('database');
              setIsAdminDashboardOpen(false);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs cursor-pointer ${
              currentView === 'database'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>🗄️ Tembelea Database</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl border border-stone-700 flex items-center gap-2.5 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* VIEW 1: DATABASE STUDIO VIEW */}
      {currentView === 'database' ? (
        <DatabaseStudioView
          orders={orders}
          vendors={registeredVendors}
          products={productsList}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateProductPrice={handleUpdateProductPrice}
          onToggleProductStock={handleToggleProductStock}
          onSwitchToStore={() => setCurrentView('store')}
        />
      ) : (
        /* VIEW 2: STOREFRONT VIEW */
        <>
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
            onOpenAdminDashboard={() => setCurrentView('database')}
            vendorsCount={registeredVendors.length}
          />

          {isAdminDashboardOpen ? (
            <AdminDashboard
              language={language}
              onClose={() => setIsAdminDashboardOpen(false)}
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              vendors={registeredVendors}
              products={productsList}
              onUpdateProductPrice={handleUpdateProductPrice}
              onToggleProductStock={handleToggleProductStock}
            />
          ) : (
            <>
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

                {/* Specialized Weekly Baskets Section for Customers */}
                <WeeklyBasketsSection
                  language={language}
                  onAddToCart={handleAddToCart}
                  onOpenDetails={(p) => setDetailProduct(p)}
                />

                {/* Product Catalog Section */}
                <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
                  {/* Section Subheader & Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                          {selectedCategory === 'all'
                            ? language === 'sw'
                              ? 'Mazao Yote ya Leo Sokoni'
                              : 'All Fresh Market Produce'
                            : language === 'sw'
                            ? 'Mazao Yaliyochaguliwa'
                            : 'Selected Category'}
                        </h2>
                        <span className="text-xs font-bold bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full">
                          {filteredProducts.length}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {language === 'sw'
                          ? 'Kila zao lina picha yake halisi. Bonyeza kitufe cha "Picha" kwenye bidhaa yoyote kuangalia mitazamo tofauti.'
                          : 'Every item features authentic photography. Click "Photo" on any product card to preview angles.'}
                      </p>
                    </div>

                    {/* Quick Action: Rotate / Shuffle Photo Views */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={handleRandomizeImages}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 hover:border-emerald-600 hover:bg-emerald-50/50 text-stone-700 hover:text-emerald-800 text-xs font-semibold transition-colors cursor-pointer"
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
                        className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 cursor-pointer"
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
                  engine.addVendor(newVendor);
                  setRegisteredVendors(engine.getVendors());
                  triggerNotification(
                    language === 'sw'
                      ? `Biashara yako ya "${newVendor.businessName}" imesajiliwa na kuhifadhiwa kwenye database!`
                      : `Your stall "${newVendor.businessName}" has been registered and stored in database!`
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

              {/* Checkout Modal with Automatic Database Persistence */}
              <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                items={cart}
                selectedZone={selectedZone}
                language={language}
                onOrderSuccess={(order) => {
                  engine.addOrder(order);
                  setOrders(engine.getOrders());
                  setCart([]);
                  triggerNotification(
                    language === 'sw'
                      ? `Oda yako ${order.orderId} imepokelewa na kuhifadhiwa kwenye database!`
                      : `Order ${order.orderId} received and saved to database!`
                  );
                }}
              />

              {/* Sticky Bottom Cart Bar */}
              {cart.length > 0 && !isCartOpen && !isCheckoutOpen && (
                <div className="fixed bottom-5 left-4 right-4 sm:left-6 sm:right-auto z-30 flex items-center justify-center">
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="w-full sm:w-auto bg-stone-900/95 hover:bg-stone-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center justify-between sm:justify-start gap-4 border-2 border-emerald-500 backdrop-blur-md transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shrink-0">
                        <ShoppingBag className="w-5 h-5 text-amber-300" />
                        <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-stone-950 font-black text-[10px] rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-xs">
                          {cart.reduce((sum, i) => sum + i.quantity, 0)}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{language === 'sw' ? 'Kikapu Chako' : 'Your Basket'}</span>
                          <span className="text-stone-400 font-normal">
                            ({cart.reduce((sum, i) => sum + i.quantity, 0)}{' '}
                            {language === 'sw' ? 'vitu' : 'items'})
                          </span>
                        </div>
                        <div className="text-sm font-extrabold text-emerald-400 leading-tight">
                          TSh {cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 group-hover:text-amber-200 bg-white/10 px-3 py-1.5 rounded-xl shrink-0">
                      <span>{language === 'sw' ? 'Angalia Kikapu' : 'View Basket'}</span>
                      <span>&rarr;</span>
                    </div>
                  </button>
                </div>
              )}

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
                  WhatsApp (0704 205 872)
                </span>
              </a>
            </>
          )}
        </>
      )}
    </div>
  );
}
