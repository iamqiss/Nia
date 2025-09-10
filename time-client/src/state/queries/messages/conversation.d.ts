import { type ChatBskyConvoDefs } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
export declare const RQKEY: (convoId: string) => string[];
export declare function useConvoQuery(convo: ChatBskyConvoDefs.ConvoView): any;
export declare function precacheConvoQuery(queryClient: QueryClient, convo: ChatBskyConvoDefs.ConvoView): void;
export declare function useMarkAsReadMutation(): any;
//# sourceMappingURL=conversation.d.ts.map