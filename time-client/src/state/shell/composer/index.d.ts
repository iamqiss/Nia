import React from 'react';
import { type AppBskyActorDefs, type AppBskyFeedDefs, type AppBskyUnspeccedGetPostThreadV2, type ModerationDecision } from '@atproto/api';
import { type EmojiPickerPosition } from '#/view/com/composer/text-input/web/EmojiPicker';
export interface ComposerOptsPostRef {
    uri: string;
    cid: string;
    text: string;
    langs?: string[];
    author: AppBskyActorDefs.ProfileViewBasic;
    embed?: AppBskyFeedDefs.PostView['embed'];
    moderation?: ModerationDecision;
}
export type OnPostSuccessData = {
    replyToUri?: string;
    posts: AppBskyUnspeccedGetPostThreadV2.ThreadItem[];
} | undefined;
export interface ComposerOpts {
    replyTo?: ComposerOptsPostRef;
    onPost?: (postUri: string | undefined) => void;
    onPostSuccess?: (data: OnPostSuccessData) => void;
    quote?: AppBskyFeedDefs.PostView;
    mention?: string;
    openEmojiPicker?: (pos: EmojiPickerPosition | undefined) => void;
    text?: string;
    imageUris?: {
        uri: string;
        width: number;
        height: number;
        altText?: string;
    }[];
    videoUri?: {
        uri: string;
        width: number;
        height: number;
    };
}
export declare function Provider({ children }: React.PropsWithChildren<{}>): any;
export declare function useComposerState(): any;
export declare function useComposerControls(): any;
/**
 * DO NOT USE DIRECTLY. The deprecation notice as a warning only, it's not
 * actually deprecated.
 *
 * @deprecated use `#/lib/hooks/useOpenComposer` instead
 */
export declare function useOpenComposer(): any;
//# sourceMappingURL=index.d.ts.map