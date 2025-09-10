export interface Language {
    code3: string;
    code2: string;
    name: string;
}
export declare enum AppLanguage {
    en = "en",
    an = "an",
    ast = "ast",
    ca = "ca",
    cy = "cy",
    da = "da",
    de = "de",
    el = "el",
    en_GB = "en-GB",
    eo = "eo",
    es = "es",
    eu = "eu",
    fi = "fi",
    fr = "fr",
    fy = "fy",
    ga = "ga",
    gd = "gd",
    gl = "gl",
    hi = "hi",
    hu = "hu",
    ia = "ia",
    id = "id",
    it = "it",
    ja = "ja",
    km = "km",
    ko = "ko",
    ne = "ne",
    nl = "nl",
    pl = "pl",
    pt_BR = "pt-BR",
    pt_PT = "pt-PT",
    ro = "ro",
    ru = "ru",
    sv = "sv",
    th = "th",
    tr = "tr",
    uk = "uk",
    vi = "vi",
    zh_CN = "zh-Hans-CN",
    zh_HK = "zh-Hant-HK",
    zh_TW = "zh-Hant-TW"
}
interface AppLanguageConfig {
    code2: AppLanguage;
    name: string;
}
export declare const APP_LANGUAGES: AppLanguageConfig[];
export declare const LANGUAGES: Language[];
export declare const LANGUAGES_MAP_CODE2: {
    [k: string]: Language;
};
export declare const LANGUAGES_MAP_CODE3: {
    [k: string]: Language;
};
export {};
//# sourceMappingURL=languages.d.ts.map