import { useAgeAssuranceContext } from '#/state/ageAssurance';
type AgeAssurance = ReturnType<typeof useAgeAssuranceContext> & {
    /**
     * The age the user has declared in their preferences, if any.
     */
    declaredAge: number | undefined;
    /**
     * Indicates whether the user has declared an age under 18.
     */
    isDeclaredUnderage: boolean;
};
/**
 * Computed age information based on age assurance status and the user's
 * declared age. Use this instead of {@link useAgeAssuranceContext} to get a
 * more user-friendly interface.
 */
export declare function useAgeAssurance(): AgeAssurance;
export {};
//# sourceMappingURL=useAgeAssurance.d.ts.map