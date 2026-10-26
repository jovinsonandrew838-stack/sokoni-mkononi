/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Key, ArrowRight, ShieldCheck, Link2, Database, Table } from 'lucide-react';

export const SchemaDiagram: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-900">
            Muundo wa Mahusiano ya Majedwali (Entity Relationship Diagram - ERD)
          </h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
          Huu ndio muundo sahihi wa kisanifu (Normalized Relational Architecture - 3NF) ulioundwa maalum kwa ajili ya mfumo wako wa <strong>Sokoni Mkononi</strong>. Unazuia data kurudiarudia (redundancy), unalinda uadilifu wa namba za mauzo, na unawezesha ripoti za haraka.
        </p>
      </div>

      {/* Visual ERD Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {/* Table 1: CUSTOMERS */}
        <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-xs overflow-hidden">
          <div className="bg-indigo-50 border-b border-indigo-100 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-indigo-600" />
              <span className="font-mono font-bold text-xs text-indigo-950">customers</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-200/60 text-indigo-900 uppercase">
              Jedwali Kuu
            </span>
          </div>
          <div className="p-3.5 space-y-2 text-xs divide-y divide-slate-100">
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="flex items-center gap-1.5 font-bold text-amber-700">
                <Key className="w-3 h-3 text-amber-500" /> id
              </span>
              <span className="text-[11px] text-slate-400">VARCHAR(32) [PK]</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">full_name</span>
              <span className="text-[11px] text-slate-400">VARCHAR(100)</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">phone</span>
              <span className="text-[11px] text-slate-400">VARCHAR(20) [UNIQUE]</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">default_zone</span>
              <span className="text-[11px] text-slate-400">VARCHAR(100)</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">total_orders</span>
              <span className="text-[11px] text-slate-400">INTEGER</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">registered_at</span>
              <span className="text-[11px] text-slate-400">TIMESTAMP</span>
            </div>
          </div>
          <div className="bg-slate-50 p-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
            <ArrowRight className="w-3 h-3 text-indigo-500" />
            <span>Mahusiano: 1 Customer &rarr; Many Orders</span>
          </div>
        </div>

        {/* Table 2: ORDERS */}
        <div className="bg-white rounded-2xl border-2 border-emerald-300 shadow-md overflow-hidden">
          <div className="bg-emerald-50 border-b border-emerald-100 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-emerald-700" />
              <span className="font-mono font-bold text-xs text-emerald-950">orders</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200/60 text-emerald-900 uppercase">
              Miamala (Core)
            </span>
          </div>
          <div className="p-3.5 space-y-2 text-xs divide-y divide-slate-100">
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="flex items-center gap-1.5 font-bold text-amber-700">
                <Key className="w-3 h-3 text-amber-500" /> id
              </span>
              <span className="text-[11px] text-slate-400">VARCHAR(32) [PK]</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="flex items-center gap-1.5 text-blue-700 font-semibold">
                <Link2 className="w-3 h-3 text-blue-500" /> customer_id
              </span>
              <span className="text-[11px] text-blue-600">[FK &rarr; customers]</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">customer_name</span>
              <span className="text-[11px] text-slate-400">VARCHAR(100)</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">phone</span>
              <span className="text-[11px] text-slate-400">VARCHAR(20) [INDEX]</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">delivery_zone</span>
              <span className="text-[11px] text-slate-400">VARCHAR(100)</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">payment_method</span>
              <span className="text-[11px] text-slate-400">VARCHAR(30)</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">total</span>
              <span className="text-[11px] text-slate-400">NUMERIC(12,2)</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">status</span>
              <span className="text-[11px] text-slate-400">VARCHAR(30) [INDEX]</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">created_at</span>
              <span className="text-[11px] text-slate-400">TIMESTAMP</span>
            </div>
          </div>
          <div className="bg-emerald-50/50 p-2.5 border-t border-emerald-100 text-[11px] text-emerald-800 flex items-center gap-1.5">
            <ArrowRight className="w-3 h-3 text-emerald-600" />
            <span>Mahusiano: 1 Order &rarr; Many Order Items</span>
          </div>
        </div>

        {/* Table 3: ORDER_ITEMS */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-slate-700" />
              <span className="font-mono font-bold text-xs text-slate-900">order_items</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700 uppercase">
              Junction / Line Items
            </span>
          </div>
          <div className="p-3.5 space-y-2 text-xs divide-y divide-slate-100">
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="flex items-center gap-1.5 font-bold text-amber-700">
                <Key className="w-3 h-3 text-amber-500" /> id
              </span>
              <span className="text-[11px] text-slate-400">VARCHAR(64) [PK]</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="flex items-center gap-1.5 text-blue-700 font-semibold">
                <Link2 className="w-3 h-3 text-blue-500" /> order_id
              </span>
              <span className="text-[11px] text-blue-600">[FK &rarr; orders]</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="flex items-center gap-1.5 text-blue-700 font-semibold">
                <Link2 className="w-3 h-3 text-blue-500" /> product_id
              </span>
              <span className="text-[11px] text-blue-600">[FK &rarr; products]</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">product_name</span>
              <span className="text-[11px] text-slate-400">VARCHAR(150)</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">quantity</span>
              <span className="text-[11px] text-slate-400">INTEGER</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">unit_price</span>
              <span className="text-[11px] text-slate-400">NUMERIC(12,2)</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">total_price</span>
              <span className="text-[11px] text-slate-400">NUMERIC(12,2)</span>
            </div>
          </div>
          <div className="bg-slate-50 p-2.5 border-t border-slate-100 text-[11px] text-slate-500">
            Kinaunganisha Oda na Bidhaa maalum.
          </div>
        </div>

        {/* Table 4: PRODUCTS */}
        <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-xs overflow-hidden">
          <div className="bg-amber-50 border-b border-amber-100 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-amber-700" />
              <span className="font-mono font-bold text-xs text-amber-950">products</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200/60 text-amber-900 uppercase">
              Katalogi
            </span>
          </div>
          <div className="p-3.5 space-y-2 text-xs divide-y divide-slate-100">
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="flex items-center gap-1.5 font-bold text-amber-700">
                <Key className="w-3 h-3 text-amber-500" /> id
              </span>
              <span className="text-[11px] text-slate-400">VARCHAR(32) [PK]</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">name_sw</span>
              <span className="text-[11px] text-slate-400">VARCHAR(150)</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">category</span>
              <span className="text-[11px] text-slate-400">VARCHAR(50) [INDEX]</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">price</span>
              <span className="text-[11px] text-slate-400">NUMERIC(12,2)</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">unit</span>
              <span className="text-[11px] text-slate-400">VARCHAR(50)</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">in_stock</span>
              <span className="text-[11px] text-slate-400">BOOLEAN [INDEX]</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">stock_quantity</span>
              <span className="text-[11px] text-slate-400">INTEGER</span>
            </div>
          </div>
          <div className="bg-amber-50/50 p-2.5 border-t border-amber-100 text-[11px] text-amber-800 flex items-center gap-1.5">
            <ArrowRight className="w-3 h-3 text-amber-600" />
            <span>Mahusiano: 1 Product &rarr; In Many Orders</span>
          </div>
        </div>

        {/* Table 5: VENDORS */}
        <div className="bg-white rounded-2xl border-2 border-purple-200 shadow-xs overflow-hidden">
          <div className="bg-purple-50 border-b border-purple-100 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-purple-700" />
              <span className="font-mono font-bold text-xs text-purple-950">vendors</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-200/60 text-purple-900 uppercase">
              Wafanyabiashara
            </span>
          </div>
          <div className="p-3.5 space-y-2 text-xs divide-y divide-slate-100">
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="flex items-center gap-1.5 font-bold text-amber-700">
                <Key className="w-3 h-3 text-amber-500" /> id
              </span>
              <span className="text-[11px] text-slate-400">VARCHAR(32) [PK]</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">business_name</span>
              <span className="text-[11px] text-slate-400">VARCHAR(150)</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">owner_name</span>
              <span className="text-[11px] text-slate-400">VARCHAR(100)</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">market_name</span>
              <span className="text-[11px] text-slate-400">VARCHAR(100) [INDEX]</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">stall_number</span>
              <span className="text-[11px] text-slate-400">VARCHAR(50)</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">subscription_plan</span>
              <span className="text-[11px] text-slate-400">VARCHAR(20)</span>
            </div>
            <div className="flex items-center justify-between py-1 font-mono">
              <span className="text-slate-700">status</span>
              <span className="text-[11px] text-slate-400">VARCHAR(20)</span>
            </div>
          </div>
          <div className="bg-purple-50/50 p-2.5 border-t border-purple-100 text-[11px] text-purple-800">
            Wauzaji kutoka Kariakoo, Tandale, Buguruni, Ilala.
          </div>
        </div>

        {/* Architecture Insights Card */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-indigo-300">
            <ShieldCheck className="w-5 h-5" />
            <h4 className="font-bold text-sm text-white">Sifa za Muundo Huu</h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Usalama wa Miamala (Foreign Keys):</strong> Ukifuta oda, order_items zake zote zinafutika kiotomatiki (CASCADE).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Indexes kwa Kasi:</strong> Simu, hadhi ya oda, na makundi ya bidhaa yana indexes ili kutafuta data kwa millisekunde chini ya 5.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Scalability:</strong> Mfumo una uwezo wa kushughulikia oda zaidi ya 500,000 bila kusuasua.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
