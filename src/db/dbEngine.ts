/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DatabaseState, Product, Vendor, Order, OrderItem, Customer, TableName } from '../types';
import { INITIAL_DATABASE } from './initialData';

const STORAGE_KEY = 'sokoni_mkononi_database_v1';

export class DatabaseEngine {
  private static instance: DatabaseEngine;

  private constructor() {}

  public static getInstance(): DatabaseEngine {
    if (!DatabaseEngine.instance) {
      DatabaseEngine.instance = new DatabaseEngine();
    }
    return DatabaseEngine.instance;
  }

  public getDatabase(): DatabaseState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading database from storage:', e);
    }
    // Seed initial database
    this.saveDatabase(INITIAL_DATABASE);
    return INITIAL_DATABASE;
  }

  public saveDatabase(state: DatabaseState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error writing database to storage:', e);
    }
  }

  public resetDatabase(): DatabaseState {
    this.saveDatabase(INITIAL_DATABASE);
    return INITIAL_DATABASE;
  }

  // --- Products CRUD ---
  public addProduct(product: Omit<Product, 'id' | 'rating' | 'reviews_count'>): Product {
    const db = this.getDatabase();
    const newProduct: Product = {
      ...product,
      id: `PRD-${Date.now().toString().slice(-4)}`,
      rating: 5.0,
      reviews_count: 1,
    };
    db.products.unshift(newProduct);
    this.saveDatabase(db);
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): void {
    const db = this.getDatabase();
    db.products = db.products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    this.saveDatabase(db);
  }

  public deleteProduct(id: string): void {
    const db = this.getDatabase();
    db.products = db.products.filter((p) => p.id !== id);
    this.saveDatabase(db);
  }

  // --- Orders CRUD ---
  public createOrder(
    orderData: Omit<Order, 'id' | 'created_at'>,
    items: Array<{ product_id: string; product_name: string; quantity: number; unit_price: number }>
  ): Order {
    const db = this.getDatabase();
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      created_at: createdAt,
    };

    db.orders.unshift(newOrder);

    // Save order items
    items.forEach((item, index) => {
      const orderItem: OrderItem = {
        id: `ITEM-${orderId}-${index + 1}`,
        order_id: orderId,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price,
      };
      db.order_items.unshift(orderItem);

      // Deduct stock quantity
      const prod = db.products.find((p) => p.id === item.product_id);
      if (prod) {
        prod.stock_quantity = Math.max(0, prod.stock_quantity - item.quantity);
        if (prod.stock_quantity === 0) prod.in_stock = false;
      }
    });

    // Update or insert customer
    const existingCust = db.customers.find((c) => c.phone === orderData.phone);
    if (existingCust) {
      existingCust.total_orders += 1;
    } else {
      db.customers.push({
        id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
        full_name: orderData.customer_name,
        phone: orderData.phone,
        default_zone: orderData.delivery_zone,
        default_street: orderData.street_address,
        total_orders: 1,
        registered_at: createdAt,
      });
    }

    this.saveDatabase(db);
    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: Order['status']): void {
    const db = this.getDatabase();
    db.orders = db.orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    this.saveDatabase(db);
  }

  public deleteOrder(orderId: string): void {
    const db = this.getDatabase();
    db.orders = db.orders.filter((o) => o.id !== orderId);
    db.order_items = db.order_items.filter((i) => i.order_id !== orderId);
    this.saveDatabase(db);
  }

  // --- Vendors CRUD ---
  public addVendor(vendorData: Omit<Vendor, 'id' | 'registered_at'>): Vendor {
    const db = this.getDatabase();
    const newVendor: Vendor = {
      ...vendorData,
      id: `VND-${Math.floor(1000 + Math.random() * 9000)}`,
      registered_at: new Date().toISOString(),
    };
    db.vendors.unshift(newVendor);
    this.saveDatabase(db);
    return newVendor;
  }

  public updateVendorStatus(id: string, status: Vendor['status']): void {
    const db = this.getDatabase();
    db.vendors = db.vendors.map((v) => (v.id === id ? { ...v, status } : v));
    this.saveDatabase(db);
  }

  public deleteVendor(id: string): void {
    const db = this.getDatabase();
    db.vendors = db.vendors.filter((v) => v.id !== id);
    this.saveDatabase(db);
  }

  // --- SQL Schema Generator ---
  public generateSQLScript(dialect: 'postgres' | 'mysql' = 'postgres'): string {
    if (dialect === 'postgres') {
      return `-- =========================================================
-- DATABASE SCHEMA: Sokoni Mkononi (Digital Fresh Market)
-- Dialect: PostgreSQL (Supabase / Cloud SQL / Neon / Self-Hosted)
-- Created by AI Studio Database Engine
-- =========================================================

-- Wezesha UUID au Serial
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Majedwali ya Wafanyabiashara wa Masoko (Vendors)
CREATE TABLE IF NOT EXISTS vendors (
    id VARCHAR(32) PRIMARY KEY,
    business_name VARCHAR(150) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    market_name VARCHAR(100) NOT NULL, -- e.g. Kariakoo, Tandale, Ilala, Kigamboni
    stall_number VARCHAR(50),
    category VARCHAR(50) NOT NULL,
    city VARCHAR(50) DEFAULT 'Dar es Salaam',
    subscription_plan VARCHAR(20) DEFAULT 'starter', -- starter, pro, vip
    subscription_price_tzs INTEGER DEFAULT 2000,
    status VARCHAR(20) DEFAULT 'active', -- active, pending, suspended
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Majedwali ya Bidhaa (Products)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(32) PRIMARY KEY,
    name_sw VARCHAR(150) NOT NULL,
    name_en VARCHAR(150),
    category VARCHAR(50) NOT NULL, -- mboga, matunda, nyama, nafaka, viungo
    price NUMERIC(12, 2) NOT NULL,
    original_price NUMERIC(12, 2),
    unit VARCHAR(50) NOT NULL, -- Kilo 1, Fungu, Samaki 1
    origin VARCHAR(100),
    in_stock BOOLEAN DEFAULT TRUE,
    stock_quantity INTEGER DEFAULT 50,
    rating NUMERIC(2, 1) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    description_sw TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Majedwali ya Wateja (Customers)
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(32) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    default_zone VARCHAR(100),
    default_street VARCHAR(200),
    total_orders INTEGER DEFAULT 0,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Majedwali ya Oda za Wateja (Orders)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(32) PRIMARY KEY,
    customer_id VARCHAR(32) REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    delivery_zone VARCHAR(100) NOT NULL,
    street_address TEXT NOT NULL,
    payment_method VARCHAR(30) NOT NULL, -- mpesa, tigopesa, airtel, halopesa, cash
    subtotal NUMERIC(12, 2) NOT NULL,
    delivery_fee NUMERIC(12, 2) DEFAULT 0,
    total NUMERIC(12, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'pending', -- pending, processing, out_for_delivery, delivered, cancelled
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Majedwali ya Vipengele vya Oda (Order Items)
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(32) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(32) REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(150) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL
);

-- 6. Indices kwa Ajili ya Kasi ya Juu ya Utafutaji (Performance Indexing)
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);
CREATE INDEX IF NOT EXISTS idx_vendors_market ON vendors(market_name);

-- 7. Muonekano wa Mauzo na Ripoti (Analytical View)
CREATE OR REPLACE VIEW view_sokoni_daily_stats AS
SELECT 
    DATE(created_at) as sale_date,
    COUNT(id) as total_orders,
    SUM(total) as gross_sales_tzs,
    AVG(total) as average_order_value_tzs
FROM orders
WHERE status != 'cancelled'
GROUP BY DATE(created_at)
ORDER BY sale_date DESC;
`;
    } else {
      return `-- MySQL Version for Sokoni Mkononi
CREATE DATABASE IF NOT EXISTS sokoni_mkononi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sokoni_mkononi_db;

CREATE TABLE IF NOT EXISTS vendors (
    id VARCHAR(32) PRIMARY KEY,
    business_name VARCHAR(150) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    market_name VARCHAR(100) NOT NULL,
    stall_number VARCHAR(50),
    category VARCHAR(50) NOT NULL,
    city VARCHAR(50) DEFAULT 'Dar es Salaam',
    subscription_plan VARCHAR(20) DEFAULT 'starter',
    subscription_price_tzs INT DEFAULT 2000,
    status VARCHAR(20) DEFAULT 'active',
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(32) PRIMARY KEY,
    name_sw VARCHAR(150) NOT NULL,
    name_en VARCHAR(150),
    category VARCHAR(50) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    original_price DECIMAL(12, 2),
    unit VARCHAR(50) NOT NULL,
    origin VARCHAR(100),
    in_stock TINYINT(1) DEFAULT 1,
    stock_quantity INT DEFAULT 50,
    rating DECIMAL(2, 1) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    description_sw TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(32) PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    delivery_zone VARCHAR(100) NOT NULL,
    street_address TEXT NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    delivery_fee DECIMAL(12, 2) DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'pending',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(32) NOT NULL,
    product_id VARCHAR(32),
    product_name VARCHAR(150) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
`;
    }
  }
}
