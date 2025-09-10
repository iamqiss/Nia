import { type BskyAgent, type Facet } from '@atproto/api';
import type * as bsky from '#/types/bsky';
export declare const createStarterPackList: ({ name, description, descriptionFacets, profiles, agent, }: {
    name: string;
    description?: string;
    descriptionFacets?: Facet[];
    profiles: bsky.profile.AnyProfileView[];
    agent: BskyAgent;
}) => Promise<{
    uri: string;
    cid: string;
}>;
export declare function useGenerateStarterPackMutation({ onSuccess, onError, }: {
    onSuccess: ({ uri, cid }: {
        uri: string;
        cid: string;
    }) => void;
    onError: (e: Error) => void;
}): any;
//# sourceMappingURL=generate-starterpack.d.ts.map