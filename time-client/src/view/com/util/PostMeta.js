import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useCallback } from 'react';
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useActorStatus } from '#/lib/actor-status';
import { makeProfileLink } from '#/lib/routes/links';
import { forceLTR } from '#/lib/strings/bidi';
import { NON_BREAKING_SPACE } from '#/lib/strings/constants';
import { sanitizeDisplayName } from '#/lib/strings/display-names';
import { sanitizeHandle } from '#/lib/strings/handles';
import { niceDate } from '#/lib/strings/time';
import { isAndroid } from '#/platform/detection';
import { useProfileShadow } from '#/state/cache/profile-shadow';
import { precacheProfile } from '#/state/queries/profile';
import { atoms as a, platform, useTheme, web } from '#/alf';
import { WebOnlyInlineLinkText } from '#/components/Link';
import { ProfileHoverCard } from '#/components/ProfileHoverCard';
import { Text } from '#/components/Typography';
import { useSimpleVerificationState } from '#/components/verification';
import { VerificationCheck } from '#/components/verification/VerificationCheck';
import { TimeElapsed } from './TimeElapsed';
import { PreviewableUserAvatar } from './UserAvatar';
let PostMeta = (opts) => {
    const t = useTheme();
    const { i18n, _ } = useLingui();
    const author = useProfileShadow(opts.author);
    const displayName = author.displayName || author.handle;
    const handle = author.handle;
    const profileLink = makeProfileLink(author);
    const queryClient = useQueryClient();
    const onOpenAuthor = opts.onOpenAuthor;
    const onBeforePressAuthor = useCallback(() => {
        precacheProfile(queryClient, author);
        onOpenAuthor?.();
    }, [queryClient, author, onOpenAuthor]);
    const onBeforePressPost = useCallback(() => {
        precacheProfile(queryClient, author);
    }, [queryClient, author]);
    const timestampLabel = niceDate(i18n, opts.timestamp);
    const verification = useSimpleVerificationState({ profile: author });
    const { isActive: live } = useActorStatus(author);
    return (_jsxs(View, { style: [
            a.flex_1,
            a.flex_row,
            a.align_center,
            a.pb_xs,
            a.gap_xs,
            a.z_20,
            opts.style,
        ], children: [opts.showAvatar && (_jsx(View, { style: [a.self_center, a.mr_2xs], children: _jsx(PreviewableUserAvatar, { size: opts.avatarSize || 16, profile: author, moderation: opts.moderation?.ui('avatar'), type: author.associated?.labeler ? 'labeler' : 'user', live: live, hideLiveBadge: true }) })), _jsxs(View, { style: [a.flex_row, a.align_end, a.flex_shrink], children: [_jsx(ProfileHoverCard, { did: author.did, children: _jsxs(View, { style: [a.flex_row, a.align_end, a.flex_shrink], children: [_jsx(WebOnlyInlineLinkText, { emoji: true, numberOfLines: 1, to: profileLink, label: _(msg `View profile`), disableMismatchWarning: true, onPress: onBeforePressAuthor, style: [
                                        a.text_md,
                                        a.font_bold,
                                        t.atoms.text,
                                        a.leading_tight,
                                        a.flex_shrink_0,
                                        { maxWidth: '70%' },
                                    ], children: forceLTR(sanitizeDisplayName(displayName, opts.moderation?.ui('displayName'))) }), verification.showBadge && (_jsx(View, { style: [
                                        a.pl_2xs,
                                        a.self_center,
                                        {
                                            marginTop: platform({ web: 0, ios: 0, android: -1 }),
                                        },
                                    ], children: _jsx(VerificationCheck, { width: platform({ android: 13, default: 12 }), verifier: verification.role === 'verifier' }) })), _jsx(WebOnlyInlineLinkText, { emoji: true, numberOfLines: 1, to: profileLink, label: _(msg `View profile`), disableMismatchWarning: true, disableUnderline: true, onPress: onBeforePressAuthor, style: [
                                        a.text_md,
                                        t.atoms.text_contrast_medium,
                                        a.leading_tight,
                                        { flexShrink: 10 },
                                    ], children: NON_BREAKING_SPACE + sanitizeHandle(handle, '@') })] }) }), _jsx(TimeElapsed, { timestamp: opts.timestamp, children: ({ timeElapsed }) => (_jsxs(WebOnlyInlineLinkText, { to: opts.postHref, label: timestampLabel, title: timestampLabel, disableMismatchWarning: true, disableUnderline: true, onPress: onBeforePressPost, style: [
                                a.pl_xs,
                                a.text_md,
                                a.leading_tight,
                                isAndroid && a.flex_grow,
                                a.text_right,
                                t.atoms.text_contrast_medium,
                                web({
                                    whiteSpace: 'nowrap',
                                }),
                            ], children: [!isAndroid && (_jsxs(Text, { style: [
                                        a.text_md,
                                        a.leading_tight,
                                        t.atoms.text_contrast_medium,
                                    ], accessible: false, children: ["\u00B7", ' '] })), timeElapsed] })) })] })] }));
};
PostMeta = memo(PostMeta);
export { PostMeta };
//# sourceMappingURL=PostMeta.js.map