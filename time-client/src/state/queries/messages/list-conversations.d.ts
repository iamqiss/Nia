import { type ChatBskyConvoListConvos } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
export declare const RQKEY_ROOT = "convo-list";
export declare const RQKEY: (status: "accepted" | "request" | "all", readState?: "all" | "unread") => string[];
export declare function useListConvosQuery({ enabled, status, readState, }?: {
    enabled?: boolean;
    status?: 'request' | 'accepted';
    readState?: 'all' | 'unread';
}): any;
export declare function useListConvos(): any;
export declare function ListConvosProvider({ children }: {
    children: React.ReactNode;
}): any;
export declare function ListConvosProviderInner({ children, }: {
    children: React.ReactNode;
}): any;
export declare function useUnreadMessageCount(): any;
export type ConvoListQueryData = {
    pageParams: Array<string | undefined>;
    pages: Array<ChatBskyConvoListConvos.OutputSchema>;
};
export declare function useOnMarkAsRead(): any;
export declare function getConvoFromQueryData(chatId: string, old: ConvoListQueryData): any;
export declare function findAllProfilesInQueryData(queryClient: QueryClient, did: string): Generator<any, void, unknown>;
//# sourceMappingURL=list-conversations.d.ts.map