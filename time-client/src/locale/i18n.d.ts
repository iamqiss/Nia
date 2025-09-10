import '@formatjs/intl-locale/polyfill-force';
import '@formatjs/intl-pluralrules/polyfill-force';
import '@formatjs/intl-numberformat/polyfill-force';
import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-numberformat/locale-data/en';
import { AppLanguage } from '#/locale/languages';
/**
 * We do a dynamic import of just the catalog that we need
 */
export declare function dynamicActivate(locale: AppLanguage): Promise<void>;
export declare function useLocaleLanguage(): void;
//# sourceMappingURL=i18n.d.ts.map