import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import {} from 'react-native';
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useInitialNumToRender } from '#/lib/hooks/useInitialNumToRender';
import { isWeb } from '#/platform/detection';
import {} from '#/view/com/util/List';
import {} from '#/screens/StarterPack/Wizard/State';
import { atoms as a, native, useTheme, web } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { WizardFeedCard, WizardProfileCard, } from '#/components/StarterPack/Wizard/WizardListCard';
import { Text } from '#/components/Typography';
function keyExtractor(item, index) {
    return `${item.did}-${index}`;
}
export function WizardEditListDialog({ control, state, dispatch, moderationOpts, profile, }) {
    const { _ } = useLingui();
    const t = useTheme();
    const initialNumToRender = useInitialNumToRender();
    const listRef = useRef(null);
    const getData = () => {
        if (state.currentStep === 'Feeds')
            return state.feeds;
        return [profile, ...state.profiles.filter(p => p.did !== profile.did)];
    };
    const renderItem = ({ item }) => state.currentStep === 'Profiles' ? (_jsx(WizardProfileCard, { profile: item, btnType: "remove", state: state, dispatch: dispatch, moderationOpts: moderationOpts })) : (_jsx(WizardFeedCard, { generator: item, btnType: "remove", state: state, dispatch: dispatch, moderationOpts: moderationOpts }));
    return (_jsxs(Dialog.Outer, { control: control, testID: "newChatDialog", children: [_jsx(Dialog.Handle, {}), _jsx(Dialog.InnerFlatList, { ref: listRef, data: getData(), renderItem: renderItem, keyExtractor: keyExtractor, ListHeaderComponent: _jsxs(View, { style: [
                        native(a.pt_4xl),
                        a.flex_row,
                        a.justify_between,
                        a.border_b,
                        a.px_sm,
                        a.mb_sm,
                        t.atoms.bg,
                        t.atoms.border_contrast_medium,
                        isWeb
                            ? [
                                a.align_center,
                                {
                                    height: 48,
                                },
                            ]
                            : [a.pb_sm, a.align_end],
                    ], children: [_jsx(View, { style: { width: 60 } }), _jsx(Text, { style: [a.font_bold, a.text_xl], children: state.currentStep === 'Profiles' ? (_jsx(Trans, { children: "Edit People" })) : (_jsx(Trans, { children: "Edit Feeds" })) }), _jsx(View, { style: { width: 60 }, children: isWeb && (_jsx(Button, { label: _(msg `Close`), variant: "ghost", color: "primary", size: "small", onPress: () => control.close(), children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Close" }) }) })) })] }), stickyHeaderIndices: [0], style: [
                    web([a.py_0, { height: '100vh', maxHeight: 600 }, a.px_0]),
                    native({
                        height: '100%',
                        paddingHorizontal: 0,
                        marginTop: 0,
                        paddingTop: 0,
                    }),
                ], webInnerStyle: [a.py_0, { maxWidth: 500, minWidth: 200 }], keyboardDismissMode: "on-drag", removeClippedSubviews: true, initialNumToRender: initialNumToRender })] }));
}
//# sourceMappingURL=WizardEditListDialog.js.map