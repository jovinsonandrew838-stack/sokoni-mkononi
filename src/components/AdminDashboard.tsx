import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Package, 
  Server, 
  TrendingUp, 
  DollarSign, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Store, 
  ShieldCheck, 
  Globe, 
  Download, 
  Plus, 
  Edit3, 
  Trash2,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  RefreshCw,
  Database,
  Code2,
  Table as TableIcon
} from 'lucide-react';
import { OrderDetails, Vendor, Language } from '../types';
import { Product } from '../data/products';
import { DatabaseEngine } from '../db/dbEngine';

interface AdminDashboardProps {
  language: Language;
  onClose: () => void;
  orders: OrderDetails[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderDetails['status']) => void;
  vendors: Vendor[];
  products: Product[];
  onUpdateProductPrice: (productId: string, newPrice: number) => void;
  onToggleProductStock: (productId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  onClose,
  orders,
  onUpdateOrderStatus,
  vendors,
  products,
  onUpdateProductPrice,
  onToggleProductStock,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'vendors' | 'database' | 'system'>('overview');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // Financial calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const vendorMonthlyRevenue = vendors.reduce((sum, v) => sum + (v.subscriptionPriceTZS || 0), 0);

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch = o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch) ||
      o.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.deliveryZone.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filtered products
  const filteredProducts = products.filter(p => 
    p.nameSw.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.nameEn.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const getStatusBadge = (status: OrderDetails['status']) => {
    switch (status) {
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> {language === 'sw' ? 'Imefikishwa' : 'Delivered'}</span>;
      case 'out_for_delivery':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> {language === 'sw' ? 'Ipo Njiani' : 'In Transit'}</span>;
      case 'processing':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {language === 'sw' ? 'Inaandaliwa' : 'Packing'}</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {language === 'sw' ? 'Mpya / Inasubiri' : 'Pending'}</span>;
    }
  };

  const handleSavePrice = (productId: string) => {
    if (tempPrice > 0) {
      onUpdateProductPrice(productId, tempPrice);
    }
    setEditingPriceId(null);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans">
      
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-stone-900 text-white border-b border-stone-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-xs">
              SM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">Sokoni Mkononi</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Admin Control Center
                </span>
              </div>
              <p className="text-[11px] text-stone-400">Dashibodi ya Msimamizi & Uendeshaji wa Masoko</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{language === 'sw' ? 'Rudi Dukani (Storefront)' : 'Return to Storefront'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sub-Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto scrollbar-none py-2.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{language === 'sw' ? 'Muhtasari wa Mfumo' : 'System Overview'}</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{language === 'sw' ? 'Oda za Wateja' : 'Customer Orders'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-stone-950 font-black">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>{language === 'sw' ? 'Mazao & Bei za Asubuhi' : 'Products & Pricing'}</span>
          </button>

          <button
            onClick={() => setActiveTab('vendors')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'vendors'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>{language === 'sw' ? 'Wauzaji & Vifurushi' : 'Market Vendors'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-stone-200 text-stone-800 font-bold">
              {vendors.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'database'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{language === 'sw' ? 'Hifadhidata & SQL Studio' : 'Database & SQL Studio'}</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'system'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>{language === 'sw' ? 'Seva & IP Address' : 'Server & IP Config'}</span>
          </button>
        </div>
      </div>

      {/* Main Admin Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Jumla ya Mauzo</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-stone-900">
                  TSh {totalRevenue.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Kupitia M-Pesa, Tigo Pesa na Cash</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Oda Zinazoendelea</span>
                  <Truck className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-black text-stone-900">
                  {pendingOrders} <span className="text-sm font-normal text-stone-500">oda</span>
                </div>
                <div className="text-[11px] text-blue-700 font-semibold mt-1">
                  {completedOrders} zimeshafikishwa mlangoni
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Wafanyabiashara</span>
                  <Store className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-stone-900">
                  {vendors.length} <span className="text-sm font-normal text-stone-500">magenge</span>
                </div>
                <div className="text-[11px] text-amber-700 font-semibold mt-1">
                  Mapato ya Vifurushi: TSh {vendorMonthlyRevenue.toLocaleString()}/mwezi
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Hali ya Seva (IP)</span>
                  <Server className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-base font-mono font-bold text-stone-900">
                  34.34.246.68
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Google Cloud (Europe-West2) Live</span>
                </div>
              </div>
            </div>

            {/* Quick Action & Recent Orders Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Recent Orders List (7 cols) */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-sm">Oda za Hivi Karibuni</h3>
                    <p className="text-xs text-stone-500">Mizigo ya asubuhi ya Dar es Salaam na mikoani</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>Tazama Zote</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-stone-100 mt-2">
                  {orders.slice(0, 4).map((order) => (
                    <div key={order.orderId} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-stone-900">{order.customerName}</div>
                        <div className="text-stone-500 text-[11px]">
                          {order.deliveryZone} · {order.items.length} vitu
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-emerald-700">TSh {order.total.toLocaleString()}</div>
                        <div className="mt-0.5">{getStatusBadge(order.status)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hub Status & Operations (4 cols) */}
              <div className="lg:col-span-4 bg-emerald-900 text-white rounded-2xl p-5 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-amber-300" />
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">Kituo Kikuu cha Ugavi</span>
                  </div>
                  <h4 className="font-black text-lg text-white">Kigamboni Ferry Hub</h4>
                  <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                    Eneo la kupokelea na kukagua mazao yote asilia kutoka shambani kabla ya kusambazwa mlangoni kwa wateja Dar es Salaam.
                  </p>
                </div>

                <div className="pt-4 border-t border-emerald-800 space-y-2 text-xs">
                  <div className="flex justify-between text-emerald-200">
                    <span>Uendeshaji wa Masoko:</span>
                    <strong className="text-white">Imefunguliwa</strong>
                  </div>
                  <div className="flex justify-between text-emerald-200">
                    <span>Simu ya Huduma:</span>
                    <strong className="text-white">0704 205 872</strong>
                  </div>
                  <div className="flex justify-between text-emerald-200">
                    <span>Muda wa Uletaji:</span>
                    <strong className="text-amber-300">Dakika 45 - Masaa 2</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: LIVE ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-black text-stone-900 text-base">Usimamizi Kamili wa Oda za Wateja</h3>
                <p className="text-xs text-stone-500">Sasisha hali ya uletaji, wasiliana na wateja WhatsApp na simu</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="text"
                  placeholder="Tafuta jina, namba ya simu..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-stone-100 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-stone-100 border border-stone-300 rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="all">Hali Zote (All)</option>
                  <option value="pending">Mpya (Pending)</option>
                  <option value="processing">Inaandaliwa (Processing)</option>
                  <option value="out_for_delivery">Ipo Njiani (Out for Delivery)</option>
                  <option value="delivered">Imefikishwa (Delivered)</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-stone-500 font-bold uppercase text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-3">Oda ID</th>
                    <th className="py-3 px-3">Mteja & Simu</th>
                    <th className="py-3 px-3">Eneo la Kupeleka</th>
                    <th className="py-3 px-3">Bidhaa Zilizomo</th>
                    <th className="py-3 px-3">Jumla (TZS)</th>
                    <th className="py-3 px-3">Malipo</th>
                    <th className="py-3 px-3">Hali (Status)</th>
                    <th className="py-3 px-3 text-right">Badilisha Hali</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-stone-400">
                        Hakuna oda zilizopatikana zenye kigezo hicho.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.orderId} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-stone-900">{order.orderId}</td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-stone-900">{order.customerName}</div>
                          <div className="flex items-center gap-2 mt-0.5 text-stone-500">
                            <a href={`tel:${order.phone}`} className="hover:text-emerald-700 flex items-center gap-0.5">
                              <Phone className="w-3 h-3 text-stone-400" />
                              <span>{order.phone}</span>
                            </a>
                            <a
                              href={`https://wa.me/255${order.phone.replace(/[^0-9]/g, '').slice(-9)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-600 hover:text-emerald-700"
                              title="Tuma Ujumbe WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-white" />
                            </a>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-stone-800">{order.deliveryZone}</div>
                          <div className="text-[11px] text-stone-500">{order.streetAddress}</div>
                        </td>
                        <td className="py-3.5 px-3 max-w-xs">
                          <span className="text-stone-700 font-medium">
                            {order.items.map(i => `${i.product.nameSw} (${i.quantity})`).join(', ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-extrabold text-emerald-800 font-mono">
                          TSh {order.total.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={(e) => onUpdateOrderStatus(order.orderId, e.target.value as OrderDetails['status'])}
                            className="text-xs bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg px-2 py-1 font-semibold cursor-pointer focus:outline-none"
                          >
                            <option value="pending">Mpya</option>
                            <option value="processing">Inaandaliwa</option>
                            <option value="out_for_delivery">Ipo Njiani</option>
                            <option value="delivered">Imefikishwa</option>
                            <option value="cancelled">Imeghairiwa</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS & MORNING PRICING */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-black text-stone-900 text-base">Bei za Asubuhi za Mazao (Market Pricing)</h3>
                <p className="text-xs text-stone-500">Badilisha bei halisi kulingana na msimu au hali ya soko la leo</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Tafuta zao au jamii..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-stone-100 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredProducts.map((p) => {
                const isEditing = editingPriceId === p.id;
                return (
                  <div key={p.id} className="p-3.5 rounded-xl border border-stone-200 hover:border-emerald-500/50 bg-stone-50/50 flex items-center justify-between gap-3 transition-colors">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt={p.nameSw} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200" />
                      <div>
                        <div className="font-bold text-stone-900 text-xs">{p.nameSw}</div>
                        <div className="text-[11px] text-stone-500">{p.unit} · {p.origin}</div>
                        <div className="text-[10px] text-emerald-700 font-semibold uppercase">{p.category}</div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 text-xs border border-emerald-600 rounded bg-white text-stone-900 font-mono font-bold"
                          />
                          <button
                            onClick={() => handleSavePrice(p.id)}
                            className="px-2 py-1 bg-emerald-700 text-white rounded text-xs font-bold"
                          >
                            ✓
                          </button>
                        </div>
                      ) : (
                        <div 
                          onClick={() => {
                            setEditingPriceId(p.id);
                            setTempPrice(p.price);
                          }}
                          className="cursor-pointer group flex items-center gap-1 justify-end"
                          title="Bonyeza kubadilisha bei"
                        >
                          <span className="font-mono font-black text-xs text-stone-900 group-hover:text-emerald-700">
                            TSh {p.price.toLocaleString()}
                          </span>
                          <Edit3 className="w-3 h-3 text-stone-400 group-hover:text-emerald-700" />
                        </div>
                      )}

                      <button
                        onClick={() => onToggleProductStock(p.id)}
                        className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {p.inStock ? 'Inapatikana' : 'Imeisha'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: VENDORS MANAGEMENT */}
        {activeTab === 'vendors' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-black text-stone-900 text-base">Wafanyabiashara & Magenge ya Masokoni</h3>
                <p className="text-xs text-stone-500">Wakulima na wachuuzi waliojisajili na vifurushi vyao vya malipo</p>
              </div>

              <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-xl">
                {vendors.length} Magenge Yaliyosajiliwa
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendors.map((v) => (
                <div key={v.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-stone-900 text-sm">{v.businessName}</h4>
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-amber-400 text-stone-950">
                        {v.subscriptionPlan} (TZS {v.subscriptionPriceTZS.toLocaleString()}/mwezi)
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 mt-2 space-y-1">
                      <div>👤 Mwenye Duka: <strong>{v.ownerName}</strong></div>
                      <div>📍 Soko: <strong>{v.marketName}</strong> ({v.stallNumber})</div>
                      <div>📞 Mawasiliano: <strong>{v.phone}</strong></div>
                      <div>🏙️ Eneo: {v.city} · Tarehe: {v.registeredAt}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Kifurushi Kiko Hewani</span>
                    </span>

                    <a
                      href={`https://wa.me/255${v.phone.replace(/[^0-9]/g, '').slice(-9)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3 fill-white" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SYSTEM & SERVER HEALTH */}
        {activeTab === 'system' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-6">
            <div>
              <h3 className="font-black text-stone-900 text-base">Hali ya Mfumo & Seva ya Sokoni Mkononi</h3>
              <p className="text-xs text-stone-500">Taarifa za IP address, uhusiano wa GitHub, na kikoa (domain)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Server IP Config */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2 text-xs">
                <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-600" />
                  <span>IP Address ya Seva</span>
                </div>
                <div className="font-mono text-xs bg-white p-2 rounded-lg border border-stone-300">
                  <div><strong>IPv4:</strong> 34.34.246.68</div>
                  <div><strong>IPv6:</strong> 2600:1900:0:4a04::200</div>
                  <div><strong>Region:</strong> europe-west2 (London, UK)</div>
                </div>
                <p className="text-[11px] text-stone-500">
                  Hii ndiyo IP ya seva yako ya Google Cloud inayotoa huduma kwa wateja wote.
                </p>
              </div>

              {/* GitHub Repository Connection */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2 text-xs">
                <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>GitHub Repository</span>
                </div>
                <div className="font-mono text-xs bg-white p-2 rounded-lg border border-stone-300">
                  <div><strong>Repo:</strong> jovinsonandrew838-stack/sokoni-mkononi</div>
                  <div><strong>Branch:</strong> main (Up to date)</div>
                  <div><strong>Commit:</strong> 2bdcbe7</div>
                </div>
                <a
                  href="https://github.com/jovinsonandrew838-stack/sokoni-mkononi"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                >
                  <span>Fungua kwenye GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>

            {/* Custom Domain Instructions */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 space-y-2 text-xs">
              <div className="font-bold text-amber-950 text-sm">
                🌐 Usanidi wa Kikoa (sokonimkononi.co.tz)
              </div>
              <p className="text-stone-700 leading-relaxed">
                Kwenye dashibodi yako ya kikoa (DNS Zone Editor), weka CNAME ya <code>www</code> ielekee kwenye:
                <br />
                <code className="bg-white px-2 py-0.5 rounded border border-amber-300 font-bold font-mono text-stone-900 inline-block mt-1">
                  ais-pre-rlm25pdrgfbv4oynaxaqpf-451938180489.europe-west2.run.app.
                </code>
              </p>
            </div>
          </div>
        )}

        {/* TAB: DATABASE & SQL STUDIO */}
        {activeTab === 'database' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h3 className="font-black text-stone-900 text-lg flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <span>Kituo cha Hifadhidata ya Sokoni Mkononi (Database Studio)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Usimamizi wa majedwali, mahusiano ya data (ERD), na msimbo wa SQL (PostgreSQL & MySQL).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const sql = DatabaseEngine.getInstance().generateSQL();
                    navigator.clipboard.writeText(sql);
                    alert('Msimbo wa SQL umenakiliwa kwenye clipboard!');
                  }}
                  className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Nakili SQL Script</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <span className="text-stone-500 block">Jedwali: orders</span>
                <span className="text-xl font-black text-stone-900 mt-1 block">{orders.length}</span>
                <span className="text-[11px] text-emerald-700 font-medium">Rekodi za oda za wateja</span>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <span className="text-stone-500 block">Jedwali: products</span>
                <span className="text-xl font-black text-stone-900 mt-1 block">{products.length}</span>
                <span className="text-[11px] text-emerald-700 font-medium">Mazao na bei za asubuhi</span>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <span className="text-stone-500 block">Jedwali: vendors</span>
                <span className="text-xl font-black text-stone-900 mt-1 block">{vendors.length}</span>
                <span className="text-[11px] text-emerald-700 font-medium">Wafanyabiashara wa masoko</span>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <span className="text-stone-500 block">Hali ya Hifadhi</span>
                <span className="text-xl font-black text-emerald-700 mt-1 block">Hai (Active)</span>
                <span className="text-[11px] text-stone-500">Local Persistent Storage</span>
              </div>
            </div>

            {/* SQL Script View */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <TableIcon className="w-4 h-4 text-emerald-600" />
                  Msimbo wa Uzalishaji wa PostgreSQL / Cloud SQL:
                </span>
                <span className="text-[11px] text-stone-500">Tayari kwa Supabase, Neon au Google Cloud SQL</span>
              </div>
              <div className="bg-stone-950 rounded-2xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-72 border border-stone-800 leading-relaxed">
                <pre>{DatabaseEngine.getInstance().generateSQL()}</pre>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
