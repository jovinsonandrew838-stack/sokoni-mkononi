export type Language = 'sw' | 'en';
export type Currency = 'TZS' | 'USD';

export type PaymentChannel = 
  | 'mpesa' 
  | 'tigopesa' 
  | 'airtel' 
  | 'halopesa' 
  | 'card' 
  | 'bank' 
  | 'paypal';

export type DarMarket = 
  | 'Kariakoo' 
  | 'Ilala' 
  | 'Tandale' 
  | 'Buguruni' 
  | 'Mabibo' 
  | 'Kawe' 
  | 'Tegeta';

export interface Vendor {
  id: string;
  name: string;
  marketName: DarMarket;
  stallNumber: string;
  phone: string;
  mno: 'mpesa' | 'tigopesa' | 'airtel' | 'halopesa';
  specialty: string;
  rating: number;
  totalSalesCount: number;
  totalSoldTZS: number;
  totalNetEarned95TZS: number;
  pendingPayoutTZS: number;
  
  // Ada ya Kujiunga (TZS 2,000 Onboarding Fee)
  registrationFeePaid: boolean;
  registrationFeeTZS: number; // 2000 TZS
  registrationDate: string;
  registrationRef: string;
}

export interface VendorRegistrationRecord {
  id: string;
  vendorId: string;
  vendorName: string;
  marketName: DarMarket;
  phone: string;
  amountTZS: number; // 2,000 TZS
  channel: 'mpesa' | 'tigopesa' | 'airtel' | 'halopesa';
  referenceNumber: string;
  date: string;
  timestamp: number;
  status: 'completed';
}

export interface ProduceItem {
  id: string;
  name: string;
  nameSw: string;
  category: 'Mboga za Majani' | 'Nyanya & Viungo' | 'Vitunguu & Viazi' | 'Matunda ya Soko';
  priceTZS: number;
  unit: string; // e.g. "Kilo 1", "Fungu Kubwa", "Fungu la TZS 1,000", "Tenga Dogo"
  image: string;
  vendorId: string;
  vendorName: string;
  marketName: DarMarket;
  quantity: number;
  inStock: boolean;
}

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface MarketplaceOrder {
  id: string;
  referenceNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryLocation: string; // e.g. "Kinondoni Manyanya", "Sinza Kijiweni", "Masaki"
  items: ProduceItem[];
  
  // 5% Platform Commission Split Breakdown
  grossItemsTZS: number;
  platformCommission5PctTZS: number; // 5% for the website owner!
  vendorNet95PctTZS: number;         // 95% for the vegetable seller!
  deliveryFeeTZS: number;            // Paid to rider/boda
  totalPaidByCustomerTZS: number;    // Gross + Delivery

  channel: PaymentChannel;
  status: TransactionStatus;
  vendorPayoutStatus: 'pending' | 'disbursed';
  vendorPayoutRef?: string;
  date: string;
  timestamp: number;
  operatorRef?: string;
}

export interface PayoutRecord {
  id: string;
  payoutRef: string;
  recipientType: 'platform_owner' | 'vendor';
  destinationName: string;
  accountNumber: string;
  provider: 'mpesa' | 'tigopesa' | 'airtel' | 'crdb' | 'nmb';
  amountTZS: number;
  feeTZS: number;
  status: 'completed' | 'processing';
  date: string;
  timestamp: number;
  note?: string;
}
