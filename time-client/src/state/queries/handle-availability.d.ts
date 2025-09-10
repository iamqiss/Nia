export declare const RQKEY_handleAvailability: (handle: string, domain: string, serviceDid: string) => (string | {
    handle: string;
    domain: string;
    serviceDid: string;
})[];
export declare function useHandleAvailabilityQuery({ username, serviceDomain, serviceDid, enabled, birthDate, email, }: {
    username: string;
    serviceDomain: string;
    serviceDid: string;
    enabled: boolean;
    birthDate?: string;
    email?: string;
}, debounceDelayMs?: number): {
    debouncedUsername: any;
    enabled: boolean;
    query: any;
};
export declare function checkHandleAvailability(handle: string, serviceDid: string, { email, birthDate, typeahead, }: {
    email?: string;
    birthDate?: string;
    typeahead?: boolean;
}): Promise<{
    readonly available: true;
    readonly suggestions?: never;
} | {
    readonly available: false;
    readonly suggestions: any;
} | {
    readonly available: false;
    readonly suggestions?: never;
}>;
//# sourceMappingURL=handle-availability.d.ts.map