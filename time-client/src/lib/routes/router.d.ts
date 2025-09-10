import { type Route, type RouteParams } from './types';
export declare class Router<T extends Record<string, any>> {
    routes: [string, Route][];
    constructor(description: Record<keyof T, string | string[]>);
    matchName(name: keyof T | (string & {})): Route | undefined;
    matchPath(path: string): [string, RouteParams];
}
//# sourceMappingURL=router.d.ts.map