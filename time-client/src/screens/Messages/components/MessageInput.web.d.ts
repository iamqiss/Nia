import React from 'react';
import { type EmojiPickerPosition } from '#/view/com/composer/text-input/web/EmojiPicker';
export declare function MessageInput({ onSendMessage, hasEmbed, setEmbed, children, openEmojiPicker, }: {
    onSendMessage: (message: string) => void;
    hasEmbed: boolean;
    setEmbed: (embedUrl: string | undefined) => void;
    children?: React.ReactNode;
    openEmojiPicker?: (pos: EmojiPickerPosition) => void;
}): any;
//# sourceMappingURL=MessageInput.web.d.ts.map