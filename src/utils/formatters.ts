import { Currency } from '../types';

export const USD_EXCHANGE_RATE = 2650; // 1 USD = 2,650 TZS

export function formatMoney(amountTZS: number, currency: Currency): string {
  if (currency === 'USD') {
    const usd = amountTZS / USD_EXCHANGE_RATE;
    return `$${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `TZS ${amountTZS.toLocaleString('en-US')}`;
}

export function formatTZS(amount: number): string {
  return `TZS ${Math.round(amount).toLocaleString('en-US')}`;
}

export function formatUSD(amountTZS: number): string {
  const usd = amountTZS / USD_EXCHANGE_RATE;
  return `$${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function generateRef(prefix = 'LP'): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-TZ-${num}`;
}

export function generateControlNumber(): string {
  // Typical 12-digit Government / Bank control number format
  return `99${Math.floor(1000000000 + Math.random() * 9000000000)}`;
}

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  const parts = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.substring(i, i + 4));
  }
  return parts.join(' ');
}

export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

export function formatPhoneNumber(val: string): string {
  let cleaned = val.replace(/\D/g, '');
  if (cleaned.startsWith('255')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }
  return cleaned.slice(0, 9);
}
