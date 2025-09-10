import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { View } from 'react-native';
import { AtUri } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { cleanError } from '#/lib/strings/errors';
import { isNative, isWeb } from '#/platform/detection';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { getFeedTypeFromUri } from '#/state/queries/feed';
import { useProfileQuery } from '#/state/queries/profile';
import { atoms as a, useTheme, web } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { Divider } from '#/components/Divider';
import { Warning_Stroke2_Corner0_Rounded as WarningIcon } from '#/components/icons/Warning';
import * as ProfileCard from '#/components/ProfileCard';
import { Text } from '#/components/Typography';
export function MissingFeed({ style, hideTopBorder, uri, error, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const control = Dialog.useDialogControl();
    const type = getFeedTypeFromUri(uri);
    return (_jsxs(_Fragment, { children: [_jsx(Button, { label: type === 'feed'
                    ? _(msg `Could not connect to custom feed`)
                    : _(msg `Deleted list`), accessibilityHint: _(msg `Tap for more information`), onPress: control.open, style: [
                    a.flex_1,
                    a.p_lg,
                    a.gap_md,
                    !hideTopBorder && !a.border_t,
                    t.atoms.border_contrast_low,
                    a.justify_start,
                    style,
                ], children: _jsxs(View, { style: [a.flex_row, a.align_center], children: [_jsx(View, { style: [
                                { width: 36, height: 36 },
                                t.atoms.bg_contrast_25,
                                a.rounded_sm,
                                a.mr_md,
                                a.align_center,
                                a.justify_center,
                            ], children: _jsx(WarningIcon, { size: "lg" }) }), _jsxs(View, { style: [a.flex_1], children: [_jsx(Text, { emoji: true, style: [a.text_sm, a.font_bold, a.leading_snug, a.italic], numberOfLines: 1, children: type === 'feed' ? (_jsx(Trans, { children: "Feed unavailable" })) : (_jsx(Trans, { children: "Deleted list" })) }), _jsx(Text, { style: [
                                        a.text_sm,
                                        t.atoms.text_contrast_medium,
                                        a.leading_snug,
                                        a.italic,
                                    ], numberOfLines: 1, children: isWeb ? (_jsx(Trans, { children: "Click for information" })) : (_jsx(Trans, { children: "Tap for information" })) })] })] }) }), _jsxs(Dialog.Outer, { control: control, nativeOptions: { preventExpansion: true }, children: [_jsx(Dialog.Handle, {}), _jsx(DialogInner, { uri: uri, type: type, error: error })] })] }));
}
function DialogInner({ uri, type, error, }) {
    const control = Dialog.useDialogContext();
    const t = useTheme();
    const { _ } = useLingui();
    const atUri = new AtUri(uri);
    const { data: profile, isError: isProfileError } = useProfileQuery({
        did: atUri.host,
    });
    const moderationOpts = useModerationOpts();
    return (_jsxs(Dialog.ScrollableInner, { label: type === 'feed'
            ? _(msg `Unavailable feed information`)
            : _(msg `Deleted list`), style: web({ maxWidth: 500 }), children: [_jsxs(View, { style: [a.gap_sm], children: [_jsx(Text, { style: [a.font_heavy, a.text_2xl], children: type === 'feed' ? (_jsx(Trans, { children: "Could not connect to feed service" })) : (_jsx(Trans, { children: "Deleted list" })) }), _jsx(Text, { style: [t.atoms.text_contrast_high, a.leading_snug], children: type === 'feed' ? (_jsx(Trans, { children: "We could not connect to the service that provides this custom feed. It may be temporarily unavailable and experiencing issues, or permanently unavailable." })) : (_jsx(Trans, { children: "We could not find this list. It was probably deleted." })) }), _jsx(Divider, { style: [a.my_md] }), _jsx(Text, { style: [a.font_bold, t.atoms.text_contrast_high], children: type === 'feed' ? (_jsx(Trans, { children: "Feed creator" })) : (_jsx(Trans, { children: "List creator" })) }), profile && moderationOpts && (_jsx(View, { style: [a.w_full, a.align_start], children: _jsx(ProfileCard.Link, { profile: profile, onPress: () => control.close(), children: _jsxs(ProfileCard.Header, { children: [_jsx(ProfileCard.Avatar, { profile: profile, moderationOpts: moderationOpts, disabledPreview: true }), _jsx(ProfileCard.NameAndHandle, { profile: profile, moderationOpts: moderationOpts })] }) }) })), isProfileError && (_jsx(Text, { style: [
                            t.atoms.text_contrast_high,
                            a.italic,
                            a.text_center,
                            a.w_full,
                        ], children: _jsx(Trans, { children: "Could not find profile" }) })), type === 'feed' && (_jsxs(_Fragment, { children: [_jsx(Text, { style: [a.font_bold, t.atoms.text_contrast_high, a.mt_md], children: _jsx(Trans, { children: "Feed identifier" }) }), _jsx(Text, { style: [a.text_md, t.atoms.text_contrast_high, a.italic], children: atUri.rkey })] })), error instanceof Error && (_jsxs(_Fragment, { children: [_jsx(Text, { style: [a.font_bold, t.atoms.text_contrast_high, a.mt_md], children: _jsx(Trans, { children: "Error message" }) }), _jsx(Text, { style: [a.text_md, t.atoms.text_contrast_high, a.italic], children: cleanError(error.message) })] }))] }), isNative && (_jsx(Button, { label: _(msg `Close`), onPress: () => control.close(), size: "small", variant: "solid", color: "secondary", style: [a.mt_5xl], children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Close" }) }) })), _jsx(Dialog.Close, {})] }));
}
//# sourceMappingURL=MissingFeed.js.map