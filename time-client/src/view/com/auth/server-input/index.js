import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useImperativeHandle, useRef, useState } from 'react';
import { View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { BSKY_SERVICE } from '#/lib/constants';
import { logEvent } from '#/lib/statsig/statsig';
import * as persisted from '#/state/persisted';
import { useSession } from '#/state/session';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { Button, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import * as TextField from '#/components/forms/TextField';
import * as ToggleButton from '#/components/forms/ToggleButton';
import { Globe_Stroke2_Corner0_Rounded as Globe } from '#/components/icons/Globe';
import { InlineLinkText } from '#/components/Link';
import { P, Text } from '#/components/Typography';
export function ServerInputDialog({ control, onSelect, }) {
    const { height } = useWindowDimensions();
    const formRef = useRef(null);
    // persist these options between dialog open/close
    const [fixedOption, setFixedOption] = useState(BSKY_SERVICE);
    const [previousCustomAddress, setPreviousCustomAddress] = useState('');
    const onClose = useCallback(() => {
        const result = formRef.current?.getFormState();
        if (result) {
            onSelect(result);
            if (result !== BSKY_SERVICE) {
                setPreviousCustomAddress(result);
            }
        }
        logEvent('signin:hostingProviderPressed', {
            hostingProviderDidChange: fixedOption !== BSKY_SERVICE,
        });
    }, [onSelect, fixedOption]);
    return (_jsxs(Dialog.Outer, { control: control, onClose: onClose, nativeOptions: { minHeight: height / 2 }, children: [_jsx(Dialog.Handle, {}), _jsx(DialogInner, { formRef: formRef, fixedOption: fixedOption, setFixedOption: setFixedOption, initialCustomAddress: previousCustomAddress })] }));
}
function DialogInner({ formRef, fixedOption, setFixedOption, initialCustomAddress, }) {
    const control = Dialog.useDialogContext();
    const { _ } = useLingui();
    const t = useTheme();
    const { accounts } = useSession();
    const { gtMobile } = useBreakpoints();
    const [customAddress, setCustomAddress] = useState(initialCustomAddress);
    const [pdsAddressHistory, setPdsAddressHistory] = useState(persisted.get('pdsAddressHistory') || []);
    useImperativeHandle(formRef, () => ({
        getFormState: () => {
            let url;
            if (fixedOption === 'custom') {
                url = customAddress.trim().toLowerCase();
                if (!url) {
                    return null;
                }
            }
            else {
                url = fixedOption;
            }
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                if (url === 'localhost' || url.startsWith('localhost:')) {
                    url = `http://${url}`;
                }
                else {
                    url = `https://${url}`;
                }
            }
            if (fixedOption === 'custom') {
                if (!pdsAddressHistory.includes(url)) {
                    const newHistory = [url, ...pdsAddressHistory.slice(0, 4)];
                    setPdsAddressHistory(newHistory);
                    persisted.write('pdsAddressHistory', newHistory);
                }
            }
            return url;
        },
    }), [customAddress, fixedOption, pdsAddressHistory]);
    const isFirstTimeUser = accounts.length === 0;
    return (_jsx(Dialog.ScrollableInner, { accessibilityDescribedBy: "dialog-description", accessibilityLabelledBy: "dialog-title", children: _jsxs(View, { style: [a.relative, a.gap_md, a.w_full], children: [_jsx(Text, { nativeID: "dialog-title", style: [a.text_2xl, a.font_bold], children: _jsx(Trans, { children: "Choose your account provider" }) }), _jsxs(ToggleButton.Group, { label: "Preferences", values: [fixedOption], onChange: values => setFixedOption(values[0]), children: [_jsx(ToggleButton.Button, { name: BSKY_SERVICE, label: _(msg `Bluesky`), children: _jsx(ToggleButton.ButtonText, { children: _(msg `Bluesky`) }) }), _jsx(ToggleButton.Button, { testID: "customSelectBtn", name: "custom", label: _(msg `Custom`), children: _jsx(ToggleButton.ButtonText, { children: _(msg `Custom`) }) })] }), fixedOption === BSKY_SERVICE && isFirstTimeUser && (_jsx(Admonition, { type: "tip", children: _jsx(Trans, { children: "Bluesky is an open network where you can choose your own provider. If you're new here, we recommend sticking with the default Bluesky Social option." }) })), fixedOption === 'custom' && (_jsxs(View, { style: [
                        a.border,
                        t.atoms.border_contrast_low,
                        a.rounded_sm,
                        a.px_md,
                        a.py_md,
                    ], children: [_jsx(TextField.LabelText, { nativeID: "address-input-label", children: _jsx(Trans, { children: "Server address" }) }), _jsxs(TextField.Root, { children: [_jsx(TextField.Icon, { icon: Globe }), _jsx(Dialog.Input, { testID: "customServerTextInput", value: customAddress, onChangeText: setCustomAddress, label: "my-server.com", accessibilityLabelledBy: "address-input-label", autoCapitalize: "none", keyboardType: "url" })] }), pdsAddressHistory.length > 0 && (_jsx(View, { style: [a.flex_row, a.flex_wrap, a.mt_xs], children: pdsAddressHistory.map(uri => (_jsx(Button, { variant: "ghost", color: "primary", label: uri, style: [a.px_sm, a.py_xs, a.rounded_sm, a.gap_sm], onPress: () => setCustomAddress(uri), children: _jsx(ButtonText, { children: uri }) }, uri))) }))] })), _jsx(View, { style: [a.py_xs], children: _jsxs(P, { style: [
                            t.atoms.text_contrast_medium,
                            a.text_sm,
                            a.leading_snug,
                            a.flex_1,
                        ], children: [isFirstTimeUser ? (_jsx(Trans, { children: "If you're a developer, you can host your own server." })) : (_jsx(Trans, { children: "Bluesky is an open network where you can choose your hosting provider. If you're a developer, you can host your own server." })), ' ', _jsx(InlineLinkText, { label: _(msg `Learn more about self hosting your PDS.`), to: "https://atproto.com/guides/self-hosting", children: _jsx(Trans, { children: "Learn more." }) })] }) }), _jsx(View, { style: gtMobile && [a.flex_row, a.justify_end], children: _jsx(Button, { testID: "doneBtn", variant: "outline", color: "primary", size: "small", onPress: () => control.close(), label: _(msg `Done`), children: _jsx(ButtonText, { children: _(msg `Done`) }) }) })] }) }));
}
//# sourceMappingURL=index.js.map