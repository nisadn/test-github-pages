import { isValidCurrencyCode } from './_internal';
import { CurrencyCode, CurrencyInfo } from './types';

/**
 * Configuration for various currencies.
 * Taken from the existing `currencyInfoConfig` object.
 * With addition of `pattern` and `symbol` properties from the `www` repo.
 */
const currencyInfoConfig: Record<CurrencyCode, CurrencyInfo> = {
  AED: {
    // UAE Dirham
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    pattern: '%s %v',
  },
  AUD: {
    // Australian Dollar
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    symbol: 'AU$',
    pattern: '%s %v',
  },
  BHD: {
    // Bahraini Dinar
    decimalPlaces: 3,
    thousandSymbol: ',',
    decimalSymbol: '.',
    pattern: '%s %v',
  },
  BND: {
    // Brunei Dollar
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    pattern: '%s %v',
  },
  BRL: {
    // Brazilian Real
    decimalPlaces: 2,
    thousandSymbol: '.',
    decimalSymbol: ',',
    symbol: 'R$',
    pattern: '%s %v',
  },
  CAD: {
    // Canadian Dollar
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    symbol: 'CA$',
    pattern: '%s %v',
  },
  CHF: {
    // Swiss Franc
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    pattern: '%s %v',
  },
  CNY: {
    // Chinese Yuan Renminbi
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    symbol: 'CN¥',
    pattern: '%s %v',
  },
  COP: {
    // Colombian Peso
    decimalPlaces: 2,
    thousandSymbol: '.',
    decimalSymbol: ',',
    pattern: '%s %v',
  },
  EGP: {
    // Egyptian Pound
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    pattern: '%s %v',
  },
  EUR: {
    // European Euro
    decimalPlaces: 2,
    thousandSymbol: '.',
    decimalSymbol: ',',
    symbol: '€',
    pattern: '%s%v',
  },
  FJD: {
    // Fijian Dollar
    decimalPlaces: 2,
    thousandSymbol: '.',
    decimalSymbol: ',',
    pattern: '%s %v',
  },
  GBP: {
    // Pound sterling
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    symbol: '£',
    pattern: '%s%v',
  },
  HKD: {
    // Hong Kong Dollar
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    symbol: 'HK$',
    pattern: '%s %v',
  },
  IDR: {
    // Indonesian Rupiah
    decimalPlaces: 0,
    thousandSymbol: '.',
    decimalSymbol: ',',
    symbol: 'Rp',
    pattern: '%s%v',
  },
  ILS: {
    // Israeli New Shekel
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    pattern: '%s %v',
  },
  INR: {
    // Indian Rupee
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    symbol: '₹',
    pattern: '%s%v',
  },
  JOD: {
    // Jordanian Dinar
    decimalPlaces: 3,
    thousandSymbol: ',',
    decimalSymbol: '.',
    pattern: '%s %v',
  },
  JPY: {
    // Japanese Yen
    decimalPlaces: 0,
    thousandSymbol: ',',
    decimalSymbol: '.',
    symbol: '¥',
    pattern: '%s%v',
  },
  KHR: {
    // Cambodian Riel
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    symbol: '៛',
    pattern: '%s%v',
  },
  KRW: {
    // South Korean Won
    decimalPlaces: 0,
    thousandSymbol: ',',
    decimalSymbol: '.',
    symbol: '₩',
    pattern: '%s%v',
  },
  KWD: {
    // Kuwaiti Dinar
    decimalPlaces: 2, // Expected to be 2, not following the ISO4217 standard
    thousandSymbol: ',',
    decimalSymbol: '.',
    pattern: '%s %v',
  },
  LAK: {
    // Lao Kip
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    pattern: '%s %v',
  },
  LBP: {
    // Lebanese Pound
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    pattern: '%s %v',
  },
  LKR: {
    // Sri Lankan Rupee
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    pattern: '%s %v',
  },
  MMK: {
    // Myanmar Kyat
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    pattern: '%s %v',
  },
  MOP: {
    // Macanese Pataca
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    pattern: '%s %v',
  },
  MVR: {
    // Maldivian Rufiyaa
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    pattern: '%s %v',
  },
  MXN: {
    // Mexican Peso
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    pattern: '%s %v',
  },
  MYR: {
    // Malaysian Ringgit
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    symbol: 'RM',
    pattern: '%s%v',
  },
  NPR: {
    // Nepalese Rupee
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    pattern: '%s %v',
  },
  NZD: {
    // New Zealand Dollar
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    symbol: 'NZ$',
    pattern: '%s %v',
  },
  OMR: {
    // Omani Rial
    decimalPlaces: 3,
    thousandSymbol: ',',
    decimalSymbol: '.',
    pattern: '%s %v',
  },
  PHP: {
    // Philippine Peso
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    symbol: '₱',
    pattern: '%s%v',
  },
  PLN: {
    // Polish Zloty
    decimalPlaces: 2,
    thousandSymbol: '.',
    decimalSymbol: ',',
    pattern: '%s %v',
  },
  QAR: {
    // Qatari Riyal
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    pattern: '%s %v',
  },
  RUB: {
    // Russian Ruble
    decimalPlaces: 2,
    thousandSymbol: '.',
    decimalSymbol: ',',
    pattern: '%s %v',
  },
  SAR: {
    // Saudi Arabian Riyal
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    pattern: '%s %v',
  },
  SEK: {
    // Swedish Krona
    decimalPlaces: 2,
    thousandSymbol: '.',
    decimalSymbol: ',',
    pattern: '%s %v',
  },
  SGD: {
    // Singapore Dollar
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    symbol: 'S$',
    pattern: '%s %v',
  },
  THB: {
    // Thai Baht
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    symbol: '฿',
    pattern: '%s%v',
  },
  TRY: {
    // Turkish Lira
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    symbol: '₺',
    pattern: '%s%v',
  },
  TWD: {
    // New Taiwan Dollar
    decimalPlaces: 0,
    thousandSymbol: ',',
    decimalSymbol: '.',
    symbol: 'NT$',
    pattern: '%s %v',
  },
  USD: {
    // United States Dollar
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    symbol: 'US$',
    pattern: '%s %v',
  },
  VNC: {
    // Vietnamese Old Dong (not valid ISO4217 code)
    decimalPlaces: 0,
    thousandSymbol: '.',
    decimalSymbol: ',',
    symbol: '₫',
    pattern: '%v%s',
  },
  VND: {
    // Vietnamese Dong
    decimalPlaces: 0,
    thousandSymbol: '.',
    decimalSymbol: ',',
    symbol: '₫',
    pattern: '%s%v',
  },
  ZAR: {
    // South African Rand
    decimalPlaces: 2,
    thousandSymbol: ',',
    decimalSymbol: '.',
    pattern: '%s %v',
  },
};

/**
 * The package's default currency configuration.
 * Contains default parameters for currency formatting.
 * 
 * Taken from the IDR configuration.
 */
export const defaultCurrencyInfoConfig: CurrencyInfo = {
  decimalPlaces: 0,
  thousandSymbol: '.',
  decimalSymbol: ',',
  pattern: '%s %v',
};

/**
 * A proxy to access currency information by currency code.
 * 
 * @example
 * ```ts
 * // Usage
 * import { currencyInfo } from '@traveloka/accomfe-utils/currency';
 * 
 * const validInfo = currencyInfo['USD']; // Valid USD configuration
 * const invalidInfo = currencyInfo['XYZ']; // Falls back to `defaultCurrencyInfoConfig` (IDR)
 * const invalidInfo2 = currencyInfo['INVALID']; // Throws error
 * ```
 */
export const currencyInfo = new Proxy(currencyInfoConfig, {
  get: (target, currency) => {
    if (typeof currency !== 'string') {
      throw new TypeError('Currency code must be a string');
    }

    if (!isValidCurrencyCode(currency)) {
      throw new Error(`Invalid currency code: ${currency}`);
    }

    return currency in target ? target[currency] : defaultCurrencyInfoConfig;
  }
})