/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name_sw: string;
  name_en: string;
  category: 'mboga' | 'matunda' | 'nyama' | 'nafaka' | 'mafuta' | 'viungo';
  price: number;
  original_price: number;
  unit: string;
  origin: string;
  in_stock: boolean;
  stock_quantity: number;
  rating: number;
  reviews_count: number;
  description_sw: string;
  image_url: string;
}

export type SubscriptionPlan = 'starter' | 'pro' | 'vip';

export interface Vendor {
  id: string;
  business_name: string;
  owner_name: string;
  phone: string;
  market_name: string; // e.g. Kariakoo, Tandale, Ilala, Temeke Stereo, Kisutu, Buguruni
  stall_number: string;
  category: string;
  city: string;
  subscription_plan: SubscriptionPlan;
  subscription_price_tzs: number;
  status: 'active' | 'pending' | 'suspended';
  registered_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  delivery_zone: string;
  street_address: string;
  payment_method: 'mpesa' | 'tigopesa' | 'airtel' | 'halopesa' | 'cash';
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: 'pending' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  notes?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Customer {
  id: string;
  full_name: string;
  phone: string;
  default_zone: string;
  default_street: string;
  total_orders: number;
  registered_at: string;
}

export interface InventoryLog {
  id: string;
  product_id: string;
  product_name: string;
  change_amount: number;
  reason: 'sale' | 'restock' | 'adjustment' | 'spoilage';
  created_at: string;
}

export type TableName = 'products' | 'vendors' | 'orders' | 'order_items' | 'customers' | 'inventory_logs';

export interface DatabaseState {
  products: Product[];
  vendors: Vendor[];
  orders: Order[];
  order_items: OrderItem[];
  customers: Customer[];
  inventory_logs: InventoryLog[];
}
