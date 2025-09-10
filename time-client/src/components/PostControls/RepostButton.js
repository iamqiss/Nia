import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useCallback } from 'react';
import { View } from 'react-native';
import { msg, plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useHaptics } from '#/lib/haptics';
import { useRequireAuth } from '#/state/session';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { CloseQuote_Stroke2_Corner1_Rounded as Quote } from '#/components/icons/Quote';
import { Repost_Stroke2_Corner3_Rounded as Repost } from '#/components/icons/Repost';
import { useFormatPostStatCount } from '#/components/PostControls/util';
import { Text } from '#/components/Typography';
import { PostControlButton, PostControlButtonIcon, PostControlButtonText, } from './PostControlButton';
let RepostButton = ({ isReposted, repostCount, onRepost, onQuote, big, embeddingDisabled, }) => {
    const t = useTheme();
    const { _ } = useLingui();
    const requireAuth = useRequireAuth();
    const dialogControl = Dialog.useDialogControl();
    const formatPostStatCount = useFormatPostStatCount();
    const onPress = () => requireAuth(() => dialogControl.open());
    const onLongPress = () => requireAuth(() => {
        if (embeddingDisabled) {
            dialogControl.open();
        }
        else {
            onQuote();
        }
    });
    return (_jsxs(_Fragment, { children: [_jsxs(PostControlButton, { testID: "repostBtn", active: isReposted, activeColor: t.palette.positive_600, big: big, onPress: onPress, onLongPress: onLongPress, label: isReposted
                    ? _(msg({
                        message: `Undo repost (${plural(repostCount || 0, {
                            one: '# repost',
                            other: '# reposts',
                        })})`,
                        comment: 'Accessibility label for the repost button when the post has been reposted, verb followed by number of reposts and noun',
                    }))
                    : _(msg({
                        message: `Repost (${plural(repostCount || 0, {
                            one: '# repost',
                            other: '# reposts',
                        })})`,
                        comment: 'Accessibility label for the repost button when the post has not been reposted, verb form followed by number of reposts and noun form',
                    })), children: [_jsx(PostControlButtonIcon, { icon: Repost }), typeof repostCount !== 'undefined' && repostCount > 0 && (_jsx(PostControlButtonText, { testID: "repostCount", children: formatPostStatCount(repostCount) }))] }), _jsxs(Dialog.Outer, { control: dialogControl, nativeOptions: { preventExpansion: true }, children: [_jsx(Dialog.Handle, {}), _jsx(RepostButtonDialogInner, { isReposted: isReposted, onRepost: onRepost, onQuote: onQuote, embeddingDisabled: embeddingDisabled })] })] }));
};
RepostButton = memo(RepostButton);
export { RepostButton };
let RepostButtonDialogInner = ({ isReposted, onRepost, onQuote, embeddingDisabled, }) => {
    const t = useTheme();
    const { _ } = useLingui();
    const playHaptic = useHaptics();
    const control = Dialog.useDialogContext();
    const onPressRepost = useCallback(() => {
        if (!isReposted)
            playHaptic();
        control.close(() => {
            onRepost();
        });
    }, [control, isReposted, onRepost, playHaptic]);
    const onPressQuote = useCallback(() => {
        playHaptic();
        control.close(() => {
            onQuote();
        });
    }, [control, onQuote, playHaptic]);
    const onPressClose = useCallback(() => control.close(), [control]);
    return (_jsx(Dialog.ScrollableInner, { label: _(msg `Repost or quote post`), children: _jsxs(View, { style: a.gap_xl, children: [_jsxs(View, { style: a.gap_xs, children: [_jsxs(Button, { style: [a.justify_start, a.px_md, a.gap_sm], label: isReposted
                                ? _(msg `Remove repost`)
                                : _(msg({ message: `Repost`, context: 'action' })), onPress: onPressRepost, size: "large", variant: "ghost", color: "primary", children: [_jsx(Repost, { size: "lg", fill: t.palette.primary_500 }), _jsx(Text, { style: [a.font_bold, a.text_xl], children: isReposted ? (_jsx(Trans, { children: "Remove repost" })) : (_jsx(Trans, { context: "action", children: "Repost" })) })] }), _jsxs(Button, { disabled: embeddingDisabled, testID: "quoteBtn", style: [a.justify_start, a.px_md, a.gap_sm], label: embeddingDisabled
                                ? _(msg `Quote posts disabled`)
                                : _(msg `Quote post`), onPress: onPressQuote, size: "large", variant: "ghost", color: "primary", children: [_jsx(Quote, { size: "lg", fill: embeddingDisabled
                                        ? t.atoms.text_contrast_low.color
                                        : t.palette.primary_500 }), _jsx(Text, { style: [
                                        a.font_bold,
                                        a.text_xl,
                                        embeddingDisabled && t.atoms.text_contrast_low,
                                    ], children: embeddingDisabled ? (_jsx(Trans, { children: "Quote posts disabled" })) : (_jsx(Trans, { children: "Quote post" })) })] })] }), _jsx(Button, { label: _(msg `Cancel quote post`), onPress: onPressClose, size: "large", variant: "outline", color: "primary", children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Cancel" }) }) })] }) }));
};
RepostButtonDialogInner = memo(RepostButtonDialogInner);
export { RepostButtonDialogInner };
//# sourceMappingURL=RepostButton.js.map