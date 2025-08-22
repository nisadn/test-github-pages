import { safeRound } from './_internal';
import { currencyInfo } from './currencyInfo';
import { CurrencyCode } from './types';

/**
 * Converts Major value to Minor value (cents) based on the currency's decimal places.
 * Usually used to convert values for storage or transmission.
 * Uses safe rounding to handle floating-point precision issues.
 *
 * @example
 * ```ts
 * import { toMinorUnit } from '@traveloka/accomfe-utils/currency';
 *
 * const idrValue = toMinorUnit('IDR', 10500); // decimalPlaces is 0 for IDR
 * console.log(idrValue); // 10500
 *
 * const myrValue = toMinorUnit('MYR', 99.1); // decimalPlaces is 2 for MYR
 * console.log(myrValue); // 9910
 * ```
 */
export function toMinorUnit(currency: CurrencyCode, value: number): number {
  const { decimalPlaces } = currencyInfo[currency];

  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    return NaN;
  }

  // Handle edge case where decimalPlaces is 0
  if (decimalPlaces === 0) {
    return safeRound(value);
  }

  // Use safe rounding to avoid floating-point precision issues
  const multiplier = Math.pow(10, decimalPlaces);
  return safeRound(value * multiplier);
}

/**
 * Converts Minor value (cents) to Major value based on the currency's decimal places.
 * Usually used to convert values from BE for display or calculations.
 * Uses safe rounding and proper decimal formatting to handle floating-point precision issues.
 *
 * @example
 * ```ts
 * import { toMajorUnit } from '@traveloka/accomfe-utils/currency';
 *
 * const idrValue = toMajorUnit('IDR', 10500); // decimalPlaces is 0 for IDR
 * console.log(idrValue); // 10500
 *
 * const myrValue = toMajorUnit('MYR', 9910); // decimalPlaces is 2 for MYR
 * console.log(myrValue); // 99.1
 * ```
 */
export function toMajorUnit(currency: CurrencyCode, value: number): number {
  const { decimalPlaces } = currencyInfo[currency];

  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    return NaN;
  }

  // Handle edge case where decimalPlaces is 0
  if (decimalPlaces === 0) {
    return safeRound(value);
  }

  // Use safe division and rounding to avoid floating-point precision issues
  const divisor = Math.pow(10, decimalPlaces);
  const result = value / divisor;

  // Round to the appropriate number of decimal places
  return safeRound(result, decimalPlaces);
}