import { Product } from './data/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Language = 'sw' | 'en';

export interface OrderDetails {
  orderId: string;
  customerName: string;
  phone: string;
  deliveryZone: string;
  streetAddress: string;
  paymentMethod: 'mpesa' | 'tigopesa' | 'airtel' | 'halopesa' | 'cash';
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  notes?: string;
  createdAt: string;
}

export interface Vendor {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  marketName: string; // e.g. Kariakoo, Tandale, Ilala, Temeke Stereo, Kisutu, Buguruni
  stallNumber: string;
  category: string;
  city: string;
  registeredAt: string;
  status: 'active' | 'pending';
  productsCount: number;
  registrationFeePaid: boolean;
  registrationFeeTZS: number;
  paymentMethod?: string;
  paymentRef?: string;
}
