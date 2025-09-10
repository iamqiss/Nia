import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import {} from './EmojiPickerModule.types';
import EmojiPickerNativeView from './EmojiPickerView';
const EmojiPicker = ({ onEmojiSelected }) => {
    const scheme = useColorScheme();
    const styles = useMemo(() => ({
        flex: 1,
        width: '100%',
        backgroundColor: scheme === 'dark' ? '#000' : '#fff',
    }), [scheme]);
    return (_jsx(EmojiPickerNativeView, { onEmojiSelected: emoji => {
            onEmojiSelected(emoji);
        }, style: styles }));
};
export default EmojiPicker;
//# sourceMappingURL=EmojiPicker.android.js.map