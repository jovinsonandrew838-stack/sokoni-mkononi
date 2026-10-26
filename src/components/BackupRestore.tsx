/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { DatabaseEngine } from '../db/dbEngine';
import { DatabaseState } from '../types';
import { Download, Upload, RotateCcw, Check, AlertTriangle, FileText, Database } from 'lucide-react';

interface BackupRestoreProps {
  db: DatabaseState;
  onRestore: (newState: DatabaseState) => void;
  onReset: () => void;
}

export const BackupRestore: React.FC<BackupRestoreProps> = ({ db, onRestore, onReset }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);

  const downloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(db, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sokoni_mkononi_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const downloadSQLDump = () => {
    let sql = `-- SOKONI MKONONI FULL SQL DATA DUMP\n-- Date: ${new Date().toISOString()}\n\n`;
    sql += DatabaseEngine.getInstance().generateSQLScript('postgres');
    sql += `\n\n-- SEED DATA\n`;

    // Products
    db.products.forEach((p) => {
      sql += `INSERT INTO products (id, name_sw, name_en, category, price, original_price, unit, origin, in_stock, stock_quantity, rating, reviews_count) VALUES ('${p.id}', '${p.name_sw.replace(/'/g, "''")}', '${p.name_en.replace(/'/g, "''")}', '${p.category}', ${p.price}, ${p.original_price}, '${p.unit}', '${p.origin}', ${p.in_stock}, ${p.stock_quantity}, ${p.rating}, ${p.reviews_count});\n`;
    });

    // Vendors
    db.vendors.forEach((v) => {
      sql += `INSERT INTO vendors (id, business_name, owner_name, phone, market_name, stall_number, category, subscription_plan, subscription_price_tzs, status) VALUES ('${v.id}', '${v.business_name.replace(/'/g, "''")}', '${v.owner_name.replace(/'/g, "''")}', '${v.phone}', '${v.market_name}', '${v.stall_number}', '${v.category}', '${v.subscription_plan}', ${v.subscription_price_tzs}, '${v.status}');\n`;
    });

    // Orders
    db.orders.forEach((o) => {
      sql += `INSERT INTO orders (id, customer_name, phone, delivery_zone, street_address, payment_method, subtotal, delivery_fee, total, status) VALUES ('${o.id}', '${o.customer_name.replace(/'/g, "''")}', '${o.phone}', '${o.delivery_zone}', '${o.street_address.replace(/'/g, "''")}', '${o.payment_method}', ${o.subtotal}, ${o.delivery_fee}, ${o.total}, '${o.status}');\n`;
    });

    const dataStr = 'data:text/sql;charset=utf-8,' + encodeURIComponent(sql);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sokoni_mkononi_dump_${new Date().toISOString().split('T')[0]}.sql`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.products && parsed.orders && parsed.vendors) {
          onRestore(parsed);
          setRestoreStatus('Database imerejeshwa vizuri kutoka kwenye faili!');
          setTimeout(() => setRestoreStatus(null), 4000);
        } else {
          setRestoreStatus('Hitilafu: Muundo wa faili si wa Sokoni Mkononi.');
        }
      } catch (err) {
        setRestoreStatus('Hitilafu katika kusoma faili la JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-600" />
          Hifadhi ya Nakala Rudufu & Urejeshaji (Backup & Disaster Recovery)
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Kama tulivyojifunza kwenye umuhimu wa database, kuwa na nakala rudufu za mara kwa mara ni kinga dhidi ya hitilafu za mfumo au upotevu wa data.
        </p>
      </div>

      {restoreStatus && (
        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{restoreStatus}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Export JSON */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Pakua Nakala (JSON Backup)</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Inapakua rekodi zote za sasa (bidhaa, oda, wateja, wauzaji) kama faili la JSON.
            </p>
          </div>
          <button
            onClick={downloadJSON}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            Pakua JSON Backup
          </button>
        </div>

        {/* Export SQL */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Pakua SQL Dump (.sql)</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Inapakua msimbo kamili wa SQL DDL pamoja na amri za <code>INSERT</code> za data zote.
            </p>
          </div>
          <button
            onClick={downloadSQLDump}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            Pakua SQL Dump
          </button>
        </div>

        {/* Import Backup */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Rejesha Data (Restore JSON)</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pandisha faili la backup la awali la JSON ili kurejesha data zote mara moja.
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
          >
            Pandisha Faili la JSON
          </button>
        </div>
      </div>

      {/* Danger Zone: Reset */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Rejesha Kwenye Hali ya Awali ya Kiwandani (Reset Database)</span>
          </div>
          <p className="text-xs text-rose-700">
            Hii itafuta marekebisho yote mapya na kurejesha data asili za masoko ya Kariakoo, Tandale, na Ilala.
          </p>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Una uhakika unataka kurejesha database kwenye hali ya kiwandani?')) {
              onReset();
            }
          }}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Weka Upya Data (Reset)
        </button>
      </div>
    </div>
  );
};
