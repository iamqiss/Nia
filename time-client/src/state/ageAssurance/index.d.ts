export declare const createAgeAssuranceQueryKey: (did: string) => readonly ["ageAssurance", string];
/**
 * Low-level provider for fetching age assurance state on app load. Do not add
 * any other data fetching in here to avoid complications and reduced
 * performance.
 */
export declare function Provider({ children }: {
    children: React.ReactNode;
}): any;
/**
 * Access to low-level AA state. Prefer using {@link useAgeInfo} for a
 * more user-friendly interface.
 */
export declare function useAgeAssuranceContext(): any;
export declare function useAgeAssuranceAPIContext(): any;
//# sourceMappingURL=index.d.ts.map