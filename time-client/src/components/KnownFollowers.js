import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { moderateProfile, } from '@atproto/api';
import { msg, Plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { makeProfileLink } from '#/lib/routes/links';
import { sanitizeDisplayName } from '#/lib/strings/display-names';
import { UserAvatar } from '#/view/com/util/UserAvatar';
import { atoms as a, useTheme } from '#/alf';
import { Link } from '#/components/Link';
import { Text } from '#/components/Typography';
const AVI_SIZE = 30;
const AVI_SIZE_SMALL = 20;
const AVI_BORDER = 1;
/**
 * Shared logic to determine if `KnownFollowers` should be shown.
 *
 * Checks the # of actual returned users instead of the `count` value, because
 * `count` includes blocked users and `followers` does not.
 */
export function shouldShowKnownFollowers(knownFollowers) {
    return knownFollowers && knownFollowers.followers.length > 0;
}
export function KnownFollowers({ profile, moderationOpts, onLinkPress, minimal, showIfEmpty, }) {
    const cache = React.useRef(new Map());
    /*
     * Results for `knownFollowers` are not sorted consistently, so when
     * revalidating we can see a flash of this data updating. This cache prevents
     * this happening for screens that remain in memory. When pushing a new
     * screen, or once this one is popped, this cache is empty, so new data is
     * displayed.
     */
    if (profile.viewer?.knownFollowers && !cache.current.has(profile.did)) {
        cache.current.set(profile.did, profile.viewer.knownFollowers);
    }
    const cachedKnownFollowers = cache.current.get(profile.did);
    if (cachedKnownFollowers && shouldShowKnownFollowers(cachedKnownFollowers)) {
        return (_jsx(KnownFollowersInner, { profile: profile, cachedKnownFollowers: cachedKnownFollowers, moderationOpts: moderationOpts, onLinkPress: onLinkPress, minimal: minimal, showIfEmpty: showIfEmpty }));
    }
    return _jsx(EmptyFallback, { show: showIfEmpty });
}
function KnownFollowersInner({ profile, moderationOpts, cachedKnownFollowers, onLinkPress, minimal, showIfEmpty, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const textStyle = [a.text_sm, a.leading_snug, t.atoms.text_contrast_medium];
    const slice = cachedKnownFollowers.followers.slice(0, 3).map(f => {
        const moderation = moderateProfile(f, moderationOpts);
        return {
            profile: {
                ...f,
                displayName: sanitizeDisplayName(f.displayName || f.handle, moderation.ui('displayName')),
            },
            moderation,
        };
    });
    // Does not have blocks applied. Always >= slices.length
    const serverCount = cachedKnownFollowers.count;
    /*
     * We check above too, but here for clarity and a reminder to _check for
     * valid indices_
     */
    if (slice.length === 0)
        return _jsx(EmptyFallback, { show: showIfEmpty });
    const SIZE = minimal ? AVI_SIZE_SMALL : AVI_SIZE;
    return (_jsx(Link, { label: _(msg `Press to view followers of this account that you also follow`), onPress: onLinkPress, to: makeProfileLink(profile, 'known-followers'), style: [
            a.max_w_full,
            a.flex_row,
            minimal ? a.gap_sm : a.gap_md,
            a.align_center,
            { marginLeft: -AVI_BORDER },
        ], children: ({ hovered, pressed }) => (_jsxs(_Fragment, { children: [_jsx(View, { style: [
                        a.flex_row,
                        {
                            height: SIZE,
                        },
                        pressed && {
                            opacity: 0.5,
                        },
                    ], children: slice.map(({ profile: prof, moderation }, i) => (_jsx(View, { style: [
                            a.rounded_full,
                            {
                                borderWidth: AVI_BORDER,
                                borderColor: t.atoms.bg.backgroundColor,
                                width: SIZE + AVI_BORDER * 2,
                                height: SIZE + AVI_BORDER * 2,
                                zIndex: AVI_BORDER - i,
                                marginLeft: i > 0 ? -8 : 0,
                            },
                        ], children: _jsx(UserAvatar, { size: SIZE, avatar: prof.avatar, moderation: moderation.ui('avatar'), type: prof.associated?.labeler ? 'labeler' : 'user', noBorder: true }) }, prof.did))) }), _jsx(Text, { style: [
                        a.flex_shrink,
                        textStyle,
                        hovered && {
                            textDecorationLine: 'underline',
                            textDecorationColor: t.atoms.text_contrast_medium.color,
                        },
                        pressed && {
                            opacity: 0.5,
                        },
                    ], numberOfLines: 2, children: slice.length >= 2 ? (
                    // 2-n followers, including blocks
                    serverCount > 2 ? (_jsxs(Trans, { children: ["Followed by", ' ', _jsx(Text, { emoji: true, style: textStyle, children: slice[0].profile.displayName }, slice[0].profile.did), ",", ' ', _jsx(Text, { emoji: true, style: textStyle, children: slice[1].profile.displayName }, slice[1].profile.did), ", and", ' ', _jsx(Plural, { value: serverCount - 2, one: "# other", other: "# others" })] })) : (
                    // only 2
                    _jsxs(Trans, { children: ["Followed by", ' ', _jsx(Text, { emoji: true, style: textStyle, children: slice[0].profile.displayName }, slice[0].profile.did), ' ', "and", ' ', _jsx(Text, { emoji: true, style: textStyle, children: slice[1].profile.displayName }, slice[1].profile.did)] }))) : serverCount > 1 ? (
                    // 1-n followers, including blocks
                    _jsxs(Trans, { children: ["Followed by", ' ', _jsx(Text, { emoji: true, style: textStyle, children: slice[0].profile.displayName }, slice[0].profile.did), ' ', "and", ' ', _jsx(Plural, { value: serverCount - 1, one: "# other", other: "# others" })] })) : (
                    // only 1
                    _jsxs(Trans, { children: ["Followed by", ' ', _jsx(Text, { emoji: true, style: textStyle, children: slice[0].profile.displayName }, slice[0].profile.did)] })) })] })) }));
}
function EmptyFallback({ show }) {
    const t = useTheme();
    if (!show)
        return null;
    return (_jsx(Text, { style: [a.text_sm, a.leading_snug, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Not followed by anyone you're following" }) }));
}
//# sourceMappingURL=KnownFollowers.js.map