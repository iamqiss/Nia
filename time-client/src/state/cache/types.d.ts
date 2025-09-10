declare const shadowTag: unique symbol;
export type Shadow<T> = T & {
    [shadowTag]: true;
};
export declare function castAsShadow<T>(value: T): Shadow<T>;
export {};
//# sourceMappingURL=types.d.ts.map