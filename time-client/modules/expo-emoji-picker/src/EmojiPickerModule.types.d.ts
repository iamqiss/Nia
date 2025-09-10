import { type ViewProps } from 'react-native';
export type EmojiSelectionListener = (event: {
    nativeEvent: SelectionEvent;
}) => void;
export type SelectionEvent = {
    emoji: string;
};
export type EmojiPickerViewProps = ViewProps & {
    onEmojiSelected: (emoji: string) => void;
};
export type EmojiPickerNativeViewProps = ViewProps & {
    onEmojiSelected: EmojiSelectionListener;
};
//# sourceMappingURL=EmojiPickerModule.types.d.ts.map