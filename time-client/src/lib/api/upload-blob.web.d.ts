import { type BskyAgent, type ComAtprotoRepoUploadBlob } from '@atproto/api';
/**
 * @note It is recommended, on web, to use the `file` instance of the file
 * selector input element, rather than a `data:` URL, to avoid
 * loading the file into memory. `File` extends `Blob` "file" instances can
 * be passed directly to this function.
 */
export declare function uploadBlob(agent: BskyAgent, input: string | Blob, encoding?: string): Promise<ComAtprotoRepoUploadBlob.Response>;
//# sourceMappingURL=upload-blob.web.d.ts.map