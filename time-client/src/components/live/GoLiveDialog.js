import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { cleanError } from '#/lib/strings/errors';
import { definitelyUrl } from '#/lib/strings/url-helpers';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { useTickEveryMinute } from '#/state/shell';
import { atoms as a, ios, native, platform, useTheme, web } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import * as TextField from '#/components/forms/TextField';
import { Warning_Stroke2_Corner0_Rounded as WarningIcon } from '#/components/icons/Warning';
import { Loader } from '#/components/Loader';
import * as ProfileCard from '#/components/ProfileCard';
import * as Select from '#/components/Select';
import { Text } from '#/components/Typography';
import { LinkPreview } from './LinkPreview';
import { useLiveLinkMetaQuery, useUpsertLiveStatusMutation } from './queries';
import { displayDuration, useDebouncedValue } from './utils';
export function GoLiveDialog({ control, profile, }) {
    return (_jsxs(Dialog.Outer, { control: control, nativeOptions: { preventExpansion: true }, children: [_jsx(Dialog.Handle, {}), _jsx(DialogInner, { profile: profile })] }));
}
// Possible durations: max 4 hours, 5 minute intervals
const DURATIONS = Array.from({ length: (4 * 60) / 5 }).map((_, i) => (i + 1) * 5);
function DialogInner({ profile }) {
    const control = Dialog.useDialogContext();
    const { _, i18n } = useLingui();
    const t = useTheme();
    const [liveLink, setLiveLink] = useState('');
    const [liveLinkError, setLiveLinkError] = useState('');
    const [duration, setDuration] = useState(60);
    const moderationOpts = useModerationOpts();
    const tick = useTickEveryMinute();
    const time = useCallback((offset) => {
        tick;
        const date = new Date();
        date.setMinutes(date.getMinutes() + offset);
        return i18n
            .date(date, { hour: 'numeric', minute: '2-digit', hour12: true })
            .toLocaleUpperCase()
            .replace(' ', '');
    }, [tick, i18n]);
    const onChangeDuration = useCallback((newDuration) => {
        setDuration(Number(newDuration));
    }, []);
    const liveLinkUrl = definitelyUrl(liveLink);
    const debouncedUrl = useDebouncedValue(liveLinkUrl, 500);
    const { data: linkMeta, isSuccess: hasValidLinkMeta, isLoading: linkMetaLoading, error: linkMetaError, } = useLiveLinkMetaQuery(debouncedUrl);
    const { mutate: goLive, isPending: isGoingLive, error: goLiveError, } = useUpsertLiveStatusMutation(duration, linkMeta);
    const isSourceInvalid = !!liveLinkError || !!linkMetaError;
    const hasLink = !!debouncedUrl && !isSourceInvalid;
    return (_jsxs(Dialog.ScrollableInner, { label: _(msg `Go Live`), style: web({ maxWidth: 420 }), children: [_jsxs(View, { style: [a.gap_xl], children: [_jsxs(View, { style: [a.gap_sm], children: [_jsx(Text, { style: [a.font_bold, a.text_2xl], children: _jsx(Trans, { children: "Go Live" }) }), _jsx(Text, { style: [a.text_md, a.leading_snug, t.atoms.text_contrast_high], children: _jsx(Trans, { children: "Add a temporary live status to your profile. When someone clicks on your avatar, they\u2019ll see information about your live event." }) })] }), moderationOpts && (_jsxs(ProfileCard.Header, { children: [_jsx(ProfileCard.Avatar, { profile: profile, moderationOpts: moderationOpts, liveOverride: true, disabledPreview: true }), _jsx(ProfileCard.NameAndHandle, { profile: profile, moderationOpts: moderationOpts })] })), _jsxs(View, { style: [a.gap_sm], children: [_jsxs(View, { children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "Live link" }) }), _jsx(TextField.Root, { isInvalid: isSourceInvalid, children: _jsx(TextField.Input, { label: _(msg `Live link`), placeholder: _(msg `www.mylivestream.tv`), value: liveLink, onChangeText: setLiveLink, onFocus: () => setLiveLinkError(''), onBlur: () => {
                                                if (!definitelyUrl(liveLink)) {
                                                    setLiveLinkError('Invalid URL');
                                                }
                                            }, returnKeyType: "done", autoCapitalize: "none", autoComplete: "url", autoCorrect: false }) })] }), (liveLinkError || linkMetaError) && (_jsxs(View, { style: [a.flex_row, a.gap_xs, a.align_center], children: [_jsx(WarningIcon, { style: [{ color: t.palette.negative_500 }], size: "sm" }), _jsx(Text, { style: [
                                            a.text_sm,
                                            a.leading_snug,
                                            a.flex_1,
                                            a.font_bold,
                                            { color: t.palette.negative_500 },
                                        ], children: liveLinkError ? (_jsx(Trans, { children: "This is not a valid link" })) : (cleanError(linkMetaError)) })] })), _jsx(LinkPreview, { linkMeta: linkMeta, loading: linkMetaLoading })] }), hasLink && (_jsxs(View, { children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "Go live for" }) }), _jsxs(Select.Root, { value: String(duration), onValueChange: onChangeDuration, children: [_jsxs(Select.Trigger, { label: _(msg `Select duration`), children: [_jsxs(Text, { style: [ios(a.py_xs)], children: [displayDuration(i18n, duration), '  ', _jsx(Text, { style: [t.atoms.text_contrast_low], children: time(duration) })] }), _jsx(Select.Icon, {})] }), _jsx(Select.Content, { renderItem: (item, _i, selectedValue) => {
                                            const label = displayDuration(i18n, item);
                                            return (_jsxs(Select.Item, { value: String(item), label: label, children: [_jsx(Select.ItemIndicator, {}), _jsxs(Select.ItemText, { children: [label, '  ', _jsx(Text, { style: [
                                                                    native(a.text_md),
                                                                    web(a.ml_xs),
                                                                    selectedValue === String(item)
                                                                        ? t.atoms.text_contrast_medium
                                                                        : t.atoms.text_contrast_low,
                                                                    a.font_normal,
                                                                ], children: time(item) })] })] }));
                                        }, items: DURATIONS, valueExtractor: d => String(d) })] })] })), goLiveError && (_jsx(Admonition, { type: "error", children: cleanError(goLiveError) })), _jsxs(View, { style: platform({
                            native: [a.gap_md, a.pt_lg],
                            web: [a.flex_row_reverse, a.gap_md, a.align_center],
                        }), children: [hasLink && (_jsxs(Button, { label: _(msg `Go Live`), size: platform({ native: 'large', web: 'small' }), color: "primary", variant: "solid", onPress: () => goLive(), disabled: isGoingLive || !hasValidLinkMeta || debouncedUrl !== liveLinkUrl, children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Go Live" }) }), isGoingLive && _jsx(ButtonIcon, { icon: Loader })] })), _jsx(Button, { label: _(msg `Cancel`), onPress: () => control.close(), size: platform({ native: 'large', web: 'small' }), color: "secondary", variant: platform({ native: 'solid', web: 'ghost' }), children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Cancel" }) }) })] })] }), _jsx(Dialog.Close, {})] }));
}
//# sourceMappingURL=GoLiveDialog.js.map