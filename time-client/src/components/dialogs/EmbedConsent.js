import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { embedPlayerSources, externalEmbedLabels, } from '#/lib/strings/embed-player';
import { useSetExternalEmbedPref } from '#/state/preferences';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { Text } from '#/components/Typography';
export function EmbedConsentDialog({ control, source, onAccept, }) {
    const { _ } = useLingui();
    const t = useTheme();
    const setExternalEmbedPref = useSetExternalEmbedPref();
    const { gtMobile } = useBreakpoints();
    const onShowAllPress = useCallback(() => {
        for (const key of embedPlayerSources) {
            setExternalEmbedPref(key, 'show');
        }
        onAccept();
        control.close();
    }, [control, onAccept, setExternalEmbedPref]);
    const onShowPress = useCallback(() => {
        setExternalEmbedPref(source, 'show');
        onAccept();
        control.close();
    }, [control, onAccept, setExternalEmbedPref, source]);
    const onHidePress = useCallback(() => {
        setExternalEmbedPref(source, 'hide');
        control.close();
    }, [control, setExternalEmbedPref, source]);
    return (_jsxs(Dialog.Outer, { control: control, nativeOptions: { preventExpansion: true }, children: [_jsx(Dialog.Handle, {}), _jsxs(Dialog.ScrollableInner, { label: _(msg `External Media`), style: [gtMobile ? { width: 'auto', maxWidth: 400 } : a.w_full], children: [_jsxs(View, { style: a.gap_sm, children: [_jsx(Text, { style: [a.text_2xl, a.font_bold], children: _jsx(Trans, { children: "External Media" }) }), _jsxs(View, { style: [a.mt_sm, a.mb_2xl, a.gap_lg], children: [_jsx(Text, { children: _jsxs(Trans, { children: ["This content is hosted by ", externalEmbedLabels[source], ". Do you want to enable external media?"] }) }), _jsx(Text, { style: t.atoms.text_contrast_medium, children: _jsx(Trans, { children: "External media may allow websites to collect information about you and your device. No information is sent or requested until you press the \"play\" button." }) })] })] }), _jsxs(View, { style: a.gap_md, children: [_jsx(Button, { style: gtMobile && a.flex_1, label: _(msg `Enable external media`), onPress: onShowAllPress, onAccessibilityEscape: control.close, color: "primary", size: "large", variant: "solid", children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Enable external media" }) }) }), _jsx(Button, { style: gtMobile && a.flex_1, label: _(msg `Enable this source only`), onPress: onShowPress, onAccessibilityEscape: control.close, color: "secondary", size: "large", variant: "solid", children: _jsx(ButtonText, { children: _jsxs(Trans, { children: ["Enable ", externalEmbedLabels[source], " only"] }) }) }), _jsx(Button, { label: _(msg `No thanks`), onAccessibilityEscape: control.close, onPress: onHidePress, color: "secondary", size: "large", variant: "ghost", children: _jsx(ButtonText, { children: _jsx(Trans, { children: "No thanks" }) }) })] }), _jsx(Dialog.Close, {})] })] }));
}
//# sourceMappingURL=EmbedConsent.js.map