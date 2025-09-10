import { type SupportedMimeTypes } from '#/lib/constants';
export declare const createVideoEndpointUrl: (route: string, params?: Record<string, string>) => string;
export declare function createVideoAgent(): any;
export declare function mimeToExt(mimeType: SupportedMimeTypes | (string & {})): "gif" | "mp4" | "webm" | "mpeg" | "mov";
export declare function extToMime(ext: string): "video/mp4" | "video/mpeg" | "video/webm" | "video/quicktime" | "image/gif";
//# sourceMappingURL=util.d.ts.map