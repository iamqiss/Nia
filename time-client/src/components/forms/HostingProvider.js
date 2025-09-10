import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { Keyboard, View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { toNiceDomain } from '#/lib/strings/url-helpers';
import { ServerInputDialog } from '#/view/com/auth/server-input';
import { atoms as a, tokens, useTheme } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { useDialogControl } from '#/components/Dialog';
import { Globe_Stroke2_Corner0_Rounded as GlobeIcon } from '#/components/icons/Globe';
import { PencilLine_Stroke2_Corner0_Rounded as PencilIcon } from '#/components/icons/Pencil';
import { Text } from '#/components/Typography';
export function HostingProvider({ serviceUrl, onSelectServiceUrl, onOpenDialog, minimal, }) {
    const serverInputControl = useDialogControl();
    const t = useTheme();
    const { _ } = useLingui();
    const onPressSelectService = React.useCallback(() => {
        Keyboard.dismiss();
        serverInputControl.open();
        onOpenDialog?.();
    }, [onOpenDialog, serverInputControl]);
    return (_jsxs(_Fragment, { children: [_jsx(ServerInputDialog, { control: serverInputControl, onSelect: onSelectServiceUrl }), minimal ? (_jsxs(View, { style: [a.flex_row, a.align_center, a.flex_wrap, a.gap_xs], children: [_jsx(Text, { style: [a.text_sm, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "You are creating an account on" }) }), _jsxs(Button, { label: toNiceDomain(serviceUrl), accessibilityHint: _(msg `Changes hosting provider`), onPress: onPressSelectService, variant: "ghost", color: "secondary", size: "tiny", style: [
                            a.px_xs,
                            { marginHorizontal: tokens.space.xs * -1 },
                            { paddingVertical: 0 },
                        ], children: [_jsx(ButtonText, { style: [a.text_sm], children: toNiceDomain(serviceUrl) }), _jsx(ButtonIcon, { icon: PencilIcon })] })] })) : (_jsx(Button, { testID: "selectServiceButton", label: toNiceDomain(serviceUrl), accessibilityHint: _(msg `Changes hosting provider`), variant: "solid", color: "secondary", style: [
                    a.w_full,
                    a.flex_row,
                    a.align_center,
                    a.rounded_sm,
                    a.py_sm,
                    a.pl_md,
                    a.pr_sm,
                    a.gap_xs,
                ], onPress: onPressSelectService, children: ({ hovered, pressed }) => {
                    const interacted = hovered || pressed;
                    return (_jsxs(_Fragment, { children: [_jsx(View, { style: a.pr_xs, children: _jsx(GlobeIcon, { size: "md", fill: interacted
                                        ? t.palette.contrast_800
                                        : t.palette.contrast_500 }) }), _jsx(Text, { style: [a.text_md], children: toNiceDomain(serviceUrl) }), _jsx(View, { style: [
                                    a.rounded_sm,
                                    interacted
                                        ? t.atoms.bg_contrast_300
                                        : t.atoms.bg_contrast_100,
                                    { marginLeft: 'auto', padding: 6 },
                                ], children: _jsx(PencilIcon, { size: "sm", style: {
                                        color: interacted
                                            ? t.palette.contrast_800
                                            : t.palette.contrast_500,
                                    } }) })] }));
                } }))] }));
}
//# sourceMappingURL=HostingProvider.js.map