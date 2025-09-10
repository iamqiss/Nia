import { type AppBskyFeedDefs, type AppBskyGraphDefs, type ComAtprotoRepoStrongRef } from '@atproto/api';
import { type BskyAgent } from '@atproto/api';
import { type ComposerImage } from '#/state/gallery';
import { type Gif } from '#/state/queries/tenor';
type ResolvedExternalLink = {
    type: 'external';
    uri: string;
    title: string;
    description: string;
    thumb: ComposerImage | undefined;
};
type ResolvedPostRecord = {
    type: 'record';
    record: ComAtprotoRepoStrongRef.Main;
    kind: 'post';
    view: AppBskyFeedDefs.PostView;
};
type ResolvedFeedRecord = {
    type: 'record';
    record: ComAtprotoRepoStrongRef.Main;
    kind: 'feed';
    view: AppBskyFeedDefs.GeneratorView;
};
type ResolvedListRecord = {
    type: 'record';
    record: ComAtprotoRepoStrongRef.Main;
    kind: 'list';
    view: AppBskyGraphDefs.ListView;
};
type ResolvedStarterPackRecord = {
    type: 'record';
    record: ComAtprotoRepoStrongRef.Main;
    kind: 'starter-pack';
    view: AppBskyGraphDefs.StarterPackView;
};
export type ResolvedLink = ResolvedExternalLink | ResolvedPostRecord | ResolvedFeedRecord | ResolvedListRecord | ResolvedStarterPackRecord;
export declare class EmbeddingDisabledError extends Error {
    constructor();
}
export declare function resolveLink(agent: BskyAgent, uri: string): Promise<ResolvedLink>;
export declare function resolveGif(agent: BskyAgent, gif: Gif): Promise<ResolvedExternalLink>;
export declare function imageToThumb(imageUri: string): Promise<ComposerImage | undefined>;
export {};
//# sourceMappingURL=resolve.d.ts.map