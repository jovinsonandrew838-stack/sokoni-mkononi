/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DatabaseEngine } from './db/dbEngine';
import { DatabaseState, TableName, Product, Vendor, Order } from './types';
import { TableExplorer } from './components/TableExplorer';
import { SchemaDiagram } from './components/SchemaDiagram';
import { SqlStudio } from './components/SqlStudio';
import { LiveStoreDemo } from './components/LiveStoreDemo';
import { BackupRestore } from './components/BackupRestore';
import {
  Database,
  Table,
  Cpu,
  Layers,
  ShoppingBag,
  Store,
  DollarSign,
  Download,
  Play,
  Sparkles,
  GitFork,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  const engine = DatabaseEngine.getInstance();
  const [db, setDb] = useState<DatabaseState>(() => engine.getDatabase());
  const [activeTab, setActiveTab] = useState<'tables' | 'schema' | 'sql' | 'live_demo' | 'backup'>('tables');

  // Sync state to local storage when changes occur
  const refreshDb = () => {
    setDb({ ...engine.getDatabase() });
  };

  // Actions
  const handleUpdateOrderStatus = (id: string, status: Order['status']) => {
    engine.updateOrderStatus(id, status);
    refreshDb();
  };

  const handleUpdateVendorStatus = (id: string, status: Vendor['status']) => {
    engine.updateVendorStatus(id, status);
    refreshDb();
  };

  const handleToggleProductStock = (id: string, current: boolean) => {
    engine.updateProduct(id, { in_stock: !current });
    refreshDb();
  };

  const handleDeleteRecord = (table: TableName, id: string) => {
    if (table === 'orders') engine.deleteOrder(id);
    else if (table === 'products') engine.deleteProduct(id);
    else if (table === 'vendors') engine.deleteVendor(id);
    refreshDb();
  };

  const handleAddProduct = (product: Omit<Product, 'id' | 'rating' | 'reviews_count'>) => {
    engine.addProduct(product);
    refreshDb();
  };

  const handleAddVendor = (vendor: Omit<Vendor, 'id' | 'registered_at'>) => {
    engine.addVendor(vendor);
    refreshDb();
  };

  const handleCreateOrder = (
    order: Omit<Order, 'id' | 'created_at'>,
    items: Array<{ product_id: string; product_name: string; quantity: number; unit_price: number }>
  ) => {
    engine.createOrder(order, items);
    refreshDb();
  };

  const handleRestore = (newState: DatabaseState) => {
    engine.saveDatabase(newState);
    setDb(newState);
  };

  const handleReset = () => {
    const fresh = engine.resetDatabase();
    setDb(fresh);
  };

  // Metrics
  const totalSales = db.orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const activeVendors = db.vendors.filter((v) => v.status === 'active').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Main Navigation */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  Sokoni Mkononi
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Database Engine & Studio
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <span>Hifadhidata ya Masoko ya Kariakoo, Tandale, Ilala & Kisutu</span>
                <span>•</span>
                <a
                  href="https://github.com/jovinsonandrew838-stack/sokoni-mkononi"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:underline flex items-center gap-0.5"
                >
                  <GitFork className="w-3 h-3" />
                  GitHub: jovinsonandrew838-stack
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 text-xs font-semibold">
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 shrink-0">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>Oda: <strong className="text-slate-900">{db.orders.length}</strong></span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 shrink-0">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Bidhaa: <strong className="text-slate-900">{db.products.length}</strong></span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 shrink-0">
              <Store className="w-4 h-4 text-purple-600" />
              <span>Wauzaji: <strong className="text-slate-900">{activeVendors}</strong></span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 shrink-0">
              <DollarSign className="w-4 h-4 text-amber-600" />
              <span>Mauzo: <strong className="text-slate-900">TZS {totalSales.toLocaleString()}</strong></span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-t border-slate-100 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('tables')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'tables'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              Majedwali ya Data (Table Explorer)
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'schema'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Muundo wa Mahusiano (ERD Schema)
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'sql'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              Kijaribu cha SQL & Msimbo (SQL Studio)
            </button>
            <button
              onClick={() => setActiveTab('live_demo')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'live_demo'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Majaribio ya Kuweka Oda (Live Store Sandbox)
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'backup'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              Nakala Rudufu (Backup & SQL Dump)
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        {activeTab === 'tables' && (
          <TableExplorer
            db={db}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateVendorStatus={handleUpdateVendorStatus}
            onToggleProductStock={handleToggleProductStock}
            onDeleteRecord={handleDeleteRecord}
            onAddProduct={handleAddProduct}
            onAddVendor={handleAddVendor}
          />
        )}

        {activeTab === 'schema' && <SchemaDiagram />}

        {activeTab === 'sql' && <SqlStudio db={db} />}

        {activeTab === 'live_demo' && (
          <LiveStoreDemo
            db={db}
            onCreateOrder={handleCreateOrder}
            onAddVendor={handleAddVendor}
            onGoToExplorer={() => setActiveTab('tables')}
          />
        )}

        {activeTab === 'backup' && (
          <BackupRestore db={db} onRestore={handleRestore} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <p>
          Hifadhidata ya <strong>Sokoni Mkononi</strong> • Imejengwa kulingana na kodi ya mradi wako katika GitHub:{' '}
          <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600">
            jovinsonandrew838-stack/sokoni-mkononi
          </code>
        </p>
      </footer>
    </div>
  );
}
