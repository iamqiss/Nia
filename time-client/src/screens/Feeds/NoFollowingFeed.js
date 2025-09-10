import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { TIMELINE_SAVED_FEED } from '#/lib/constants';
import { useAddSavedFeedsMutation } from '#/state/queries/preferences';
import { atoms as a, useTheme } from '#/alf';
import { InlineLinkText } from '#/components/Link';
import { Text } from '#/components/Typography';
export function NoFollowingFeed({ onAddFeed }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { mutateAsync: addSavedFeeds } = useAddSavedFeedsMutation();
    const addRecommendedFeeds = (e) => {
        e.preventDefault();
        addSavedFeeds([
            {
                ...TIMELINE_SAVED_FEED,
                pinned: true,
            },
        ]);
        onAddFeed?.();
        // prevent navigation
        return false;
    };
    return (_jsx(View, { style: [a.flex_row, a.flex_wrap, a.align_center, a.py_md, a.px_lg], children: _jsx(Text, { style: [a.leading_snug, t.atoms.text_contrast_medium], children: _jsxs(Trans, { children: ["Looks like you're missing a following feed.", ' ', _jsx(InlineLinkText, { to: "#", label: _(msg `Add the default feed of only people you follow`), onPress: addRecommendedFeeds, style: [a.leading_snug], children: "Click here to add one." })] }) }) }));
}
//# sourceMappingURL=NoFollowingFeed.js.map