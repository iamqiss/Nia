import React from 'react';
import { type ComposerOpts } from '#/state/shell/composer';
type CancelRef = {
    onPressCancel: () => void;
};
type Props = ComposerOpts;
export declare const ComposePost: ({ replyTo, onPost, onPostSuccess, quote: initQuote, mention: initMention, openEmojiPicker, text: initText, imageUris: initImageUris, videoUri: initVideoUri, cancelRef, }: Props & {
    cancelRef?: React.RefObject<CancelRef | null>;
}) => any;
export declare function useComposerCancelRef(): any;
export {};
//# sourceMappingURL=Composer.d.ts.map