export type AgeAssuranceRedirectDialogState = {
    result: 'success' | 'unknown';
    actorDid: string;
};
/**
 * Validate and parse the query parameters returned from the age assurance
 * redirect. If not valid, returns `undefined` and the dialog will not open.
 */
export declare function parseAgeAssuranceRedirectDialogState(state?: {
    result?: string;
    actorDid?: string;
}): AgeAssuranceRedirectDialogState | undefined;
export declare function useAgeAssuranceRedirectDialogControl(): any;
export declare function AgeAssuranceRedirectDialog(): any;
export declare function Inner({}: {
    optimisticState?: AgeAssuranceRedirectDialogState;
}): any;
//# sourceMappingURL=AgeAssuranceRedirectDialog.d.ts.map