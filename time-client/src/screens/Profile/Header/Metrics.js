import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg, plural } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { makeProfileLink } from '#/lib/routes/links';
import {} from '#/state/cache/types';
import { formatCount } from '#/view/com/util/numeric/format';
import { atoms as a, useTheme } from '#/alf';
import { InlineLinkText } from '#/components/Link';
import { Text } from '#/components/Typography';
export function ProfileHeaderMetrics({ profile, }) {
    const t = useTheme();
    const { _, i18n } = useLingui();
    const following = formatCount(i18n, profile.followsCount || 0);
    const followers = formatCount(i18n, profile.followersCount || 0);
    const pluralizedFollowers = plural(profile.followersCount || 0, {
        one: 'follower',
        other: 'followers',
    });
    const pluralizedFollowings = plural(profile.followsCount || 0, {
        one: 'following',
        other: 'following',
    });
    return (_jsxs(View, { style: [a.flex_row, a.gap_sm, a.align_center], pointerEvents: "box-none", children: [_jsxs(InlineLinkText, { testID: "profileHeaderFollowersButton", style: [a.flex_row, t.atoms.text], to: makeProfileLink(profile, 'followers'), label: `${profile.followersCount || 0} ${pluralizedFollowers}`, children: [_jsxs(Text, { style: [a.font_bold, a.text_md], children: [followers, " "] }), _jsx(Text, { style: [t.atoms.text_contrast_medium, a.text_md], children: pluralizedFollowers })] }), _jsxs(InlineLinkText, { testID: "profileHeaderFollowsButton", style: [a.flex_row, t.atoms.text], to: makeProfileLink(profile, 'follows'), label: _(msg `${profile.followsCount || 0} following`), children: [_jsxs(Text, { style: [a.font_bold, a.text_md], children: [following, " "] }), _jsx(Text, { style: [t.atoms.text_contrast_medium, a.text_md], children: pluralizedFollowings })] }), _jsxs(Text, { style: [a.font_bold, t.atoms.text, a.text_md], children: [formatCount(i18n, profile.postsCount || 0), ' ', _jsx(Text, { style: [t.atoms.text_contrast_medium, a.font_normal, a.text_md], children: plural(profile.postsCount || 0, { one: 'post', other: 'posts' }) })] })] }));
}
//# sourceMappingURL=Metrics.js.map