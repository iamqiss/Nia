import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useProgressGuide, useProgressGuideControls, } from '#/state/shell/progress-guide';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonIcon } from '#/components/Button';
import { TimesLarge_Stroke2_Corner0_Rounded as Times } from '#/components/icons/Times';
import { Text } from '#/components/Typography';
import { FollowDialog } from './FollowDialog';
import { ProgressGuideTask } from './Task';
export function ProgressGuideList({ style }) {
    const t = useTheme();
    const { _ } = useLingui();
    const followProgressGuide = useProgressGuide('follow-10');
    const followAndLikeProgressGuide = useProgressGuide('like-10-and-follow-7');
    const guide = followProgressGuide || followAndLikeProgressGuide;
    const { endProgressGuide } = useProgressGuideControls();
    if (guide) {
        return (_jsxs(View, { style: [a.flex_col, a.gap_md, style], children: [_jsxs(View, { style: [a.flex_row, a.align_center, a.justify_between], children: [_jsx(Text, { style: [
                                t.atoms.text_contrast_medium,
                                a.font_bold,
                                a.text_sm,
                                { textTransform: 'uppercase' },
                            ], children: _jsx(Trans, { children: "Getting started" }) }), _jsx(Button, { variant: "ghost", size: "tiny", color: "secondary", shape: "round", label: _(msg `Dismiss getting started guide`), onPress: endProgressGuide, children: _jsx(ButtonIcon, { icon: Times, size: "sm" }) })] }), guide.guide === 'follow-10' && (_jsxs(_Fragment, { children: [_jsx(ProgressGuideTask, { current: guide.numFollows + 1, total: 10 + 1, title: _(msg `Follow 10 accounts`), subtitle: _(msg `Bluesky is better with friends!`) }), _jsx(FollowDialog, { guide: guide })] })), guide.guide === 'like-10-and-follow-7' && (_jsxs(_Fragment, { children: [_jsx(ProgressGuideTask, { current: guide.numLikes + 1, total: 10 + 1, title: _(msg `Like 10 posts`), subtitle: _(msg `Teach our algorithm what you like`) }), _jsx(ProgressGuideTask, { current: guide.numFollows + 1, total: 7 + 1, title: _(msg `Follow 7 accounts`), subtitle: _(msg `Bluesky is better with friends!`) })] }))] }));
    }
    return null;
}
//# sourceMappingURL=List.js.map