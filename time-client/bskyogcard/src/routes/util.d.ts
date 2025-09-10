import { ErrorRequestHandler, Request, RequestHandler, Response } from 'express';
import { AppContext } from '../context.js';
export type Handler = (req: Request, res: Response) => Awaited<void>;
export declare const handler: (runHandler: Handler) => RequestHandler;
export declare function originVerifyMiddleware(ctx: AppContext): RequestHandler;
export declare const errorHandler: ErrorRequestHandler;
//# sourceMappingURL=util.d.ts.map