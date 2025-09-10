import { type BskyAgent } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
import { type ThreadDraft } from '#/view/com/composer/state/composer';
import { uploadBlob } from './upload-blob';
export { uploadBlob };
interface PostOpts {
    thread: ThreadDraft;
    replyTo?: string;
    onStateChange?: (state: string) => void;
    langs?: string[];
}
export declare function post(agent: BskyAgent, queryClient: QueryClient, opts: PostOpts): Promise<{
    uris: string[];
}>;
//# sourceMappingURL=index.d.ts.map