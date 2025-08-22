import { CurrencyCode, CurrencyInfo, FormatCurrencyOptions } from './types';

/**
 * Safely rounds a number to avoid floating-point precision issues.
 * Uses the "round half up" strategy for consistent behavior.
 */
export function safeRound(value: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals);
  const res = Math.round((value + Number.EPSILON) * factor) / factor;
  return res;
}

/**
 * For internal package use only.
 *
 * Uses a fixed-point arithmetic function to avoid floating-point precision issues.
 * [Source](https://github.com/nashdot/accounting-js/blob/20b292671faf1dda7fa65e9aa9addef52d3c37d1/src/toFixed.ts#L26).
 */
export function toFixed(value: number, decimalPlaces: number) {
  return safeRound(value, decimalPlaces).toFixed(decimalPlaces);
}

/**
 * For internal package use only. Please use `formatCurrency` instead.
 *
 * Formats a number according to the provided currency information.
 * [Source](https://github.com/nashdot/accounting-js/blob/20b292671faf1dda7fa65e9aa9addef52d3c37d1/src/formatNumber.ts#L25).
 */
export function formatNumber(value: number, currencyInfo: CurrencyInfo) {
  const { decimalPlaces, thousandSymbol, decimalSymbol } = currencyInfo;

  const fixedValue = toFixed(value, decimalPlaces);
  let integerPart = '';
  let decimalPart = Array(decimalPlaces + 1).join('0');

  if (fixedValue.includes('.')) {
    [integerPart, decimalPart] = fixedValue.split('.');
  } else {
    integerPart = fixedValue;
  }

  const mod = integerPart.length > 3 ? integerPart.length % 3 : 0;

  return (
    (mod ? integerPart.substring(0, mod) + thousandSymbol : '') +
    integerPart
      .substring(mod)
      .replace(/(\d{3})(?=\d)/g, '$1' + thousandSymbol) +
    (decimalPlaces > 0 ? decimalSymbol + decimalPart : '')
  );
}

/**
 * Checks if the provided string is a valid currency code.
 * A valid currency code is a 3-letter uppercase string.
 */
export function isValidCurrencyCode(code: string): code is CurrencyCode {
  return typeof code === 'string' && /^[A-Z]{3}$/.test(code);
}