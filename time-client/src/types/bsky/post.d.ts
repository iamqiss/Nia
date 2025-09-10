import { type $Typed, AppBskyEmbedExternal, AppBskyEmbedImages, AppBskyEmbedRecord, AppBskyEmbedVideo, AppBskyFeedDefs, AppBskyGraphDefs, AppBskyLabelerDefs } from '@atproto/api';
export type Embed = {
    type: 'post';
    view: $Typed<AppBskyEmbedRecord.ViewRecord>;
} | {
    type: 'post_not_found';
    view: $Typed<AppBskyEmbedRecord.ViewNotFound>;
} | {
    type: 'post_blocked';
    view: $Typed<AppBskyEmbedRecord.ViewBlocked>;
} | {
    type: 'post_detached';
    view: $Typed<AppBskyEmbedRecord.ViewDetached>;
} | {
    type: 'feed';
    view: $Typed<AppBskyFeedDefs.GeneratorView>;
} | {
    type: 'list';
    view: $Typed<AppBskyGraphDefs.ListView>;
} | {
    type: 'labeler';
    view: $Typed<AppBskyLabelerDefs.LabelerView>;
} | {
    type: 'starter_pack';
    view: $Typed<AppBskyGraphDefs.StarterPackViewBasic>;
} | {
    type: 'images';
    view: $Typed<AppBskyEmbedImages.View>;
} | {
    type: 'link';
    view: $Typed<AppBskyEmbedExternal.View>;
} | {
    type: 'video';
    view: $Typed<AppBskyEmbedVideo.View>;
} | {
    type: 'post_with_media';
    view: Embed;
    media: Embed;
} | {
    type: 'unknown';
    view: null;
};
export type EmbedType<T extends Embed['type']> = Extract<Embed, {
    type: T;
}>;
export declare function parseEmbedRecordView({ record }: AppBskyEmbedRecord.View): Embed;
export declare function parseEmbed(embed: AppBskyFeedDefs.PostView['embed']): Embed;
//# sourceMappingURL=post.d.ts.map