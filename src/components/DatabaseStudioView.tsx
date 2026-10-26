/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DatabaseEngine } from '../db/dbEngine';
import { Product } from '../data/products';
import { OrderDetails, Vendor } from '../types';
import {
  Database,
  Table as TableIcon,
  ShoppingBag,
  Store,
  Layers,
  Search,
  Download,
  Copy,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  Key,
  Link2,
  Terminal,
  FileText
} from 'lucide-react';

interface DatabaseStudioViewProps {
  orders: OrderDetails[];
  vendors: Vendor[];
  products: Product[];
  onUpdateOrderStatus: (orderId: string, status: OrderDetails['status']) => void;
  onUpdateProductPrice: (productId: string, price: number) => void;
  onToggleProductStock: (productId: string) => void;
  onSwitchToStore: () => void;
}

export const DatabaseStudioView: React.FC<DatabaseStudioViewProps> = ({
  orders,
  vendors,
  products,
  onUpdateOrderStatus,
  onUpdateProductPrice,
  onToggleProductStock,
  onSwitchToStore,
}) => {
  const engine = DatabaseEngine.getInstance();
  const [activeTab, setActiveTab] = useState<'tables' | 'erd' | 'sql' | 'backup'>('tables');
  const [selectedTable, setSelectedTable] = useState<'orders' | 'products' | 'vendors'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  // SQL queries simulator
  const presets = [
    {
      title: 'Oda Zote Zinazosubiri (Pending Orders)',
      sql: `SELECT orderId, customerName, phone, deliveryZone, total \nFROM orders \nWHERE status = 'pending';`,
      run: () =>
        orders
          .filter((o) => o.status === 'pending')
          .map((o) => ({
            id: o.orderId,
            mteja: o.customerName,
            simu: o.phone,
            eneo: o.deliveryZone,
            jumla_tzs: o.total,
            njia: o.paymentMethod,
          })),
    },
    {
      title: 'Wafanyabiashara kwa Kila Soko (Vendors by Market)',
      sql: `SELECT marketName, COUNT(id) AS idadi_wauzaji \nFROM vendors \nGROUP BY marketName;`,
      run: () => {
        const counts: Record<string, number> = {};
        vendors.forEach((v) => {
          counts[v.marketName] = (counts[v.marketName] || 0) + 1;
        });
        return Object.entries(counts).map(([soko, idadi]) => ({ soko, idadi_wauzaji: idadi }));
      },
    },
    {
      title: 'Mazao Yenye Bei ya Juu (High Price Products)',
      sql: `SELECT id, nameSw, category, price \nFROM products \nORDER BY price DESC \nLIMIT 5;`,
      run: () =>
        [...products]
          .sort((a, b) => b.price - a.price)
          .slice(0, 5)
          .map((p) => ({
            id: p.id,
            zao: p.nameSw,
            kundi: p.category,
            bei_tzs: p.price,
            kipimo: p.unit,
            stoo: p.inStock ? 'Ipo' : 'Imekwisha',
          })),
    },
  ];

  const [activePreset, setActivePreset] = useState(presets[0]);
  const [queryResults, setQueryResults] = useState<any[]>(presets[0].run());

  const handleRunPreset = (p: typeof presets[0]) => {
    setActivePreset(p);
    setQueryResults(p.run());
  };

  const copySqlScript = () => {
    navigator.clipboard.writeText(engine.generateSQL());
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const exportTableCSV = () => {
    let rows: any[] = [];
    if (selectedTable === 'orders') rows = orders;
    else if (selectedTable === 'products') rows = products;
    else if (selectedTable === 'vendors') rows = vendors;

    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]).join(',');
    const csvData = rows.map((r) =>
      Object.values(r)
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    );
    const blob = new Blob([[headers, ...csvData].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sokoni_mkononi_${selectedTable}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadJSONBackup = () => {
    const data = {
      orders,
      vendors,
      products,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sokoni_mkononi_db_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Banner */}
      <header className="border-b border-slate-800 bg-slate-950/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-500 text-white flex items-center justify-center font-bold shadow-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-white tracking-tight">
                  Kituo cha Hifadhidata (Database Studio)
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Hai & Inahifadhi Moja kwa Moja
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Usimamizi wa majedwali ya Sokoni Mkononi: Oda, Bidhaa, Wauzaji na SQL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onSwitchToStore}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>🛒 Rudi Kwenye Duka (Storefront)</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-t border-slate-800/80 bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 overflow-x-auto py-2">
            <button
              onClick={() => setActiveTab('tables')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'tables'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Majedwali ya Data (Table Explorer)</span>
            </button>
            <button
              onClick={() => setActiveTab('erd')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'erd'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Muundo wa Mahusiano (ERD Schema)</span>
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'sql'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Kijaribu cha SQL & Msimbo</span>
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'backup'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Nakala Rudufu (Backup & SQL Dump)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl w-full mx-auto px-4 py-6 flex-1 space-y-6">
        {/* Quick Database Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
            <span className="text-slate-400 text-xs block">Jedwali: orders</span>
            <span className="text-2xl font-black text-white mt-1 block">{orders.length}</span>
            <span className="text-[11px] text-emerald-400">Oda zilizohifadhiwa</span>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
            <span className="text-slate-400 text-xs block">Jedwali: products</span>
            <span className="text-2xl font-black text-white mt-1 block">{products.length}</span>
            <span className="text-[11px] text-indigo-400">Bidhaa na mazao</span>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
            <span className="text-slate-400 text-xs block">Jedwali: vendors</span>
            <span className="text-2xl font-black text-white mt-1 block">{vendors.length}</span>
            <span className="text-[11px] text-purple-400">Wafanyabiashara wa masoko</span>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
            <span className="text-slate-400 text-xs block">Hifadhi</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">Local DB</span>
            <span className="text-[11px] text-slate-400">Hai na salama</span>
          </div>
        </div>

        {/* TAB 1: TABLE EXPLORER */}
        {activeTab === 'tables' && (
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-5 space-y-5">
            {/* Table Buttons & Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-700/80">
                <button
                  onClick={() => setSelectedTable('orders')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedTable === 'orders'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  orders ({orders.length})
                </button>
                <button
                  onClick={() => setSelectedTable('products')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedTable === 'products'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  products ({products.length})
                </button>
                <button
                  onClick={() => setSelectedTable('vendors')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedTable === 'vendors'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  vendors ({vendors.length})
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder={`Tafuta katika ${selectedTable}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-indigo-500 w-48 sm:w-60"
                  />
                </div>
                <button
                  onClick={exportTableCSV}
                  className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  CSV
                </button>
              </div>
            </div>

            {/* Render Selected Table */}
            <div className="bg-slate-900 rounded-xl border border-slate-700/80 overflow-x-auto">
              {selectedTable === 'orders' && (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Mteja & Simu</th>
                      <th className="py-3 px-4">Eneo la Uletaji</th>
                      <th className="py-3 px-4">Jumla (TZS)</th>
                      <th className="py-3 px-4">Malipo</th>
                      <th className="py-3 px-4">Hali ya Sasa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {orders
                      .filter(
                        (o) =>
                          o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.phone.includes(searchQuery)
                      )
                      .map((o) => (
                        <tr key={o.orderId} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                            {o.orderId}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-white">{o.customerName}</div>
                            <div className="text-[11px] text-slate-500">{o.phone}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-400">{o.deliveryZone}</td>
                          <td className="py-3 px-4 font-bold text-emerald-400">
                            TZS {o.total.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 uppercase font-mono text-[10px] text-slate-400">
                            {o.paymentMethod}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={o.status}
                              onChange={(e) =>
                                onUpdateOrderStatus(o.orderId, e.target.value as any)
                              }
                              className="bg-slate-950 border border-slate-700 text-xs rounded-lg px-2 py-1 text-slate-200 cursor-pointer"
                            >
                              <option value="pending">pending (inangoja)</option>
                              <option value="processing">processing (inaandaliwa)</option>
                              <option value="out_for_delivery">out_for_delivery (njiani)</option>
                              <option value="delivered">delivered (imefika)</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}

              {selectedTable === 'products' && (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Zao (Product)</th>
                      <th className="py-3 px-4">Kundi</th>
                      <th className="py-3 px-4">Bei (TZS)</th>
                      <th className="py-3 px-4">Kipimo</th>
                      <th className="py-3 px-4">Asili (Origin)</th>
                      <th className="py-3 px-4">Hali ya Stoo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {products
                      .filter(
                        (p) =>
                          p.nameSw.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-bold text-white">{p.nameSw}</td>
                          <td className="py-3 px-4 capitalize text-slate-400">{p.category}</td>
                          <td className="py-3 px-4 font-bold text-emerald-400">
                            TZS {p.price.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-slate-400">{p.unit}</td>
                          <td className="py-3 px-4 text-slate-400">{p.origin}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => onToggleProductStock(p.id)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
                                p.inStock
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {p.inStock ? 'Ipo Stoo' : 'Imekwisha'}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}

              {selectedTable === 'vendors' && (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Biashara / Duka</th>
                      <th className="py-3 px-4">Mmiliki & Simu</th>
                      <th className="py-3 px-4">Soko Kuu</th>
                      <th className="py-3 px-4">Fremu</th>
                      <th className="py-3 px-4">Kifurushi</th>
                      <th className="py-3 px-4">Hali</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {vendors
                      .filter(
                        (v) =>
                          v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.marketName.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((v) => (
                        <tr key={v.id} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-bold text-white">{v.businessName}</td>
                          <td className="py-3 px-4">
                            <div className="text-white">{v.ownerName}</div>
                            <div className="text-[11px] text-slate-500">{v.phone}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-400">{v.marketName}</td>
                          <td className="py-3 px-4 text-slate-400">{v.stallNumber}</td>
                          <td className="py-3 px-4 uppercase font-bold text-indigo-400">
                            {v.subscriptionPlan} (TZS {v.subscriptionPriceTZS})
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                              {v.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ERD SCHEMA */}
        {activeTab === 'erd' && (
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">Muundo wa Mahusiano (ERD) ya Sokoni Mkononi</h3>
              <p className="text-xs text-slate-400 mt-1">
                Jinsi majedwali ya <strong>orders</strong>, <strong>products</strong>, na <strong>vendors</strong> yanavyoungana kuzuia upotevu wa data.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
              {/* orders table */}
              <div className="bg-slate-900 p-4 rounded-xl border border-emerald-500/40 space-y-2 font-mono">
                <div className="font-bold text-emerald-400 text-sm flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <Key className="w-3.5 h-3.5" /> orders [TABLE]
                </div>
                <div className="text-slate-300">orderId: VARCHAR(32) [PK]</div>
                <div className="text-slate-400">customerName: VARCHAR(100)</div>
                <div className="text-slate-400">phone: VARCHAR(20) [INDEX]</div>
                <div className="text-slate-400">deliveryZone: VARCHAR(100)</div>
                <div className="text-slate-400">total: NUMERIC(12,2)</div>
                <div className="text-slate-400">status: VARCHAR(30)</div>
                <div className="text-slate-400">createdAt: TIMESTAMP</div>
              </div>

              {/* products table */}
              <div className="bg-slate-900 p-4 rounded-xl border border-indigo-500/40 space-y-2 font-mono">
                <div className="font-bold text-indigo-400 text-sm flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <Key className="w-3.5 h-3.5" /> products [TABLE]
                </div>
                <div className="text-slate-300">id: VARCHAR(32) [PK]</div>
                <div className="text-slate-400">nameSw: VARCHAR(150)</div>
                <div className="text-slate-400">category: VARCHAR(50) [INDEX]</div>
                <div className="text-slate-400">price: NUMERIC(12,2)</div>
                <div className="text-slate-400">unit: VARCHAR(50)</div>
                <div className="text-slate-400">inStock: BOOLEAN</div>
              </div>

              {/* vendors table */}
              <div className="bg-slate-900 p-4 rounded-xl border border-purple-500/40 space-y-2 font-mono">
                <div className="font-bold text-purple-400 text-sm flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <Key className="w-3.5 h-3.5" /> vendors [TABLE]
                </div>
                <div className="text-slate-300">id: VARCHAR(32) [PK]</div>
                <div className="text-slate-400">businessName: VARCHAR(150)</div>
                <div className="text-slate-400">ownerName: VARCHAR(100)</div>
                <div className="text-slate-400">marketName: VARCHAR(100)</div>
                <div className="text-slate-400">subscriptionPlan: VARCHAR(20)</div>
                <div className="text-slate-400">status: VARCHAR(20)</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SQL STUDIO */}
        {activeTab === 'sql' && (
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Kijaribu cha Maswali ya SQL (SQL Query Simulator)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Jaribu maswali ya SQL hapa chini kuona jinsi data zako za Sokoni Mkononi zinavyochakatwa kwa kasi.
                </p>
              </div>
              <button
                onClick={copySqlScript}
                className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Imenakiliwa!' : 'Nakili Msimbo Kamili wa SQL'}</span>
              </button>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRunPreset(preset)}
                  className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    activePreset.title === preset.title
                      ? 'bg-indigo-600/30 border-indigo-500 text-white'
                      : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="font-bold">{preset.title}</div>
                </button>
              ))}
            </div>

            {/* SQL Terminal Display */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-emerald-400">
              <pre>{activePreset.sql}</pre>
            </div>

            {/* Query Results */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                  <tr>
                    {queryResults.length > 0 &&
                      Object.keys(queryResults[0]).map((k) => (
                        <th key={k} className="py-2.5 px-4 font-mono">
                          {k}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-slate-300">
                  {queryResults.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-800/40">
                      {Object.values(r).map((v: any, j) => (
                        <td key={j} className="py-2.5 px-4">
                          {typeof v === 'number' ? v.toLocaleString() : String(v)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: BACKUP & SQL DUMP */}
        {activeTab === 'backup' && (
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                Nakala Rudufu za Database (Backup & Export)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Pakua data zote ili uwe na uhakika wa nakala rudufu (disaster recovery).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-700 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-bold text-white text-sm">Pakua Nakala ya JSON</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Inapakua rekodi zote za sasa (oda, wauzaji, bidhaa) kama faili la JSON kwenye kompyuta yako.
                  </p>
                </div>
                <button
                  onClick={downloadJSONBackup}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Pakua JSON Backup
                </button>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-700 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-bold text-white text-sm">Nakili Msimbo wa SQL DDL</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Inatengeneza msimbo wa PostgreSQL / Cloud SQL tayari kwa ajili ya kuendesha kwenye Supabase au Neon.
                  </p>
                </div>
                <button
                  onClick={copySqlScript}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  {copiedSql ? 'Imenakiliwa!' : 'Nakili SQL Script'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
