export declare const MAX_SERVICE_HANDLE_LENGTH = 18;
export declare function makeValidHandle(str: string): string;
export declare function createFullHandle(name: string, domain: string): string;
export declare function isInvalidHandle(handle: string): boolean;
export declare function sanitizeHandle(handle: string, prefix?: string, forceLeftToRight?: boolean): string;
export interface IsValidHandle {
    handleChars: boolean;
    hyphenStartOrEnd: boolean;
    frontLengthNotTooShort: boolean;
    frontLengthNotTooLong: boolean;
    totalLength: boolean;
    overall: boolean;
}
export declare function validateServiceHandle(str: string, userDomain: string): IsValidHandle;
//# sourceMappingURL=handles.d.ts.map