export declare function hashPassword(plain: string): Promise<string>;
export declare function verifyPassword(plain: string, hash: string): Promise<boolean>;
export declare function generateAccessToken(payload: object): string;
export declare function generateRefreshToken(payload: object): string;
export declare function verifyAccessToken(token: string): any;
export declare function verifyRefreshToken(token: string): any;
export declare function generateRandomToken(bytes?: number): string;
//# sourceMappingURL=security.d.ts.map