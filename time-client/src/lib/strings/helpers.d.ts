export declare function enforceLen(str: string, len: number, ellipsis?: boolean, mode?: 'end' | 'middle'): string;
export declare function useEnforceMaxGraphemeCount(): any;
export declare function useWarnMaxGraphemeCount({ text, maxCount, }: {
    text: string;
    maxCount: number;
}): any;
export declare function toHashCode(str: string, seed?: number): number;
export declare function countLines(str: string | undefined): number;
export declare function augmentSearchQuery(query: string, { did }: {
    did?: string;
}): string;
//# sourceMappingURL=helpers.d.ts.map