/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Database,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Download,
  AlertCircle,
  Eye,
  Store,
  ShoppingBag,
  Users,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { DatabaseState, TableName, Product, Order, Vendor, Customer, OrderItem } from '../types';

interface TableExplorerProps {
  db: DatabaseState;
  onUpdateOrderStatus: (id: string, status: Order['status']) => void;
  onUpdateVendorStatus: (id: string, status: Vendor['status']) => void;
  onToggleProductStock: (id: string, current: boolean) => void;
  onDeleteRecord: (table: TableName, id: string) => void;
  onAddProduct: (product: Omit<Product, 'id' | 'rating' | 'reviews_count'>) => void;
  onAddVendor: (vendor: Omit<Vendor, 'id' | 'registered_at'>) => void;
}

export const TableExplorer: React.FC<TableExplorerProps> = ({
  db,
  onUpdateOrderStatus,
  onUpdateVendorStatus,
  onToggleProductStock,
  onDeleteRecord,
  onAddProduct,
  onAddVendor,
}) => {
  const [activeTable, setActiveTable] = useState<TableName>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for new product
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Product['category']>('mboga');
  const [newProdPrice, setNewProdPrice] = useState(3000);
  const [newProdUnit, setNewProdUnit] = useState('Kilo 1');
  const [newProdStock, setNewProdStock] = useState(50);
  const [newProdOrigin, setNewProdOrigin] = useState('Morogoro');

  // Form states for new vendor
  const [newVendorBusiness, setNewVendorBusiness] = useState('');
  const [newVendorOwner, setNewVendorOwner] = useState('');
  const [newVendorPhone, setNewVendorPhone] = useState('07');
  const [newVendorMarket, setNewVendorMarket] = useState('Soko Kuu la Kariakoo');
  const [newVendorStall, setNewVendorStall] = useState('Fremu Na. 12');
  const [newVendorPlan, setNewVendorPlan] = useState<Vendor['subscriptionPlan']>('pro');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;
    onAddProduct({
      name_sw: newProdName,
      name_en: newProdName,
      category: newProdCategory,
      price: Number(newProdPrice),
      original_price: Number(newProdPrice) * 1.15,
      unit: newProdUnit,
      origin: newProdOrigin,
      in_stock: true,
      stock_quantity: Number(newProdStock),
      description_sw: `Bidhaa safi ya ${newProdName} kutoka ${newProdOrigin}.`,
      image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    });
    setNewProdName('');
    setIsAddModalOpen(false);
  };

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorBusiness || !newVendorOwner) return;
    onAddVendor({
      business_name: newVendorBusiness,
      owner_name: newVendorOwner,
      phone: newVendorPhone,
      market_name: newVendorMarket,
      stall_number: newVendorStall,
      category: 'Mboga na Nafaka',
      city: 'Dar es Salaam',
      subscription_plan: newVendorPlan,
      subscription_price_tzs: newVendorPlan === 'starter' ? 2000 : newVendorPlan === 'pro' ? 5000 : 10000,
      status: 'active',
    });
    setNewVendorBusiness('');
    setNewVendorOwner('');
    setIsAddModalOpen(false);
  };

  const exportTableCSV = () => {
    const data = db[activeTable];
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((row) =>
      Object.values(row)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sokoni_mkononi_${activeTable}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Table Selector Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => {
              setActiveTable('orders');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTable === 'orders'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>orders ({db.orders.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTable('products');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTable === 'products'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>products ({db.products.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTable('vendors');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTable === 'vendors'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>vendors ({db.vendors.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTable('order_items');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTable === 'order_items'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>order_items ({db.order_items.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTable('customers');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTable === 'customers'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>customers ({db.customers.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {(activeTable === 'products' || activeTable === 'vendors') && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Ongeza Rekodi Mpya
            </button>
          )}

          <button
            onClick={exportTableCSV}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium"
            title="Pakua CSV"
          >
            <Download className="w-3.5 h-3.5" />
            Pakua CSV
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Tafuta katika jedwali la ${activeTable}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-indigo-500 shadow-2xs"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Jedwali hai: <span className="font-mono text-indigo-700 font-bold">{activeTable}</span>
        </div>
      </div>

      {/* Live Table Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table 1: ORDERS */}
        {activeTable === 'orders' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">ID ya Oda</th>
                  <th className="py-3 px-4">Mteja & Simu</th>
                  <th className="py-3 px-4">Eneo la Uletaji</th>
                  <th className="py-3 px-4">Njia ya Malipo</th>
                  <th className="py-3 px-4">Jumla (TZS)</th>
                  <th className="py-3 px-4">Hali (Status)</th>
                  <th className="py-3 px-4">Tarehe</th>
                  <th className="py-3 px-4 text-right">Vitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {db.orders
                  .filter(
                    (o) =>
                      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      o.delivery_zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      o.phone.includes(searchQuery)
                  )
                  .map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                        {order.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">{order.customer_name}</div>
                        <div className="text-[11px] text-slate-500">{order.phone}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div className="font-medium">{order.delivery_zone}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                          {order.street_address}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono uppercase font-semibold text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {order.payment_method}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        TZS {order.total.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            onUpdateOrderStatus(order.id, e.target.value as Order['status'])
                          }
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                            order.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : order.status === 'out_for_delivery'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : order.status === 'processing'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : order.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          <option value="pending">pending (inangoja)</option>
                          <option value="processing">processing (inaandaliwa)</option>
                          <option value="out_for_delivery">out_for_delivery (njiani)</option>
                          <option value="delivered">delivered (imefika)</option>
                          <option value="cancelled">cancelled (imefutwa)</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {new Date(order.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onDeleteRecord('orders', order.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Futa oda"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table 2: PRODUCTS */}
        {activeTable === 'products' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Picha & Jina</th>
                  <th className="py-3 px-4">Kundi</th>
                  <th className="py-3 px-4">Bei (TZS)</th>
                  <th className="py-3 px-4">Kipimo</th>
                  <th className="py-3 px-4">Asili (Origin)</th>
                  <th className="py-3 px-4">Kiasi Stoo</th>
                  <th className="py-3 px-4">Hali ya Stoo</th>
                  <th className="py-3 px-4 text-right">Vitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {db.products
                  .filter(
                    (p) =>
                      p.name_sw.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.origin.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image_url}
                            alt={product.name_sw}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-semibold text-slate-900">{product.name_sw}</div>
                            <div className="text-[11px] font-mono text-slate-400">{product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium capitalize">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        TZS {product.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{product.unit}</td>
                      <td className="py-3 px-4 text-slate-600">{product.origin}</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {product.stock_quantity}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => onToggleProductStock(product.id, product.in_stock)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-colors ${
                            product.in_stock
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              product.in_stock ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          {product.in_stock ? 'Ipo Stoo' : 'Imekwisha'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onDeleteRecord('products', product.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Futa bidhaa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table 3: VENDORS */}
        {activeTable === 'vendors' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Jina la Biashara</th>
                  <th className="py-3 px-4">Mmiliki & Simu</th>
                  <th className="py-3 px-4">Soko Kuu</th>
                  <th className="py-3 px-4">Fremu / Kibanda</th>
                  <th className="py-3 px-4">Kifurushi (Plan)</th>
                  <th className="py-3 px-4">Hali</th>
                  <th className="py-3 px-4 text-right">Vitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {db.vendors
                  .filter(
                    (v) =>
                      v.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      v.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      v.market_name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{vendor.business_name}</div>
                        <div className="text-[11px] font-mono text-indigo-600">{vendor.id}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{vendor.owner_name}</div>
                        <div className="text-[11px] text-slate-500">{vendor.phone}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {vendor.market_name}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{vendor.stall_number}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold uppercase text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {vendor.subscription_plan} (TZS {vendor.subscription_price_tzs}/mwezi)
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() =>
                            onUpdateVendorStatus(
                              vendor.id,
                              vendor.status === 'active' ? 'pending' : 'active'
                            )
                          }
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-colors ${
                            vendor.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              vendor.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          {vendor.status}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onDeleteRecord('vendors', vendor.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Futa muuzaji"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table 4: ORDER ITEMS */}
        {activeTable === 'order_items' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Item ID</th>
                  <th className="py-3 px-4">Oda Husika (Order ID)</th>
                  <th className="py-3 px-4">Bidhaa</th>
                  <th className="py-3 px-4">Idadi (Quantity)</th>
                  <th className="py-3 px-4">Bei ya Kila Moja</th>
                  <th className="py-3 px-4">Jumla (TZS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {db.order_items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">{item.id}</td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                      {item.order_id}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">{item.product_name}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{item.quantity}</td>
                    <td className="py-3 px-4 text-slate-600">
                      TZS {item.unit_price.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      TZS {item.total_price.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table 5: CUSTOMERS */}
        {activeTable === 'customers' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Mteja ID</th>
                  <th className="py-3 px-4">Jina Kamili</th>
                  <th className="py-3 px-4">Nambari ya Simu</th>
                  <th className="py-3 px-4">Eneo Kuu (Zone)</th>
                  <th className="py-3 px-4">Jumla ya Oda</th>
                  <th className="py-3 px-4">Tarehe ya Kujiunga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {db.customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">{cust.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{cust.full_name}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{cust.phone}</td>
                    <td className="py-3 px-4 text-slate-600">{cust.default_zone}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[11px]">
                        {cust.total_orders} oda
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(cust.registered_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Ongeza Rekodi Mpya kwenye <span className="text-indigo-600 uppercase">{activeTable}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            {activeTable === 'products' ? (
              <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Jina la Bidhaa (Swahili)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mfano: Vitunguu Saumu Safi"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Kundi</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value as Product['category'])}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500"
                    >
                      <option value="mboga">Mboga</option>
                      <option value="matunda">Matunda</option>
                      <option value="nyama">Nyama & Samaki</option>
                      <option value="nafaka">Nafaka</option>
                      <option value="viungo">Viungo</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Bei (TZS)</label>
                    <input
                      type="number"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Kipimo (Unit)</label>
                    <input
                      type="text"
                      placeholder="Kilo 1 / Fungu"
                      value={newProdUnit}
                      onChange={(e) => setNewProdUnit(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Asili (Origin)</label>
                    <input
                      type="text"
                      placeholder="Iringa / Lushoto"
                      value={newProdOrigin}
                      onChange={(e) => setNewProdOrigin(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kiasi cha Awali Stoo</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                  >
                    Hifadhi kwenye Database
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateVendor} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Jina la Biashara / Duka
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mfano: Genge la Mama Asha"
                    value={newVendorBusiness}
                    onChange={(e) => setNewVendorBusiness(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Jina la Mmiliki</label>
                    <input
                      type="text"
                      required
                      placeholder="Asha Mussa"
                      value={newVendorOwner}
                      onChange={(e) => setNewVendorOwner(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Namba ya Simu</label>
                    <input
                      type="text"
                      required
                      placeholder="0754 000 111"
                      value={newVendorPhone}
                      onChange={(e) => setNewVendorPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Soko Analofanyia</label>
                    <select
                      value={newVendorMarket}
                      onChange={(e) => setNewVendorMarket(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500"
                    >
                      <option value="Soko Kuu la Kariakoo">Soko Kuu la Kariakoo</option>
                      <option value="Soko la Tandale">Soko la Tandale</option>
                      <option value="Soko la Ilala (Boma)">Soko la Ilala (Boma)</option>
                      <option value="Soko la Buguruni">Soko la Buguruni</option>
                      <option value="Soko la Temeke Stereo">Soko la Temeke Stereo</option>
                      <option value="Soko la Kigamboni Ferry">Soko la Kigamboni Ferry</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Fremu / Kibanda</label>
                    <input
                      type="text"
                      placeholder="Fremu Na. B-05"
                      value={newVendorStall}
                      onChange={(e) => setNewVendorStall(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kifurushi (Subscription)</label>
                  <select
                    value={newVendorPlan}
                    onChange={(e) => setNewVendorPlan(e.target.value as Vendor['subscriptionPlan'])}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-500"
                  >
                    <option value="starter">Starter Plan (TZS 2,000 / mwezi)</option>
                    <option value="pro">Pro Plan (TZS 5,000 / mwezi)</option>
                    <option value="vip">VIP Plan (TZS 10,000 / mwezi)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                  >
                    Sajili Muuzaji kwenye Database
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
