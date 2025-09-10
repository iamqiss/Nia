import { jsx as _jsx } from "react/jsx-runtime";
import { requireNativeView } from 'expo';
import {} from './EmojiPickerModule.types';
const NativeView = requireNativeView('EmojiPicker');
export default function EmojiPicker(props) {
    return (_jsx(NativeView, { ...props, onEmojiSelected: ({ nativeEvent }) => {
            props.onEmojiSelected(nativeEvent.emoji);
        } }));
}
//# sourceMappingURL=EmojiPickerView.js.map