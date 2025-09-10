import { AppBskyGraphDefs } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
export declare function useStarterPackQuery({ uri, did, rkey, }: {
    uri?: string;
    did?: string;
    rkey?: string;
}): any;
export declare function invalidateStarterPack({ queryClient, did, rkey, }: {
    queryClient: QueryClient;
    did: string;
    rkey: string;
}): Promise<void>;
export declare function useCreateStarterPackMutation({ onSuccess, onError, }: {
    onSuccess: (data: {
        uri: string;
        cid: string;
    }) => void;
    onError: (e: Error) => void;
}): any;
export declare function useEditStarterPackMutation({ onSuccess, onError, }: {
    onSuccess: () => void;
    onError: (error: Error) => void;
}): any;
export declare function useDeleteStarterPackMutation({ onSuccess, onError, }: {
    onSuccess: () => void;
    onError: (error: Error) => void;
}): any;
export declare function precacheStarterPack(queryClient: QueryClient, starterPack: AppBskyGraphDefs.StarterPackViewBasic | AppBskyGraphDefs.StarterPackView): Promise<void>;
//# sourceMappingURL=starter-packs.d.ts.map