import type { Request, Response, NextFunction } from 'express';
export interface AuthContext {
    userId: string;
}
declare global {
    namespace Express {
        interface Request {
            auth?: AuthContext;
        }
    }
}
export declare function requireAuth(req: Request, _res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map