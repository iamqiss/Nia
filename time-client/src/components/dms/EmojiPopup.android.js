import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonIcon } from '#/components/Button';
import { TimesLarge_Stroke2_Corner0_Rounded as CloseIcon } from '#/components/icons/Times';
import { Text } from '#/components/Typography';
import { EmojiPicker } from '../../../modules/expo-emoji-picker';
export function EmojiPopup({ children, onEmojiSelected, }) {
    const [modalVisible, setModalVisible] = useState(false);
    const { _ } = useLingui();
    const t = useTheme();
    return (_jsxs(_Fragment, { children: [_jsx(Pressable, { accessibilityLabel: _(msg `Open full emoji list`), accessibilityHint: "", accessibilityRole: "button", onPress: () => setModalVisible(true), children: children }), _jsx(Modal, { animationType: "slide", visible: modalVisible, onRequestClose: () => setModalVisible(false), transparent: true, statusBarTranslucent: true, navigationBarTranslucent: true, children: _jsxs(SafeAreaView, { style: [a.flex_1, t.atoms.bg], children: [_jsxs(View, { style: [
                                a.pl_lg,
                                a.pr_md,
                                a.py_sm,
                                a.w_full,
                                a.align_center,
                                a.flex_row,
                                a.justify_between,
                                a.border_b,
                                t.atoms.border_contrast_low,
                            ], children: [_jsx(Text, { style: [a.font_bold, a.text_md], children: _jsx(Trans, { children: "Add Reaction" }) }), _jsx(Button, { label: _(msg `Close`), onPress: () => setModalVisible(false), size: "small", variant: "ghost", color: "secondary", shape: "round", children: _jsx(ButtonIcon, { icon: CloseIcon }) })] }), _jsx(EmojiPicker, { onEmojiSelected: emoji => {
                                setModalVisible(false);
                                onEmojiSelected(emoji);
                            } })] }) })] }));
}
//# sourceMappingURL=EmojiPopup.android.js.map