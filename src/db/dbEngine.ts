/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, PRODUCTS } from '../data/products';
import { OrderDetails, Vendor } from '../types';

const STORAGE_KEY_ORDERS = 'sokoni_mkononi_orders_v1';
const STORAGE_KEY_VENDORS = 'sokoni_mkononi_vendors_v1';
const STORAGE_KEY_PRODUCTS = 'sokoni_mkononi_products_v1';

export const INITIAL_ORDERS: OrderDetails[] = [
  {
    orderId: 'ORD-8821',
    customerName: 'Amina Salum',
    phone: '0712 345 678',
    deliveryZone: 'Kigamboni (Dar es Salaam)',
    streetAddress: 'Mtaa wa Mjimwema, Nyumba Na. 14',
    paymentMethod: 'mpesa',
    items: [
      { product: PRODUCTS[0], quantity: 2 },
      { product: PRODUCTS[2], quantity: 1 },
    ],
    subtotal: 21500,
    deliveryFee: 2000,
    total: 23500,
    notes: 'Tafadhali samaki asafishwe na kukatwa vipande.',
    createdAt: 'Leo, 07:45 Asubuhi',
    status: 'out_for_delivery',
  },
  {
    orderId: 'ORD-8820',
    customerName: 'Baraka John Mwita',
    phone: '0765 890 123',
    deliveryZone: 'Kinondoni & Mikocheni',
    streetAddress: 'Mikocheni B, Karibu na Shoppers Plaza',
    paymentMethod: 'tigopesa',
    items: [
      { product: PRODUCTS[1], quantity: 2 },
      { product: PRODUCTS[5], quantity: 1 },
    ],
    subtotal: 42000,
    deliveryFee: 4000,
    total: 46000,
    notes: 'Piga simu ukifika getini.',
    createdAt: 'Jana, 04:20 Jioni',
    status: 'delivered',
  },
  {
    orderId: 'ORD-8819',
    customerName: 'Jovinson Andrew',
    phone: '0704 205 872',
    deliveryZone: 'Sinza & Mwenge',
    streetAddress: 'Sinza Palestina, Mkabala na Hospitali',
    paymentMethod: 'mpesa',
    items: [
      { product: PRODUCTS[4], quantity: 5 },
      { product: PRODUCTS[6], quantity: 2 },
    ],
    subtotal: 19000,
    deliveryFee: 2500,
    total: 21500,
    notes: 'Weka kwenye mfuko maalum wa mazao.',
    createdAt: 'Leo, 08:15 Asubuhi',
    status: 'pending',
  },
];

export const INITIAL_VENDORS: Vendor[] = [
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
  {
    id: 'VND-3012',
    businessName: 'Nafaka Safi Dodoma & Kyela',
    ownerName: 'Mzee Mwakatobe',
    phone: '0768 998 877',
    marketName: 'Soko Kuu la Kariakoo',
    stallNumber: 'Fremu Na. 42, Ghorofa ya Chini',
    category: 'nafaka',
    city: 'Dar es Salaam',
    registeredAt: '2026-10-01',
    status: 'active',
    productsCount: 15,
    subscriptionPlan: 'starter',
    subscriptionPriceTZS: 2000,
    subscriptionBillingCycle: 'monthly',
    registrationFeePaid: true,
    registrationFeeTZS: 2000,
    paymentMethod: 'airtel',
    paymentRef: 'AT261001.1100.C3',
  },
];

export class DatabaseEngine {
  private static instance: DatabaseEngine;

  private constructor() {}

  public static getInstance(): DatabaseEngine {
    if (!DatabaseEngine.instance) {
      DatabaseEngine.instance = new DatabaseEngine();
    }
    return DatabaseEngine.instance;
  }

  // Orders
  public getOrders(): OrderDetails[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    this.saveOrders(INITIAL_ORDERS);
    return INITIAL_ORDERS;
  }

  public saveOrders(orders: OrderDetails[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }

  public addOrder(order: OrderDetails): void {
    const orders = this.getOrders();
    const updated = [order, ...orders];
    this.saveOrders(updated);
  }

  public updateOrderStatus(orderId: string, status: OrderDetails['status']): void {
    const orders = this.getOrders();
    const updated = orders.map((o) => (o.orderId === orderId ? { ...o, status } : o));
    this.saveOrders(updated);
  }

  // Vendors
  public getVendors(): Vendor[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_VENDORS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    this.saveVendors(INITIAL_VENDORS);
    return INITIAL_VENDORS;
  }

  public saveVendors(vendors: Vendor[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_VENDORS, JSON.stringify(vendors));
    } catch (e) {
      console.error(e);
    }
  }

  public addVendor(vendor: Vendor): void {
    const vendors = this.getVendors();
    const updated = [vendor, ...vendors];
    this.saveVendors(updated);
  }

  // Products
  public getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    this.saveProducts(PRODUCTS);
    return PRODUCTS;
  }

  public saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }

  public updateProductPrice(productId: string, newPrice: number): void {
    const products = this.getProducts();
    const updated = products.map((p) => (p.id === productId ? { ...p, price: newPrice } : p));
    this.saveProducts(updated);
  }

  public toggleProductStock(productId: string): void {
    const products = this.getProducts();
    const updated = products.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p));
    this.saveProducts(updated);
  }

  // SQL Script generator
  public generateSQL(): string {
    return `-- =========================================================
-- DATABASE SCHEMA: Sokoni Mkononi (Digital Fresh Market)
-- Dialect: PostgreSQL (Supabase / Cloud SQL / Neon / Self-Hosted)
-- =========================================================

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
    subscription_price_tzs INTEGER DEFAULT 2000,
    status VARCHAR(20) DEFAULT 'active',
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(32) PRIMARY KEY,
    name_sw VARCHAR(150) NOT NULL,
    name_en VARCHAR(150),
    category VARCHAR(50) NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    original_price NUMERIC(12, 2),
    unit VARCHAR(50) NOT NULL,
    origin VARCHAR(100),
    in_stock BOOLEAN DEFAULT TRUE,
    rating NUMERIC(2, 1) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(32) PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    delivery_zone VARCHAR(100) NOT NULL,
    street_address TEXT NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    delivery_fee NUMERIC(12, 2) DEFAULT 0,
    total NUMERIC(12, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
`;
  }
}
