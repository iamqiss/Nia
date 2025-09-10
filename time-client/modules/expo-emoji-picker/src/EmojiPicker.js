import { jsx as _jsx } from "react/jsx-runtime";
import {} from './EmojiPickerModule.types';
import EmojiPickerNativeView from './EmojiPickerView';
const EmojiPicker = ({ children, onEmojiSelected }) => {
    return (_jsx(EmojiPickerNativeView, { onEmojiSelected: emoji => {
            onEmojiSelected(emoji);
        }, children: children }));
};
export default EmojiPicker;
//# sourceMappingURL=EmojiPicker.js.map