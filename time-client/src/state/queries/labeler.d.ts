export declare const labelerInfoQueryKey: (did: string) => string[];
export declare const labelersInfoQueryKey: (dids: string[]) => (string | string[])[];
export declare const labelersDetailedInfoQueryKey: (dids: string[]) => any[];
export declare function useLabelerInfoQuery({ did, enabled, }: {
    did?: string;
    enabled?: boolean;
}): any;
export declare function useLabelersInfoQuery({ dids }: {
    dids: string[];
}): any;
export declare function useLabelersDetailedInfoQuery({ dids }: {
    dids: string[];
}): any;
export declare function useLabelerSubscriptionMutation(): any;
//# sourceMappingURL=labeler.d.ts.map