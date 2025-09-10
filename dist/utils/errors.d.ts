export declare class AppError extends Error {
    statusCode: number;
    code: string;
    details?: unknown;
    constructor(message: string, statusCode?: number, code?: string, details?: unknown);
}
export declare class ValidationError extends AppError {
    constructor(message?: string, details?: unknown);
}
export declare class AuthError extends AppError {
    constructor(message?: string, code?: string);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string);
}
//# sourceMappingURL=errors.d.ts.map