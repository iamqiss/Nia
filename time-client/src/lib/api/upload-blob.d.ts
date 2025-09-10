import { type BskyAgent, type ComAtprotoRepoUploadBlob } from '@atproto/api';
/**
 * @param encoding Allows overriding the blob's type
 */
export declare function uploadBlob(agent: BskyAgent, input: string | Blob, encoding?: string): Promise<ComAtprotoRepoUploadBlob.Response>;
//# sourceMappingURL=upload-blob.d.ts.map