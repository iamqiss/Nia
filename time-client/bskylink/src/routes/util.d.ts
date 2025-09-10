import { ErrorRequestHandler, Request, RequestHandler, Response } from 'express';
export type Handler = (req: Request, res: Response) => Awaited<void>;
export declare const handler: (runHandler: Handler) => RequestHandler;
export declare const errorHandler: ErrorRequestHandler;
//# sourceMappingURL=util.d.ts.map