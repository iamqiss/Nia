/**
 * From react-native-localize
 *
 * MIT License
 * Copyright (c) 2017-present, Mathieu Acthernoene
 *
 * @see https://github.com/zoontek/react-native-localize/blob/master/LICENSE
 * @see https://github.com/zoontek/react-native-localize/blob/ee5bf25e0bb8f3b8e4f3fd055f67ad46269c81ea/src/constants.ts
 */
export declare const countryCodeToCurrency: Record<string, string>;
/**
 * Best-guess currency formatting.
 *
 * Attempts to use `getLocales` from `expo-localization` if available,
 * otherwise falls back to the `persisted.appLanguage` setting, and geolocation
 * API for region.
 */
export declare function useFormatCurrency(options?: Parameters<typeof Intl.NumberFormat>[1]): any;
//# sourceMappingURL=currency.d.ts.map