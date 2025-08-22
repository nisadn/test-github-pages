type StringWithSuggestions<TOptions> = (string & {}) | TOptions;

export type CurrencyCode = StringWithSuggestions<
  | 'AED'
  | 'AUD'
  | 'BHD'
  | 'BND'
  | 'BRL'
  | 'CAD'
  | 'CHF'
  | 'CNY'
  | 'COP'
  | 'EGP'
  | 'EUR'
  | 'FJD'
  | 'GBP'
  | 'HKD'
  | 'IDR'
  | 'ILS'
  | 'INR'
  | 'JOD'
  | 'JPY'
  | 'KHR'
  | 'KRW'
  | 'KWD'
  | 'LAK'
  | 'LBP'
  | 'LKR'
  | 'MMK'
  | 'MOP'
  | 'MVR'
  | 'MXN'
  | 'MYR'
  | 'NPR'
  | 'NZD'
  | 'OMR'
  | 'PHP'
  | 'PLN'
  | 'QAR'
  | 'RUB'
  | 'SAR'
  | 'SEK'
  | 'SGD'
  | 'THB'
  | 'TRY'
  | 'TWD'
  | 'USD'
  | 'VNC'
  | 'VND'
  | 'ZAR'
>;

/**
 * Represents the configuration for a currency's formatting.
 */
export type CurrencyInfo = {
  /**
   * Number of decimal places for the currency.
   */
  decimalPlaces: number;

  /**
   * Symbol used to separate thousands.
   */
  thousandSymbol: string;

  /**
   * Symbol used to separate decimals.
   */
  decimalSymbol: string;

  /**
   * Pattern for formatting the currency.
   * `%s = symbol`, `%v = value`.
   */
  pattern: string;

  /**
   * Optional symbol for the currency.
   * If not provided, the symbol will be derived from the currency code.
   * For example, 'USD' will use '$' as the symbol.
   */
  symbol?: string;
};

/**
 * Options for `formatCurrency` function.
 */
export type FormatCurrencyOptions = {
  /**
   * Controls whether to display the sign of the currency.
   * - `'always'`: Always display the sign, whether positive or negative.
   * - `'never'`: Never display the sign.
   * - `'auto'`: Display the sign only when it's negative.
   *
   * @default 'auto'
   */
  signDisplay?: 'always' | 'never' | 'auto';

  /**
   * Controls whether to display the currency symbol.
   * - `'code'`: Display the currency code (e.g. "IDR").
   * - `'symbol'`: Display the currency symbol (e.g. "Rp").
   * - `'none'`: Do not display the currency symbol at all.
   *
   * @default 'code'
   */
  currencyDisplay?: 'code' | 'symbol' | 'none';

  /**
   * Controls whether the input value is in minor or major units.
   * @default 'minor'
   */
  inputUnit?: 'minor' | 'major';

  /**
   * Optional fallback value if formatting fails.
   */
  fallback?: string;
};

/**
 * Options for `unformatCurrency` function.
 */
export type UnformatCurrencyOptions = {
  /**
   * Controls whether the output value should be in minor or major units.
   * @default 'minor'
   */
  outputUnit?: 'minor' | 'major';

  /**
   * Optional fallback value if unformatting fails.
   */
  fallback?: number;
};