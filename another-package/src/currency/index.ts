import { formatNumber, safeRound } from './_internal';
import { toMajorUnit, toMinorUnit } from './convert';
import { currencyInfo, defaultCurrencyInfoConfig } from './currencyInfo';
import {
  CurrencyCode,
  FormatCurrencyOptions,
  UnformatCurrencyOptions,
} from './types';

/**
 * Formats a number as a currency string.
 *
 * @example
 * ```ts
 * import { formatCurrency } from '@traveloka/accomfe-utils/currency';
 *
 * const formattedIDR = formatCurrency('IDR', 10500);
 * console.log(formattedIDR); // "IDR 10.500"
 *
 * const formattedMYR = formatCurrency('MYR', -99.1, {
 *   currencyDisplay: 'symbol'
 * });
 * console.log(formattedMYR); // "-RM 0.99" -> decimalPlaces is 2 for MYR
 *
 * const formattedUSD = formatCurrency('SGD', 1234.56, {
 *   signDisplay: 'always',
 *   inputUnit: 'major'
 * });
 * console.log(formattedUSD); // "+SGD 1,234.56" -> always displays sign
 * ```
 *
 * @param currency The currency code (e.g., 'IDR', 'SGD').
 * @param value The numeric value to format.
 * @param options Optional formatting options.
 * @returns A formatted currency string or *null* if the input is invalid.
 */
export function formatCurrency(
  currency: CurrencyCode,
  value: number,
  options: FormatCurrencyOptions = {},
) {
  const {
    signDisplay = 'auto',
    currencyDisplay = 'code',
    inputUnit = 'minor',
    fallback = null,
  } = options;

  const { pattern = defaultCurrencyInfoConfig.pattern, symbol } =
    currencyInfo[currency];

  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    return fallback;
  }

  let displayPattern = pattern;

  // Convert value to major units if input is in minor units
  const adjustedValue =
    inputUnit === 'minor' ? toMajorUnit(currency, value) : value;

  // Sign handling
  let displaySign = '';
  if (signDisplay && signDisplay !== 'never') {
    if (adjustedValue < 0) {
      displaySign = '-';
    } else if (adjustedValue > 0 && signDisplay === 'always') {
      displaySign = '+';
    }
  }

  // Symbol handling
  let displaySymbol = '';
  if (currencyDisplay && currencyDisplay !== 'none') {
    if (currencyDisplay === 'symbol' && symbol) {
      displaySymbol = symbol;
    } else {
      displaySymbol = currency.toUpperCase();
      // if doesn't have symbol, fallback to `%s %v` pattern
      displayPattern = defaultCurrencyInfoConfig.pattern;
    }
  }

  const displayValue = formatNumber(Math.abs(adjustedValue), currencyInfo[currency]);

  let result = `${displaySign}${displayPattern.replace('%s', displaySymbol).replace('%v', displayValue)}`;
  if (!currencyDisplay || currencyDisplay === 'none') {
    // If symbol is hidden, we will remove all spaces from the pattern
    result = result.replace(' ', '');
  }

  return result.trim();
}

/**
 * Convert formatted currency string back to a numeric value.
 * 
 * @example
 * ```ts
 * import { unformatCurrency } from '@traveloka/accomfe-utils/currency';
 * 
 * const idrValue = unformatCurrency('IDR', 'Rp 10.500');
 * console.log(idrValue); // 10500
 * 
 * const myrValue = unformatCurrency('MYR', 'RM 33.99');
 * console.log(myrValue); // 3399 -> decimalPlaces is 2 for MYR
 * 
 * const myrMajorValue = unformatCurrency('MYR', 'RM 33.99', { outputUnit: 'major' });
 * console.log(myrMajorValue); // 33.99 -> decimalPlaces is 2 for MYR
 * 
 * const invalidValue = unformatCurrency('USD', 'Invalid Format');
 * console.log(invalidValue); // NaN
 * ```
 */
export function unformatCurrency(
  currency: CurrencyCode,
  displayValue: string,
  options: UnformatCurrencyOptions = {},
) {
  const { outputUnit = 'minor', fallback = NaN } = options;

  const { thousandSymbol, decimalSymbol, decimalPlaces } =
    currencyInfo[currency];

  if (typeof displayValue !== 'string') {
    return fallback;
  }

  // Remove currency symbol and whitespace
  const cleanedValue = displayValue.replace(/[^0-9.,-]+/g, '');

  const parts = cleanedValue.split(decimalSymbol);

  if (parts.length > 2) {
    // More than one decimal point, invalid format
    return fallback;
  }

  const integerPart = parts[0].replaceAll(thousandSymbol, '');
  const decimalPart = parts[1];

  if (!integerPart) {
    // No integer part, invalid format
    return fallback;
  }

  let validValue = Number(integerPart);

  if (decimalPart) {
    const parsedDecimal = Number(decimalPart);
    validValue += parsedDecimal / Math.pow(10, decimalPart.length);
  }

  if (outputUnit === 'minor') {
     return toMinorUnit(currency, validValue);
  }

  return safeRound(validValue, decimalPlaces)
}