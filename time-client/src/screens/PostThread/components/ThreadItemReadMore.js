import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo } from 'react';
import { View } from 'react-native';
import { msg, Plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '#/state/queries/usePostThread';
import { LINEAR_AVI_WIDTH, REPLY_LINE_WIDTH, TREE_AVI_WIDTH, TREE_INDENT, } from '#/screens/PostThread/const';
import { atoms as a, useTheme } from '#/alf';
import { CirclePlus_Stroke2_Corner0_Rounded as CirclePlus } from '#/components/icons/CirclePlus';
import { Link } from '#/components/Link';
import { Text } from '#/components/Typography';
export const ThreadItemReadMore = memo(function ThreadItemReadMore({ item, view, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const isTreeView = view === 'tree';
    const indent = Math.max(0, item.depth - 1);
    const spacers = isTreeView
        ? Array.from(Array(indent)).map((_, n) => {
            const isSkipped = item.skippedIndentIndices.has(n);
            return (_jsx(View, { style: [
                    t.atoms.border_contrast_low,
                    {
                        borderRightWidth: isSkipped ? 0 : REPLY_LINE_WIDTH,
                        width: TREE_INDENT + TREE_AVI_WIDTH / 2,
                        left: 1,
                    },
                ] }, `${item.key}-padding-${n}`));
        })
        : null;
    return (_jsxs(View, { style: [a.flex_row], children: [spacers, _jsx(View, { style: [
                    t.atoms.border_contrast_low,
                    {
                        marginLeft: isTreeView
                            ? TREE_INDENT + TREE_AVI_WIDTH / 2 - 1
                            : (LINEAR_AVI_WIDTH - REPLY_LINE_WIDTH) / 2 + 16,
                        borderLeftWidth: 2,
                        borderBottomWidth: 2,
                        borderBottomLeftRadius: a.rounded_sm.borderRadius,
                        height: 18, // magic, Link below is 38px tall
                        width: isTreeView ? TREE_INDENT : LINEAR_AVI_WIDTH / 2 + 10,
                    },
                ] }), _jsx(Link, { label: _(msg `Read more replies`), to: item.href, style: [a.pt_sm, a.pb_md, a.gap_xs], children: ({ hovered, pressed }) => {
                    const interacted = hovered || pressed;
                    return (_jsxs(_Fragment, { children: [_jsx(CirclePlus, { fill: interacted
                                    ? t.atoms.text_contrast_high.color
                                    : t.atoms.text_contrast_low.color, width: 18 }), _jsx(Text, { style: [
                                    a.text_sm,
                                    t.atoms.text_contrast_medium,
                                    interacted && a.underline,
                                ], children: _jsxs(Trans, { children: ["Read", ' ', _jsx(Plural, { one: "# more reply", other: "# more replies", value: item.moreReplies })] }) })] }));
                } })] }));
});
//# sourceMappingURL=ThreadItemReadMore.js.map