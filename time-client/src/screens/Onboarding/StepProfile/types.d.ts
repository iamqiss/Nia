import { EmojiArc_Stroke2_Corner0_Rounded as EmojiArc } from '#/components/icons/Emoji';
/**
 * If you want to add or remove icons from the selection, just add the name to the `emojiNames` array and
 * add the item to the `emojiItems` record..
 */
export declare const emojiNames: readonly ["at", "arc", "heartEyes", "alien", "apple", "atom", "celebrate", "gameController", "leaf", "musicNote", "rose", "shaka", "ufo", "zap", "explosion", "lab"];
export type EmojiName = (typeof emojiNames)[number];
export interface Emoji {
    name: EmojiName;
    component: typeof EmojiArc;
}
export declare const emojiItems: Record<EmojiName, Emoji>;
export declare const avatarColors: readonly ["#FE8311", "#FED811", "#73DF84", "#1185FE", "#EF75EA", "#F55454"];
export type AvatarColor = (typeof avatarColors)[number];
//# sourceMappingURL=types.d.ts.map