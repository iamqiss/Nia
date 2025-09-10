/**
 * This file is a copy of what exists in the social-app
 */
import { AppBskyEmbedExternal, AppBskyEmbedImages, AppBskyEmbedRecord, AppBskyEmbedVideo, AppBskyFeedDefs, AppBskyGraphDefs, AppBskyLabelerDefs } from '@atproto/api';
export type Embed = {
    type: 'post';
    view: AppBskyEmbedRecord.ViewRecord;
} | {
    type: 'post_not_found';
    view: AppBskyEmbedRecord.ViewNotFound;
} | {
    type: 'post_blocked';
    view: AppBskyEmbedRecord.ViewBlocked;
} | {
    type: 'post_detached';
    view: AppBskyEmbedRecord.ViewDetached;
} | {
    type: 'feed';
    view: AppBskyFeedDefs.GeneratorView;
} | {
    type: 'list';
    view: AppBskyGraphDefs.ListView;
} | {
    type: 'labeler';
    view: AppBskyLabelerDefs.LabelerView;
} | {
    type: 'starter_pack';
    view: AppBskyGraphDefs.StarterPackViewBasic;
} | {
    type: 'images';
    view: AppBskyEmbedImages.View;
} | {
    type: 'link';
    view: AppBskyEmbedExternal.View;
} | {
    type: 'video';
    view: AppBskyEmbedVideo.View;
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
//# sourceMappingURL=parse-embed.d.ts.map