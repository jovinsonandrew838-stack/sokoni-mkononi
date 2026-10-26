/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DatabaseEngine } from '../db/dbEngine';
import { DatabaseState } from '../types';
import { Terminal, Copy, Check, Play, Code2, Sparkles, Clock, Table } from 'lucide-react';

interface SqlStudioProps {
  db: DatabaseState;
}

interface QueryPreset {
  id: string;
  title: string;
  sql: string;
  description: string;
  runner: (db: DatabaseState) => any[];
}

export const SqlStudio: React.FC<SqlStudioProps> = ({ db }) => {
  const engine = DatabaseEngine.getInstance();
  const [dialect, setDialect] = useState<'postgres' | 'mysql'>('postgres');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'simulator' | 'ddl'>('simulator');

  const presets: QueryPreset[] = [
    {
      id: 'pending_orders',
      title: 'Oda Zote Zinazosubiri (Pending Orders)',
      sql: `SELECT id, customer_name, phone, delivery_zone, total, payment_method \nFROM orders \nWHERE status = 'pending';`,
      description: 'Inaonyesha oda zote mpya za wateja ambazo bado hazijafungwa au kupelekwa.',
      runner: (state) =>
        state.orders
          .filter((o) => o.status === 'pending')
          .map((o) => ({
            id: o.id,
            customer_name: o.customer_name,
            phone: o.phone,
            delivery_zone: o.delivery_zone,
            total_tzs: o.total,
            payment: o.payment_method,
            created: new Date(o.created_at).toLocaleTimeString(),
          })),
    },
    {
      id: 'vendors_by_market',
      title: 'Wauzaji Kulingana na Masoko (Vendors by Market)',
      sql: `SELECT market_name, COUNT(id) AS total_vendors, SUM(subscription_price_tzs) AS monthly_revenue \nFROM vendors \nGROUP BY market_name;`,
      description: 'Hesabu ya wafanyabiashara waliojiunga katika kila soko (Kariakoo, Tandale, Ilala, n.k.).',
      runner: (state) => {
        const groups: Record<string, { count: number; revenue: number }> = {};
        state.vendors.forEach((v) => {
          if (!groups[v.market_name]) groups[v.market_name] = { count: 0, revenue: 0 };
          groups[v.market_name].count += 1;
          groups[v.market_name].revenue += v.subscription_price_tzs;
        });
        return Object.entries(groups).map(([market, data]) => ({
          market_name: market,
          total_vendors: data.count,
          monthly_subscription_tzs: data.revenue,
        }));
      },
    },
    {
      id: 'top_products',
      title: 'Bidhaa Zenye Bei ya Juu (Highest Value Products)',
      sql: `SELECT id, name_sw, category, price, stock_quantity \nFROM products \nWHERE in_stock = TRUE \nORDER BY price DESC;`,
      description: 'Orodha ya bidhaa zilizopo stoo zikipangwa kuanzia ya bei ya juu hadi chini.',
      runner: (state) =>
        state.products
          .filter((p) => p.in_stock)
          .sort((a, b) => b.price - a.price)
          .map((p) => ({
            id: p.id,
            name_sw: p.name_sw,
            category: p.category,
            price_tzs: p.price,
            stock_qty: p.stock_quantity,
            unit: p.unit,
          })),
    },
    {
      id: 'sales_by_item',
      title: 'Mauzo kwa Kila Bidhaa (Revenue by Product Item)',
      sql: `SELECT product_name, SUM(quantity) AS total_sold, SUM(total_price) AS total_revenue \nFROM order_items \nGROUP BY product_name \nORDER BY total_revenue DESC;`,
      description: 'Uchambuzi wa mauzo ya kila bidhaa kwenye oda zote zilizowahi kuwekwa.',
      runner: (state) => {
        const itemsMap: Record<string, { qty: number; revenue: number }> = {};
        state.order_items.forEach((item) => {
          if (!itemsMap[item.product_name]) itemsMap[item.product_name] = { qty: 0, revenue: 0 };
          itemsMap[item.product_name].qty += item.quantity;
          itemsMap[item.product_name].revenue += item.total_price;
        });
        return Object.entries(itemsMap)
          .map(([name, d]) => ({
            product_name: name,
            total_sold_qty: d.qty,
            total_revenue_tzs: d.revenue,
          }))
          .sort((a, b) => b.total_revenue_tzs - a.total_revenue_tzs);
      },
    },
  ];

  const [selectedPreset, setSelectedPreset] = useState<QueryPreset>(presets[0]);
  const [currentSql, setCurrentSql] = useState(presets[0].sql);
  const [queryResults, setQueryResults] = useState<any[]>(presets[0].runner(db));
  const [execTime, setExecTime] = useState('0.6 ms');

  const runQuery = (preset: QueryPreset) => {
    setSelectedPreset(preset);
    setCurrentSql(preset.sql);
    const start = performance.now();
    const res = preset.runner(db);
    const duration = (performance.now() - start).toFixed(1);
    setQueryResults(res);
    setExecTime(`${Math.max(0.4, Number(duration))} ms`);
  };

  const copyDdl = () => {
    const ddl = engine.generateSQLScript(dialect);
    navigator.clipboard.writeText(ddl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'simulator'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            Kijaribu cha SQL (SQL Query Simulator)
          </button>
          <button
            onClick={() => setActiveTab('ddl')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ddl'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Msimbo wa Schema (SQL DDL Script)
          </button>
        </div>

        {activeTab === 'ddl' && (
          <div className="flex items-center gap-2">
            <select
              value={dialect}
              onChange={(e) => setDialect(e.target.value as any)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium"
            >
              <option value="postgres">PostgreSQL (Supabase / Cloud SQL)</option>
              <option value="mysql">MySQL</option>
            </select>
            <button
              onClick={copyDdl}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Imenakiliwa!' : 'Nakili SQL'}
            </button>
          </div>
        )}
      </div>

      {/* View 1: SQL Simulator */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          {/* Query Presets Pills */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Chagua Swali la SQL la Kujaribu:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => runQuery(preset)}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    selectedPreset.id === preset.id
                      ? 'border-indigo-400 bg-indigo-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900 truncate">{preset.title}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {preset.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* SQL Editor Area */}
          <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-lg border border-slate-800">
            <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>SQL Query Console</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                  <Clock className="w-3 h-3" /> {execTime}
                </span>
                <button
                  onClick={() => runQuery(selectedPreset)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Tekeleza (Run)
                </button>
              </div>
            </div>
            <pre className="p-4 font-mono text-xs text-indigo-300 overflow-x-auto leading-relaxed">
              {currentSql}
            </pre>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-0">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-2">
                <Table className="w-4 h-4 text-indigo-600" />
                Matokeo ya Swali: ({queryResults.length} safu zimepatikana)
              </span>
              <span className="text-[11px] text-slate-500">Imeendeshwa kwa data halisi ya hifadhidata</span>
            </div>

            {queryResults.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/60 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      {Object.keys(queryResults[0]).map((key) => (
                        <th key={key} className="py-2.5 px-4 font-mono">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {queryResults.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                        {Object.values(row).map((val, idx) => (
                          <td key={idx} className="py-2.5 px-4 text-slate-700">
                            {typeof val === 'number' ? val.toLocaleString() : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                Hakuna data iliyopatikana kwa swali hili.
              </div>
            )}
          </div>
        </div>
      )}

      {/* View 2: SQL DDL Script */}
      {activeTab === 'ddl' && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
            💡 <strong>Msimbo Huu Uko Tayari:</strong> Unaweza kunakili msimbo huu moja kwa moja na kuuweka kwenye <strong>Supabase</strong>, <strong>PostgreSQL</strong>, <strong>Neon</strong>, au <strong>MySQL</strong> ili kuunda database yako ya uzalishaji (production).
          </div>
          <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-md">
            <pre className="p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-[500px] leading-relaxed">
              {engine.generateSQLScript(dialect)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
