import { type ImagePickerAsset } from 'expo-image-picker';
import { type AppBskyFeedPostgate, type BskyPreferences, RichText } from '@atproto/api';
import { type SelfLabel } from '#/lib/moderation';
import { type ComposerImage } from '#/state/gallery';
import { type Gif } from '#/state/queries/tenor';
import { type ThreadgateAllowUISetting } from '#/state/queries/threadgate';
import { type ComposerOpts } from '#/state/shell/composer';
import { type VideoAction, type VideoState } from './video';
type ImagesMedia = {
    type: 'images';
    images: ComposerImage[];
};
type VideoMedia = {
    type: 'video';
    video: VideoState;
};
type GifMedia = {
    type: 'gif';
    gif: Gif;
    alt: string;
};
type Link = {
    type: 'link';
    uri: string;
};
export type EmbedDraft = {
    quote: Link | undefined;
    media: ImagesMedia | VideoMedia | GifMedia | undefined;
    link: Link | undefined;
};
export type PostDraft = {
    id: string;
    richtext: RichText;
    labels: SelfLabel[];
    embed: EmbedDraft;
    shortenedGraphemeLength: number;
};
export type PostAction = {
    type: 'update_richtext';
    richtext: RichText;
} | {
    type: 'update_labels';
    labels: SelfLabel[];
} | {
    type: 'embed_add_images';
    images: ComposerImage[];
} | {
    type: 'embed_update_image';
    image: ComposerImage;
} | {
    type: 'embed_remove_image';
    image: ComposerImage;
} | {
    type: 'embed_add_video';
    asset: ImagePickerAsset;
    abortController: AbortController;
} | {
    type: 'embed_remove_video';
} | {
    type: 'embed_update_video';
    videoAction: VideoAction;
} | {
    type: 'embed_add_uri';
    uri: string;
} | {
    type: 'embed_remove_quote';
} | {
    type: 'embed_remove_link';
} | {
    type: 'embed_add_gif';
    gif: Gif;
} | {
    type: 'embed_update_gif';
    alt: string;
} | {
    type: 'embed_remove_gif';
};
export type ThreadDraft = {
    posts: PostDraft[];
    postgate: AppBskyFeedPostgate.Record;
    threadgate: ThreadgateAllowUISetting[];
};
export type ComposerState = {
    thread: ThreadDraft;
    activePostIndex: number;
    mutableNeedsFocusActive: boolean;
};
export type ComposerAction = {
    type: 'update_postgate';
    postgate: AppBskyFeedPostgate.Record;
} | {
    type: 'update_threadgate';
    threadgate: ThreadgateAllowUISetting[];
} | {
    type: 'update_post';
    postId: string;
    postAction: PostAction;
} | {
    type: 'add_post';
} | {
    type: 'remove_post';
    postId: string;
} | {
    type: 'focus_post';
    postId: string;
};
export declare const MAX_IMAGES = 4;
export declare function composerReducer(state: ComposerState, action: ComposerAction): ComposerState;
export declare function createComposerState({ initText, initMention, initImageUris, initQuoteUri, initInteractionSettings, }: {
    initText: string | undefined;
    initMention: string | undefined;
    initImageUris: ComposerOpts['imageUris'];
    initQuoteUri: string | undefined;
    initInteractionSettings: BskyPreferences['postInteractionSettings'] | undefined;
}): ComposerState;
export {};
//# sourceMappingURL=composer.d.ts.map